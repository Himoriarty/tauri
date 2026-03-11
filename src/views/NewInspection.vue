<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';
import * as ort from 'onnxruntime-web';
import { readFile } from '@tauri-apps/plugin-fs';
import store from '../store';
import type { Defect } from '../types';

// Ensure WASM backend is configured to fetch its WASM files correctly in Vite/Tauri
ort.env.wasm.numThreads = 1;
ort.env.wasm.wasmPaths = '/wasm/'; // Local copies of ORT WASM engine files

// ─── File state ───────────────────────────────────────────────────────────────
interface UploadedFile { path: string; name: string; status: 'pending' | 'analyzing' | 'done' | 'error'; }

const uploadedFiles = ref<UploadedFile[]>([]);
const currentFile = ref<string>('');    // Path of the file shown in preview
const previewBlobUrl = ref<string>(''); // Blob URL for the <img> preview
const isAnalyzing = ref(false);
const analysisData = ref<any>(null);    // AI results for the current file

// Form fields
const inspectionName = ref('新建路面巡检');
const selectedRouteId = ref<string | number>(1);
const inspector = ref('工程师');
const inspectionDate = ref(new Date().toISOString().split('T')[0]);
const routes = store.getAllRoutes;

// Classes for yolo12s RDD2022 model (trained on road damage dataset)
// Model output shape: [1, 9, 8400] = 4 bbox + 5 classes
const yoloClasses = [
  'D00 纵向裂缝',    // 0: Longitudinal Crack
  'D10 横向裂缝',    // 1: Transverse Crack
  'D20 龟裂',        // 2: Alligator Crack
  'D40 坑洼',        // 3: Pothole
  'Repair 修补'      // 4: Repair
];

// Helper to load image to canvas securely by bypassing asset:// CORS
const loadImageToCanvas = async (src: string): Promise<HTMLImageElement> => {
  return new Promise(async (resolve, reject) => {
    try {
      const img = new Image();
      let objectUrl = '';
      
      if (src.startsWith('http')) {
         img.src = src;
      } else {
         // Read native file bytes using Tauri Plugin FS (avoids asset protocol canvas tainting)
         const bytes = await readFile(src);
         const ext = src.split('.').pop()?.toLowerCase() || 'jpeg';
         const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
         const blob = new Blob([bytes], { type: mimeType });
         objectUrl = URL.createObjectURL(blob);
         img.src = objectUrl;
      }

      img.onload = () => {
         if (objectUrl) URL.revokeObjectURL(objectUrl); // Clean up memory
         resolve(img);
      };
      img.onerror = () => reject(new Error('Cannot load image to Canvas natively: ' + src));
    } catch (err) {
      reject(err);
    }
  });
};

// ─── Preview Blob URL ────────────────────────────────────────────────────────
// Load selected file bytes and create an Object URL so <img> can display it
async function loadPreviewUrl(path: string) {
  if (previewBlobUrl.value) URL.revokeObjectURL(previewBlobUrl.value);
  previewBlobUrl.value = '';
  if (!path || path.startsWith('http')) { previewBlobUrl.value = path; return; }
  const bytes = await readFile(path);
  const ext = path.split('.').pop()?.toLowerCase() || 'jpeg';
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  previewBlobUrl.value = URL.createObjectURL(new Blob([bytes], { type: mime }));
}

watch(currentFile, async (newPath) => {
  analysisData.value = null;
  // Remove old overlay canvas
  const old = document.getElementById('overlay-canvas');
  if (old) old.remove();
  await loadPreviewUrl(newPath);
});

onUnmounted(() => { if (previewBlobUrl.value) URL.revokeObjectURL(previewBlobUrl.value); });

// ─── Upload & File Selection ─────────────────────────────────────────────────
async function handleUpload() {
  try {
    const files = await open({
      multiple: true,
      filters: [{ name: 'Image', extensions: ['jpg', 'png', 'jpeg'] }]
    });
    if (!files) return;
    const list = Array.isArray(files) ? files : [files];
    for (const f of list) {
      const path = f as string;
      if (uploadedFiles.value.some(u => u.path === path)) continue;
      uploadedFiles.value.push({ path, name: path.split('/').pop() || path, status: 'pending' });
    }
    // Auto-select the first newly added file
    if (list.length > 0) selectFile(list[0] as string);
  } catch (e) {
    console.error(e);
  }
}

function selectFile(path: string) {
  currentFile.value = path;
}

async function runAnalysis() {
  if (!currentFile.value) return;
  
  isAnalyzing.value = true;
  // Mark current file as analyzing in the list
  const fileEntry = uploadedFiles.value.find(f => f.path === currentFile.value);
  if (fileEntry) fileEntry.status = 'analyzing';
  
  let img;
  try {
    console.time("Image Loading");
    img = await loadImageToCanvas(currentFile.value);
    console.timeEnd("Image Loading");
  } catch (err) {
    alert("阶段 1 报错 - 图片加载失败: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    isAnalyzing.value = false;
    return;
  }

  const inputSize = 640;
  let tensor;
  try {
    // 1. Create offscreen canvas to resize image exactly to YOLO dimension 640x640
    const canvas = document.createElement('canvas');
    canvas.width = inputSize;
    canvas.height = inputSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get 2d context');
    
    // Draw and resize
    ctx.drawImage(img, 0, 0, inputSize, inputSize);
    
    // 2. Extract pixel data and normalize for Float32 Tensor (NCHW format, 1x3x640x640)
    console.time("Preprocessing");
    const imgData = ctx.getImageData(0, 0, inputSize, inputSize);
    const pixels = imgData.data; // RGBA array
    
    // Float32Array for better performance
    const float32Data = new Float32Array(3 * inputSize * inputSize);
    
    // YOLO format: Normalization (RGB/255) and conversion to NCHW from NHWC
    for (let i = 0; i < inputSize * inputSize; i++) {
        float32Data[i] = pixels[i * 4] / 255.0; // Red
        float32Data[inputSize * inputSize + i] = pixels[i * 4 + 1] / 255.0; // Green
        float32Data[2 * inputSize * inputSize + i] = pixels[i * 4 + 2] / 255.0; // Blue
    }
    tensor = new ort.Tensor('float32', float32Data, [1, 3, inputSize, inputSize]);
    console.timeEnd("Preprocessing");
  } catch (err) {
    alert("阶段 2 报错 - 图像预处理与张量转换失败: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    isAnalyzing.value = false;
    return;
  }

  let session;
  try {
    // 3. Load or reuse ONNX model 
    console.time("Model Loading");
    
    // We pass the string URL; ORT can fetch it smoothly now since COEP is gone.
    session = await ort.InferenceSession.create('/models/yolo12s_RDD2022_best.onnx', {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });
    console.timeEnd("Model Loading");
  } catch (err) {
    alert("阶段 3 报错 - ONNX 模型引擎初始化失败: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    isAnalyzing.value = false;
    return;
  }

  let results;
  try {
    // 4. Run Inference!
    console.time("Inference");
    const feeds: Record<string, ort.Tensor> = {};
    feeds[session.inputNames[0]] = tensor;
    results = await session.run(feeds);
    console.timeEnd("Inference");
  } catch (err) {
    alert("阶段 4 报错 - 推理执行失败: " + JSON.stringify(err, Object.getOwnPropertyNames(err)));
    isAnalyzing.value = false;
    return;
  }

  try {

    // 5. Post-process the output
    console.time("Postprocessing");
    const output = results[session.outputNames[0]].data as Float32Array;
    // YOLOv8 output is [1, 84, 8400] for COCO. 
    // 84 components: 4 bounding box coordinates (cx, cy, w, h) + 80 class confidences.
    // 8400 anchors usually for a 640x640 image.
    // We need to transpose it mentally or physically to [8400, 84] to process easily.
    
    const numAnchors = 8400; // usually depends on output size, standard for YOLOv8s is 8400
    const numClasses = output.length / numAnchors - 4; // 80 generally
    
    const boxes = [];
    const conf_threshold = 0.25;

    for (let i = 0; i < numAnchors; i++) {
        // Find maximum class confidence for this anchor
        let maxClassConf = 0;
        let classIndex = -1;
        
        for (let c = 0; c < numClasses; c++) {
            const confidence = output[(4 + c) * numAnchors + i];
            if (confidence > maxClassConf) {
                maxClassConf = confidence;
                classIndex = c;
            }
        }
        
        // Filter by threshold
        if (maxClassConf > conf_threshold) {
             const cx = output[0 * numAnchors + i];
             const cy = output[1 * numAnchors + i];
             const w = output[2 * numAnchors + i];
             const h = output[3 * numAnchors + i];
             
             // Convert center coordinates to Top-Left/Bottom-Right
             const x1 = cx - w / 2;
             const y1 = cy - h / 2;
             const x2 = cx + w / 2;
             const y2 = cy + h / 2;
             
             boxes.push({
                 label: classIndex < yoloClasses.length ? yoloClasses[classIndex] : `Class ${classIndex}`,
                 confidence: maxClassConf,
                 box: [x1, y1, x2, y2]
             });
        }
    }
    
    // Implement NMS (Non-Maximum Suppression) to prune overlapping boxes
    boxes.sort((a, b) => b.confidence - a.confidence);
    const nmsBoxes = [];
    const iouThreshold = 0.45;

    for (const currentBox of boxes) {
        let shouldKeep = true;
        for (const keptBox of nmsBoxes) {
            // Calculate IoU
            const xA = Math.max(currentBox.box[0], keptBox.box[0]);
            const yA = Math.max(currentBox.box[1], keptBox.box[1]);
            const xB = Math.min(currentBox.box[2], keptBox.box[2]);
            const yB = Math.min(currentBox.box[3], keptBox.box[3]);
            
            const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
            const box1Area = (currentBox.box[2] - currentBox.box[0]) * (currentBox.box[3] - currentBox.box[1]);
            const box2Area = (keptBox.box[2] - keptBox.box[0]) * (keptBox.box[3] - keptBox.box[1]);
            
            const iou = interArea / (box1Area + box2Area - interArea);
            
            if (iou > iouThreshold) {
                shouldKeep = false;
                break;
            }
        }
        if (shouldKeep) {
            nmsBoxes.push(currentBox);
        }
    }
    
    if (nmsBoxes.length === 0) {
        analysisData.value = { diseases: [{ type: "系统通知", severity: "-", description: "未发现明显目标瑕疵..." }]};
    } else {
        const diseases = nmsBoxes.slice(0, 10).map((b, _idx) => ({
           type: b.label,
           severity: (b.confidence * 100).toFixed(1) + "%",
           description: `坐标范围: [${Math.floor(b.box[0])}, ${Math.floor(b.box[1])}] → [${Math.floor(b.box[2])}, ${Math.floor(b.box[3])}]`,
           rawConfidence: b.confidence,
           rawLabel: b.label
        }));
        
        analysisData.value = { diseases };
        
        // --- Sync detections to global store ---
        const fileName = currentFile.value.split('/').pop() || '未命名图片';
        const now = new Date();
        const timestamp = now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

        diseases.forEach((d, idx) => {
          // Determine severity tier from confidence
          const conf = d.rawConfidence;
          const severityLevel: Defect['severity'] = conf >= 0.7 ? 'high' : conf >= 0.4 ? 'medium' : 'low';

          // Map D00/D10/D20/D40 label to a more descriptive Chinese type name  
          const labelMap: Record<string, string> = {
            'D00 纵向裂缝': '纵向裂缝',
            'D10 横向裂缝': '横向裂缝',
            'D20 龟裂':    '龟裂（网状裂缝）',
            'D40 坑洼':    '坑洼',
            'Repair 修补': '修补区域'
          };
          const typeName = labelMap[d.rawLabel] || d.rawLabel;

          const defect: Defect = {
            id: Date.now() + idx,
            routeId: selectedRouteId.value,
            location: `${inspectionName.value} - ${fileName}`,
            coordinates: '',
            type: typeName,
            confidence: Math.round(conf * 100),
            status: '待审核',
            image: currentFile.value,
            timestamp,
            severity: severityLevel,
            description: d.description,
            aiAnalysis: {
              confidence: Math.round(conf * 100),
              model: 'YOLOv12s-RDD2022',
              risk: severityLevel === 'high' ? '高风险' : severityLevel === 'medium' ? '中度风险' : '低风险',
              recommendation: severityLevel === 'high' ? '建议尽快安排修复。' : '建议持续监测。'
            }
          };

          store.addDefect(defect);
        });

        store.incrementRouteDefectCount(selectedRouteId.value);
        // --- End sync to store ---

        // Render boxes on the original image visually
        renderBoxesCanvas(nmsBoxes);
    }
    // Mark file as done in the list
    const entry = uploadedFiles.value.find(f => f.path === currentFile.value);
    if (entry) entry.status = nmsBoxes.length > 0 ? 'done' : 'pending';
    console.timeEnd("Postprocessing");
    
  } catch (err) {
    console.error(err);
    alert("AI 推断引擎出现错误: " + JSON.stringify(err));
    const entry = uploadedFiles.value.find(f => f.path === currentFile.value);
    if (entry) entry.status = 'error';
  } finally {
    isAnalyzing.value = false;
  }
}

function renderBoxesCanvas(boxes: any[]) {
    const container = document.getElementById('image-container');
    const img = document.getElementById('preview-img') as HTMLImageElement;
    if (!container || !img) return;
    
    // Clear old canvas if it exists
    let canvas = document.getElementById('overlay-canvas') as HTMLCanvasElement;
    if (canvas) {
        container.removeChild(canvas);
    }
    
    canvas = document.createElement('canvas');
    canvas.id = 'overlay-canvas';
    // Style coordinates to match the image precisely
    canvas.style.position = 'absolute';
    canvas.style.top = img.offsetTop + 'px';
    canvas.style.left = img.offsetLeft + 'px';
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    // Important: No pointer events so clicks pass through to the image
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // The boxes from YOLO are on a 640x640 scale. We need to map them back to the displayed image's aspect ratio/scale.
    // YOLO padding/resize strategy impacts this mathematically, we assume simple stretch for now
    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 640;
    
    for (const b of boxes) {
        const xA = b.box[0] * scaleX;
        const yA = b.box[1] * scaleY;
        const xB = b.box[2] * scaleX;
        const yB = b.box[3] * scaleY;
        const width = xB - xA;
        const height = yB - yA;
        
        ctx.strokeStyle = '#ef4444'; // Tailwind Red-500
        ctx.lineWidth = 3;
        ctx.strokeRect(xA, yA, width, height);
        
        // Draw label background
        ctx.fillStyle = '#ef4444';
        const textStr = `${b.label} ${(b.confidence*100).toFixed(0)}%`;
        const textWidth = ctx.measureText(textStr).width;
        ctx.fillRect(xA, yA > 20 ? yA - 20 : yA, textWidth + 8, 20);
        
        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(textStr, xA + 4, yA > 20 ? yA - 5 : yA + 15);
    }
}
</script>

<template>
  <div class="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0f172a]">
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto space-y-6">
          
          <!-- Form Section -->
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white dark:bg-[#111a22] p-6 rounded-2xl border border-gray-200 dark:border-[#233648] shadow-sm">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">巡检名称</label>
              <input v-model="inspectionName" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] text-sm focus:border-primary focus:ring-primary dark:text-white" type="text" placeholder="输入巡检名称"/>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">路线选择</label>
              <select v-model="selectedRouteId" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] text-sm focus:border-primary focus:ring-primary dark:text-white">
                <option v-for="r in routes" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">巡检员</label>
              <input v-model="inspector" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] text-sm focus:border-primary focus:ring-primary dark:text-white" type="text" placeholder="巡检员姓名"/>
            </div>
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">巡检日期</label>
              <input v-model="inspectionDate" class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] text-sm focus:border-primary focus:ring-primary dark:text-white" type="date"/>
            </div>
          </div>

          <!-- Upload Area -->
          <div @click="handleUpload" class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-[#1c2a38]/30 p-10 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
            <div class="flex gap-8 mb-5">
              <div class="flex flex-col items-center gap-2 group-hover:-translate-y-1 transition-transform">
                <div class="size-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                  <span class="material-symbols-outlined text-[32px]">add_photo_alternate</span>
                </div>
                <span class="text-xs font-bold text-slate-500">添加图片</span>
              </div>
            </div>
            <h4 class="text-slate-900 dark:text-white font-bold text-lg mb-1">点击选择路面图片文件（支持多选）</h4>
            <p class="text-slate-500 dark:text-slate-400 text-sm">支持 JPG、PNG 格式</p>
          </div>

          <!-- File Grid -->
          <div v-if="uploadedFiles.length > 0">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                待处理文件
                <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
                  {{ uploadedFiles.filter(f => f.status === 'pending' || f.status === 'analyzing').length }} 待分析
                </span>
                <span v-if="uploadedFiles.some(f => f.status === 'done')" class="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 text-xs">
                  {{ uploadedFiles.filter(f => f.status === 'done').length }} 已完成
                </span>
              </h3>
              <button @click="handleUpload" class="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                <span class="material-symbols-outlined text-[16px]">add</span> 继续添加
              </button>
            </div>
            
            <div class="flex flex-col gap-2">
              <div
                v-for="file in uploadedFiles"
                :key="file.path"
                @click="selectFile(file.path)"
                :class="[
                  'group flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all bg-white dark:bg-[#1c2a38]',
                  file.path === currentFile
                    ? 'border-primary shadow-sm shadow-primary/10'
                    : 'border-transparent dark:border-[#233648] hover:border-gray-200 dark:hover:border-gray-600'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="size-8 rounded bg-gray-100 dark:bg-[#111a22] flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-slate-400 text-[18px]">image</span>
                  </div>
                  <div class="truncate">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ file.name }}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5">{{ file.path === currentFile ? '预览中' : '未选中' }}</p>
                  </div>
                </div>

                <!-- Status badge -->
                <div class="shrink-0 ml-4">
                  <span v-if="file.status === 'pending'" class="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">schedule</span> 待分析
                  </span>
                  <span v-else-if="file.status === 'analyzing'" class="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px] animate-spin">sync</span> 分析中
                  </span>
                  <span v-else-if="file.status === 'done'" class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">check_circle</span> 已完成
                  </span>
                  <span v-else-if="file.status === 'error'" class="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">error</span> 失败
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: Annotation -->
    <aside class="w-[380px] flex flex-col border-l border-gray-200 dark:border-[#233648] bg-white dark:bg-[#111a22] shrink-0 z-40">
      <div class="h-14 px-5 border-b border-gray-200 dark:border-[#233648] flex justify-between items-center shrink-0">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">edit_document</span>
          识别与预览
        </h3>
        <div class="flex gap-1">
          <button class="size-8 rounded hover:bg-slate-100 dark:hover:bg-[#233648] text-slate-500 transition-colors">
            <span class="material-symbols-outlined text-[18px]">undo</span>
          </button>
          <button class="size-8 rounded hover:bg-slate-100 dark:hover:bg-[#233648] text-slate-500 transition-colors">
            <span class="material-symbols-outlined text-[18px]">redo</span>
          </button>
        </div>
      </div>
      
      <!-- Image Editor Mock -->
      <div class="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-[#0f172a] relative">
        <div id="image-container" class="flex-1 overflow-hidden relative cursor-crosshair">
          <!-- Live preview: shows the selected file via Blob URL -->
          <img
            v-if="previewBlobUrl"
            id="preview-img"
            class="w-full h-full object-contain p-4"
            :src="previewBlobUrl"
            alt="预览图"
          />
          <div v-else class="flex-1 h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <span class="material-symbols-outlined text-[48px] opacity-40">image_search</span>
            <p class="text-sm">从左侧上传图片后在此预览</p>
          </div>
        </div>
        
        <div class="h-8 bg-white dark:bg-[#111a22] border-t border-gray-200 dark:border-[#233648] flex items-center justify-between px-4 text-[10px] text-slate-500 shrink-0">
          <span>1920 x 1080 px</span>
          <span>缩放: 45%</span>
        </div>
      </div>

      <!-- Annotation Form -->
      <div class="p-5 border-t border-gray-200 dark:border-[#233648] bg-white dark:bg-[#111a22] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">标注详情 #1</h4>
          <button class="text-red-500 hover:text-red-600 transition-colors">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
        <div class="space-y-4">
          <!-- 病害类型 + AI 识别结果 — 合并为一个动态区块 -->
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">病害类型</label>

            <!-- 状态一：未上传图片 -->
            <div v-if="!currentFile" class="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] px-3 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">upload_file</span>
              请先上传图片
            </div>

            <!-- 状态二：已上传但未分析 -->
            <div v-else-if="!analysisData && !isAnalyzing" class="w-full rounded-lg border border-dashed border-primary/40 bg-primary/5 dark:bg-blue-900/10 px-3 py-3 text-xs text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">smart_toy</span>
              点击"开始AI识别"后自动确定病害类型
            </div>

            <!-- 状态三：识别中 -->
            <div v-else-if="isAnalyzing" class="w-full rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-3 text-xs text-blue-600 flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] animate-spin">sync</span>
              AI 正在识别病害类型...
            </div>

            <!-- 状态四：识别完成，展示检测结果 -->
            <div v-else-if="analysisData && analysisData.diseases && analysisData.diseases.length > 0" class="space-y-1.5">
              <div
                v-for="(disease, idx) in analysisData.diseases"
                :key="idx"
                class="flex items-start justify-between gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38]"
              >
                <div class="min-w-0">
                  <p class="font-bold text-xs text-slate-900 dark:text-white truncate">{{ disease.type }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ disease.description }}</p>
                </div>
                <span class="shrink-0 text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">{{ disease.severity }}</span>
              </div>
            </div>

            <!-- 状态五：识别完成但未发现病害 -->
            <div v-else-if="analysisData" class="w-full rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 px-3 py-3 text-xs text-green-600 flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              未发现明显病害
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">备注</label>
            <textarea class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-[#1c2a38] text-sm dark:text-white h-20 resize-none focus:border-primary focus:ring-primary" placeholder="输入现场观察详情..."></textarea>
          </div>
        </div>
          <div class="mt-6">
            <button @click="runAnalysis" :disabled="!currentFile || isAnalyzing" class="w-full py-3.5 px-4 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
              <span class="material-symbols-outlined text-[20px]">{{ isAnalyzing ? 'hourglass_top' : 'smart_toy' }}</span>
               {{ isAnalyzing ? '正在分析中...' : '开始AI识别并保存' }}
            </button>
          <p class="text-[10px] text-center text-slate-400 mt-3 italic">点击后系统将自动进行深度学习损伤评估</p>
        </div>
      </div>
    </aside>
  </div>
</template>
