<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import store from '../store'

const route = useRoute()

// Computed property to get the current defect
const defect = computed(() => {
    const id = route.params.id
    if (id) {
        const found = store.getDefectById(id as string).value
        if (found) return found
    }
    // Fallback to the first defect if no ID or not found (for demo resilience)
    return store.getAllDefects.value[0] || {} as any
})

// Helper for severity badge style
const getSeverityClass = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
    if (severity === 'medium') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
}

const getSeverityLabel = (severity: string) => {
    if (severity === 'high') return '严重等级 3'
    if (severity === 'medium') return '严重等级 2'
    return '严重等级 1'
}

</script>

<template>
  <div class="flex flex-col gap-6 p-6 max-w-[1440px] mx-auto w-full h-[calc(100vh-64px)] overflow-y-auto">
    <!-- Breadcrumbs -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <router-link to="/" class="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[18px]">home</span>
        </router-link>
        <span class="text-slate-400 dark:text-[#2c3b4b]">/</span>
        <a class="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors" href="#">项目 A - 101高速公路</a>
        <span class="text-slate-400 dark:text-[#2c3b4b]">/</span>
        <router-link to="/map-view" class="text-slate-500 dark:text-[#92adc9] hover:text-primary transition-colors">4号桥（南向）</router-link>
        <span class="text-slate-400 dark:text-[#2c3b4b]">/</span>
        <span class="text-slate-900 dark:text-white font-medium">缺陷 #{{ defect.id }}</span>
      </div>
      
      <!-- Title Header -->
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#2c3b4b]">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">ID-{{ defect.id }}: {{ defect.type }}</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border" :class="getSeverityClass(defect.severity)">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="defect.severity === 'high' ? 'bg-red-500' : (defect.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500')"></span>
              {{ getSeverityLabel(defect.severity) }}
            </span>
          </div>
          <p class="text-slate-500 dark:text-[#92adc9] max-w-2xl text-base">
            {{ defect.description || '暂无详细描述' }}
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <button class="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-slate-200 dark:border-[#2c3b4b] text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-[#1a2632] transition-colors">
            <span class="material-symbols-outlined text-[20px]">print</span>
            <span>导出报告</span>
          </button>
          <button class="flex items-center justify-center gap-2 px-5 h-10 rounded-lg bg-primary hover:bg-[#1170d2] text-white font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            <span class="material-symbols-outlined text-[20px]">check_circle</span>
            <span>人工确认</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
      <!-- Left Column: Visuals & Chart -->
      <div class="xl:col-span-8 flex flex-col gap-6">
        <!-- Comparison Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold flex items-center gap-2 dark:text-white">
              <span class="material-symbols-outlined text-primary">compare</span>
              时间轴对比
            </h3>
            <div class="flex items-center gap-3 bg-white dark:bg-[#1a2632] p-1.5 rounded-lg border border-slate-200 dark:border-[#2c3b4b]">
              <span class="text-xs font-medium text-slate-500 dark:text-[#92adc9] pl-2">图层:</span>
              <button class="flex items-center gap-1.5 px-3 py-1 rounded bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <span class="material-symbols-outlined text-[16px]">check_box</span>
                AI 识别结果
              </button>
              <button class="flex items-center gap-1.5 px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-[#111a22] text-slate-500 dark:text-[#92adc9] text-xs font-medium transition-colors">
                <span class="material-symbols-outlined text-[16px]">grid_4x4</span>
                网格
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Historical Image -->
            <div class="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#2c3b4b] bg-slate-900 shadow-sm">
              <div class="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                <div class="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-medium text-white border border-white/10 shadow-sm">
                  <span class="text-slate-400 mr-1">日期:</span> {{ defect.historyDate || 'N/A' }}
                </div>
                <div class="bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-300 border border-white/5">
                  历史图像
                </div>
              </div>
              <div class="aspect-[4/3] w-full bg-slate-800 relative cursor-crosshair">
                <div class="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105"  :style="{ backgroundImage: 'url(' + (defect.historyImage || defect.image) + ')' }"></div>
              </div>
              <div class="bg-white dark:bg-[#1a2632] px-4 py-3 flex justify-between items-center text-xs border-t border-slate-200 dark:border-[#2c3b4b]">
                <span class="text-slate-500 dark:text-[#92adc9]">面积: <span class="font-mono text-slate-900 dark:text-white font-bold">{{ defect.area ? (parseInt(defect.area) * 0.8).toFixed(1) + ' cm²' : 'N/A' }}</span></span>
                <span class="text-slate-500 dark:text-[#92adc9]">裂缝宽度: <span class="font-mono text-slate-900 dark:text-white font-bold">{{ defect.width ? (parseFloat(defect.width) * 0.8).toFixed(1) + ' mm' : 'N/A' }}</span></span>
              </div>
            </div>

            <!-- Current Image -->
            <div class="group relative rounded-xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/10 bg-slate-900">
              <div class="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start pointer-events-none">
                <div class="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-bold text-white shadow-sm flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  当前图像
                </div>
                <button class="pointer-events-auto bg-black/40 hover:bg-black/60 p-1.5 rounded text-white transition-colors">
                  <span class="material-symbols-outlined text-[18px]">open_in_full</span>
                </button>
              </div>
              <div class="aspect-[4/3] w-full bg-slate-800 relative cursor-crosshair">
                <div class="w-full h-full bg-cover bg-center transition-transform duration-300 hover:scale-105" :style="{ backgroundImage: 'url(' + defect.image + ')' }"></div>
                <div class="absolute top-[32%] left-[38%] w-[22%] h-[20%] border-2 border-primary bg-primary/20 rounded-sm shadow-[0_0_15px_rgba(19,127,236,0.3)] flex items-end justify-start overflow-hidden group/box">
                  <div class="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 transform translate-y-full group-hover/box:translate-y-0 transition-transform">
                    AI 置信度 {{ defect.confidence }}%
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-[#1a2632] px-4 py-3 flex justify-between items-center text-xs border-t border-slate-200 dark:border-[#2c3b4b]">
                <span class="text-slate-500 dark:text-[#92adc9]">面积: <span class="font-mono text-red-600 dark:text-red-400 font-bold">{{ defect.area || 'N/A' }}</span> <span v-if="defect.growthRate" class="text-[10px] ml-1 text-red-500">({{ defect.growthRate }})</span></span>
                <span class="text-slate-500 dark:text-[#92adc9]">裂缝宽度: <span class="font-mono text-red-600 dark:text-red-400 font-bold">{{ defect.width || 'N/A' }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-[#2c3b4b] rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">增长分析图表</h3>
              <p class="text-sm text-slate-500 dark:text-[#92adc9]">过去12个月的表面积增长测量</p>
            </div>
          <!-- Static dropdown for demo -->
            <select class="bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b] text-slate-700 dark:text-[#92adc9] text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50">
              <option>表面积 (cm²)</option>
              <option>裂缝宽度 (mm)</option>
              <option>深度 (mm)</option>
            </select>
          </div>
          
          <div class="w-full h-48 relative pt-4 pr-4">
              <!-- Reusing static chart structure for visual consistency, in a real app this would bind to defect history data -->
            <!-- Y Axis Labels -->
            <div class="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-[10px] text-slate-400 font-mono text-right pr-2">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>
            <!-- Chart Area -->
            <div class="ml-8 h-full border-l border-b border-slate-200 dark:border-[#2c3b4b] relative">
              <div class="absolute top-0 w-full h-px bg-slate-100 dark:bg-[#2c3b4b]/50"></div>
              <div class="absolute top-1/4 w-full h-px bg-slate-100 dark:bg-[#2c3b4b]/50"></div>
              <div class="absolute top-2/4 w-full h-px bg-slate-100 dark:bg-[#2c3b4b]/50"></div>
              <div class="absolute top-3/4 w-full h-px bg-slate-100 dark:bg-[#2c3b4b]/50"></div>
              <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientLine" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#137fec" stop-opacity="0.2"></stop>
                    <stop offset="100%" stop-color="#137fec" stop-opacity="0"></stop>
                  </linearGradient>
                </defs>
                <path class="opacity-50" d="M0 130 L150 120 L300 110 L450 80 L600 40" fill="url(#gradientLine)" stroke="none"></path>
                <path d="M0 130 L150 120 L300 110 L450 80 L600 40" fill="none" stroke="#137fec" stroke-linecap="round" stroke-width="3" vector-effect="non-scaling-stroke"></path>
                
                <!-- Data Points -->
                <circle class="fill-background-light dark:fill-[#111a22] stroke-primary" cx="0%" cy="130" r="4" stroke-width="2"></circle>
                <circle class="fill-background-light dark:fill-[#111a22] stroke-primary" cx="25%" cy="120" r="4" stroke-width="2"></circle>
                <circle class="fill-background-light dark:fill-[#111a22] stroke-primary" cx="50%" cy="110" r="4" stroke-width="2"></circle>
                <circle class="fill-background-light dark:fill-[#111a22] stroke-primary" cx="75%" cy="80" r="4" stroke-width="2"></circle>
                <circle class="fill-primary stroke-white dark:stroke-[#1a2632]" cx="100%" cy="40" r="6" stroke-width="2"></circle>
              </svg>
              <!-- Tooltip Mock -->
              <div class="absolute top-[20px] right-0 transform -translate-x-1/2 -translate-y-full pb-2 flex flex-col items-center">
                <div class="bg-slate-900 text-white text-xs py-1 px-2 rounded font-bold mb-1 shadow-lg whitespace-nowrap">
                  {{ defect.area || '15.2 cm²' }}
                </div>
                <div class="w-px h-2 bg-slate-900"></div>
              </div>
            </div>
            <!-- X Axis Labels -->
            <div class="ml-8 mt-2 flex justify-between text-[10px] text-slate-400 font-mono uppercase">
              <span>23年11月</span>
              <span>24年2月</span>
              <span>24年5月</span>
              <span>24年8月</span>
              <span class="text-primary font-bold">24年11月</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Analysis & Form -->
      <div class="xl:col-span-4 flex flex-col gap-6">
        <!-- AI Diagnosis -->
        <div class="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#2c3b4b] shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined">smart_toy</span>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">AI 诊断</h4>
              <p class="text-xs text-slate-500 dark:text-[#92adc9]">模型 {{ defect.aiAnalysis?.model || 'v3.0' }}</p>
            </div>
          </div>
          
          <div class="flex flex-col gap-4">
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b]">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-medium text-slate-500 dark:text-[#92adc9]">AI 置信度</span>
                <span class="text-sm font-bold text-primary">{{ defect.aiAnalysis?.confidence || defect.confidence }}%</span>
              </div>
              <div class="w-full bg-slate-200 dark:bg-[#2c3b4b] rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" :style="{ width: (defect.aiAnalysis?.confidence || defect.confidence) + '%' }"></div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b]">
                <span class="block text-xs text-slate-500 dark:text-[#92adc9] mb-1">病害类型</span>
                <span class="block font-bold text-slate-900 dark:text-white">{{ defect.type }}</span>
              </div>
              <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b]">
                <span class="block text-xs text-slate-500 dark:text-[#92adc9] mb-1">材料</span>
                <span class="block font-bold text-slate-900 dark:text-white">{{ defect.material || 'N/A' }}</span>
              </div>
            </div>

            <div v-if="defect.aiAnalysis?.risk" class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-3 rounded-lg flex gap-3">
              <span class="material-symbols-outlined text-yellow-600 dark:text-yellow-500 text-lg mt-0.5">warning</span>
              <div>
                <h5 class="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase mb-0.5">{{ defect.aiAnalysis.risk }}</h5>
                <p class="text-xs text-yellow-700 dark:text-yellow-400/80 leading-relaxed">
                  {{ defect.aiAnalysis.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Engineer Verification Form -->
        <div class="bg-white dark:bg-[#1a2632] rounded-xl p-5 border border-slate-200 dark:border-[#2c3b4b] shadow-sm h-full flex flex-col">
          <h4 class="font-bold text-slate-900 dark:text-white mb-4">工程师验证</h4>
          <form class="flex flex-col gap-4 h-full" @submit.prevent>
            <div>
              <label class="block text-xs font-medium text-slate-500 dark:text-[#92adc9] mb-1.5">损害分类</label>
              <div class="relative">
                <select class="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b] text-slate-900 dark:text-white text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary appearance-none">
                  <option selected>{{ defect.type }}（已确认）</option>
                  <option>误报</option>
                  <option>需进一步检测</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-lg">expand_more</span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 dark:text-[#92adc9] mb-1.5">严重程度调整</label>
              <div class="flex gap-2">
                <button 
                  class="flex-1 py-2 rounded-lg border text-xs font-medium transition-all"
                  :class="defect.severity === 'low' ? 'bg-emerald-600 text-white shadow-md' : 'border-slate-200 dark:border-[#2c3b4b] hover:bg-slate-50 dark:hover:bg-[#111a22] text-slate-600 dark:text-[#92adc9]'"
                  type="button"
                >低</button>
                <button 
                  class="flex-1 py-2 rounded-lg border text-xs font-medium transition-all"
                  :class="defect.severity === 'medium' ? 'bg-amber-500 text-white shadow-md' : 'border-slate-200 dark:border-[#2c3b4b] hover:bg-slate-50 dark:hover:bg-[#111a22] text-slate-600 dark:text-[#92adc9]'"
                  type="button"
                >中</button>
                <button 
                  class="flex-1 py-2 rounded-lg border text-xs font-medium transition-all"
                  :class="defect.severity === 'high' ? 'bg-red-600 text-white shadow-md' : 'border-slate-200 dark:border-[#2c3b4b] hover:bg-slate-50 dark:hover:bg-[#111a22] text-slate-600 dark:text-[#92adc9]'"
                  type="button"
                >高</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 dark:text-[#92adc9] mb-1.5">备注</label>
              <textarea class="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#2c3b4b] text-slate-900 dark:text-white text-sm rounded-lg p-3 min-h-[100px] outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-slate-400 dark:placeholder:text-[#2c3b4b]" placeholder="添加具体观察笔记..."></textarea>
            </div>
            <div class="mt-auto pt-4 flex flex-col gap-3">
              <button class="w-full py-2.5 rounded-lg bg-primary hover:bg-[#1170d2] text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="button">
                <span class="material-symbols-outlined text-[18px]">save</span>
                保存分析
              </button>
              <button class="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2" type="button">
                <span class="material-symbols-outlined text-[18px]">flag</span>
                标记为紧急维修
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
