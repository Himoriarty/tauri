<template>
  <el-dialog
    v-model="dialogVisible"
    title="病害详情分析"
    width="90%"
    class="max-w-4xl"
    :before-close="handleClose"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" v-if="data">
      <!-- Image Section -->
      <div class="flex flex-col gap-2">
        <div class="relative rounded-lg overflow-hidden h-64 md:h-80 bg-slate-900 flex items-center justify-center">
            <img :src="data.image" class="w-full h-full object-cover" alt="Defect Detail" />
            <div class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                AI 置信度: {{ data.confidence }}
            </div>
        </div>
        <div class="flex gap-2 mt-2 overflow-x-auto pb-2">
             <!-- Placeholder thumbnails -->
            <div class="w-20 h-20 rounded bg-slate-200 shrink-0 cursor-pointer border-2 border-primary"></div>
            <div class="w-20 h-20 rounded bg-slate-200 shrink-0 cursor-pointer hover:border-2 hover:border-slate-400"></div>
            <div class="w-20 h-20 rounded bg-slate-200 shrink-0 cursor-pointer hover:border-2 hover:border-slate-400"></div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="flex flex-col gap-4">
        <div>
            <div class="flex items-center justify-between mb-2">
                <span class="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">{{ data.type }}</span>
                <span class="text-sm text-slate-500">{{ data.timestamp }}</span>
            </div>
            <h2 class="text-xl font-bold dark:text-white mb-1">{{ data.location }}</h2>
            <p class="text-slate-500 text-sm">坐标: {{ data.coordinates }}</p>
        </div>

        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 class="text-sm font-bold mb-2 flex items-center gap-2">
                <el-icon class="text-primary"><Cpu /></el-icon> AI 分析报告
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                系统检测到{{ data.type }}病害，严重程度判定为 <span class="text-danger font-bold">高</span>。
                建议立即安排人工复核。与历史数据对比，该区域病害发展速度较快（+15%/年）。
            </p>
        </div>

        <div class="space-y-3">
             <div class="flex justify-between items-center text-sm border-b border-slate-100 p-2">
                <span class="text-slate-500">结构组件</span>
                <span class="font-medium">主梁 B-2</span>
             </div>
             <div class="flex justify-between items-center text-sm border-b border-slate-100 p-2">
                <span class="text-slate-500">预估修复成本</span>
                <span class="font-medium">¥ 12,000</span>
             </div>
             <div class="flex justify-between items-center text-sm border-b border-slate-100 p-2">
                <span class="text-slate-500">上次维护</span>
                <span class="font-medium">2023-11-12</span>
             </div>
        </div>

        <div class="mt-auto flex gap-3 justify-end">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary">生成工单</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Cpu } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: boolean
  data: any
}>()

const emit = defineEmits(['update:modelValue'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>
