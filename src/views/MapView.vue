<template>
  <div class="flex flex-1 overflow-hidden relative h-[calc(100vh-64px)]">
    <!-- Sidebar -->
    <aside class="w-80 flex flex-col border-r border-gray-200 dark:border-[#233648] bg-white dark:bg-[#111a22] shrink-0 z-20 shadow-xl">
      <!-- Search -->
      <div class="p-4 border-b border-gray-200 dark:border-[#233648]">
        <div class="flex w-full items-center rounded-lg bg-slate-50 dark:bg-[#1c2a38] border border-gray-200 dark:border-[#2d445a] text-slate-500 h-9 px-3 focus-within:ring-1 focus-within:ring-primary">
          <span class="material-symbols-outlined text-[18px]">search</span>
          <input class="w-full bg-transparent border-none text-xs ml-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0" placeholder="搜索路线或病害 ID"/>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <!-- Route List -->
        <div class="p-4">
          <h3 class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">路线列表</h3>
          <div class="space-y-2">
            <button 
              v-for="route in routes" 
              :key="route.id"
              class="w-full group flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
              :class="[
                route.riskLevel === 'medium' ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' : 'border-transparent hover:bg-slate-50 dark:hover:bg-[#1c2a38]'
              ]"
            >
              <div 
                class="flex items-center justify-center rounded-lg size-9"
                :class="[
                  route.riskLevel === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' :
                  route.riskLevel === 'medium' ? 'bg-primary text-white' :
                  'bg-slate-100 dark:bg-[#233648] text-slate-500 dark:text-slate-400'
                ]"
              >
                <span class="material-symbols-outlined text-[20px]">{{ getRouteIcon(route.riskLevel) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p 
                  class="text-sm font-semibold truncate"
                  :class="route.riskLevel === 'medium' ? 'text-primary dark:text-white' : 'text-slate-900 dark:text-white'"
                >{{ route.name }}</p>
                <p 
                  class="text-[11px] font-medium"
                  :class="[
                    route.riskLevel === 'high' ? 'text-red-500' :
                    route.riskLevel === 'medium' ? 'text-amber-500' :
                    'text-emerald-500'
                  ]"
                >{{ route.status }}</p>
              </div>
            </button>
          </div>
        </div>
        <div class="h-px bg-gray-100 dark:bg-[#233648] mx-4 my-2"></div>
        
        <!-- Filters -->
        <div class="p-4 space-y-6">
          <div>
            <h3 class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">病害类型筛选</h3>
            <div class="space-y-2.5">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input checked class="rounded border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-[#1c2a38] text-primary focus:ring-primary/50 size-4" type="checkbox"/>
                <span class="text-sm text-slate-600 dark:text-slate-300">混凝土裂缝</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input checked class="rounded border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-[#1c2a38] text-primary focus:ring-primary/50 size-4" type="checkbox"/>
                <span class="text-sm text-slate-600 dark:text-slate-300">路面坑槽</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-[#1c2a38] text-primary focus:ring-primary/50 size-4" type="checkbox"/>
                <span class="text-sm text-slate-600 dark:text-slate-300">结构剥落</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input class="rounded border-gray-300 dark:border-gray-600 bg-slate-50 dark:bg-[#1c2a38] text-primary focus:ring-primary/50 size-4" type="checkbox"/>
                <span class="text-sm text-slate-600 dark:text-slate-300">钢筋锈蚀</span>
              </label>
            </div>
          </div>
          
          <!-- Severity Toggles -->
          <div>
            <h3 class="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">严重程度</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2a38] cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="size-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-200">高风险 (严重)</span>
                </div>
                <div class="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                  <input checked class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" id="t1" type="checkbox"/>
                  <label class="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer" for="t1"></label>
                </div>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2a38] cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="size-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-200">中风险 (普通)</span>
                </div>
                <div class="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                  <input checked class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" id="t2" type="checkbox"/>
                  <label class="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer" for="t2"></label>
                </div>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2a38] cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-200">低风险 (轻微)</span>
                </div>
                <div class="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                  <input class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300" id="t3" type="checkbox"/>
                  <label class="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer" for="t3"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- New Inspection Button -->
      <div class="p-4 border-t border-gray-200 dark:border-[#233648] bg-slate-50/50 dark:bg-[#0d141b]">
        <router-link to="/new-inspection" class="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined text-[20px]">add_location_alt</span>
          发起新巡检任务
        </router-link>
      </div>
    </aside>

    <!-- Map Area -->
    <section class="flex-1 relative bg-[#0f172a] overflow-hidden">
      <!-- Background Map Image -->
      <div class="absolute inset-0 z-0 bg-cover bg-center opacity-80" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuA__WDhboGoe7ovHceJEHctR7bjJZ8wA2h-llCLD3W-kDB7fJPVdV73rNplrssv9jP9dWc-pxQlU3zkc3GL1pSxtZOcbO_40r-QewmztjS75tqLTRM8CePRwrfrVc2KMDWN05IVZEBidsy_8UKHyj4Qj3QoPDmuLKonb37vuQHEHVKXuaXRV9mxjaxCrAzal4hzD4YSfykNXLMz6gUzME_emk3ymzgOSkCnRLZ2Mdls4MHn2hhh9sVNWzXLBTbf1p-ZvCQsZdc1K0pk'); filter: grayscale(100%) contrast(120%) brightness(40%);"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111a22]/60 pointer-events-none z-0"></div>
      
      <!-- Map Controls -->
      <div class="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button class="size-9 bg-white dark:bg-[#233648] rounded-lg shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#344c63]">
          <span class="material-symbols-outlined text-[20px]">layers</span>
        </button>
        <button class="size-9 bg-white dark:bg-[#233648] rounded-lg shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#344c63]">
          <span class="material-symbols-outlined text-[20px]">my_location</span>
        </button>
      </div>
      
      <div class="absolute bottom-6 right-6 flex flex-col z-10">
        <button class="size-10 bg-white dark:bg-[#233648] rounded-t-lg border-b border-gray-200 dark:border-gray-700 shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#344c63]">
          <span class="material-symbols-outlined text-[20px]">add</span>
        </button>
        <button class="size-10 bg-white dark:bg-[#233648] rounded-b-lg shadow-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#344c63]">
          <span class="material-symbols-outlined text-[20px]">remove</span>
        </button>
      </div>

      <!-- Time Contrast Toggle -->
      <div class="absolute top-4 left-4 z-10">
        <div class="flex items-center gap-3 bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/20">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">时间对比:</span>
          <label class="inline-flex items-center cursor-pointer">
            <input checked class="sr-only peer" type="checkbox"/>
            <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            <span class="ms-2 text-xs font-bold text-slate-700 dark:text-white">与去年同期</span>
          </label>
        </div>
      </div>

      <!-- Map Markers (Dynamic) -->
      <div 
        v-for="defect in defects" 
        :key="defect.id"
        class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:z-30 transition-all duration-300"
        :style="{ 
            // Mock positioning based on simple hash of ID to scatter them on screen for demo
            // In real app, projection logic would convert lat/lng to pixels
            top: (30 + (Number(defect.id) % 50)) + '%', 
            left: (20 + (Number(defect.id) % 70)) + '%' 
        }"
        @click="selectDefect(defect.id)"
      >
        <div class="relative flex items-center justify-center group">
          <div v-if="selectedDefectId === defect.id" class="absolute size-10 bg-red-500/30 rounded-full animate-ping"></div>
          
           <!-- Marker Dot -->
          <div 
            class="size-4 rounded-full border-2 border-white dark:border-[#111a22] shadow-lg transition-transform group-hover:scale-125"
            :class="[
                defect.severity === 'high' ? 'bg-red-500 shadow-red-500/50' : 
                defect.severity === 'medium' ? 'bg-amber-500 shadow-amber-500/50' : 
                'bg-emerald-500 shadow-emerald-500/50'
            ]"
          ></div>
          
          <!-- Tooltip on Hover -->
          <div class="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {{ defect.type }}
          </div>
        </div>
      </div>

      <!-- Detail Card (Floating - Dynamic) -->
      <transition 
          enter-active-class="transform transition ease-out duration-300" 
          enter-from-class="translate-y-10 opacity-0" 
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transform transition ease-in duration-200" 
          leave-from-class="translate-y-0 opacity-100" 
          leave-to-class="translate-y-10 opacity-0"
      >
        <div 
            v-if="selectedDefect" 
            class="absolute top-[50%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-20"
             :style="{ 
                // Position relative to selected marker (mock offset)
                 top: (30 + (Number(selectedDefect.id) % 50)) + '%', 
                 left: (20 + (Number(selectedDefect.id) % 70)) + '%' 
            }"
        >
            <!-- Connector Line -->
             <div class="absolute -top-16 -left-16 w-16 h-16 border-b-2 border-r-2 border-white/50 rounded-br-3xl pointer-events-none"></div>

            <div class="relative flex items-center justify-center mb-2 -translate-y-6">
                <div class="absolute size-12 bg-amber-500/20 rounded-full"></div>
                <div class="size-6 bg-amber-500 rounded-full border-[3px] border-white dark:border-[#111a22] shadow-xl flex items-center justify-center text-white text-[10px] font-bold">!</div>
            </div>

            <div class="w-80 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#334155] overflow-hidden">
            <div class="relative h-36 bg-gray-200 dark:bg-gray-800">
                <img class="w-full h-full object-cover" :src="selectedDefect.image" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent"></div>
                <div class="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-md px-2 py-1 text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">AI 识别信息</div>
                <div class="absolute bottom-3 left-3">
                <h4 class="text-white font-bold text-base">检测到{{ selectedDefect.type }}</h4>
                <p class="text-slate-300 text-[10px] flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">location_on</span>
                    {{ selectedDefect.coordinates }} ({{ selectedDefect.location }})
                </p>
                </div>
            </div>
            <div class="p-4 pt-3">
                <div class="flex justify-between items-center mb-4">
                <div>
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">严重程度</span>
                    <div class="flex items-center gap-1.5 mt-1">
                    <div class="h-1.5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            class="h-full w-[65%]"
                            :class="[
                                selectedDefect.severity === 'high' ? 'bg-red-500' : 
                                selectedDefect.severity === 'medium' ? 'bg-amber-500' : 
                                'bg-emerald-500'
                            ]"
                        ></div>
                    </div>
                    <span 
                        class="text-xs font-bold"
                        :class="[
                            selectedDefect.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                            selectedDefect.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 
                            'text-emerald-600 dark:text-emerald-400'
                        ]"
                    >
                        {{ selectedDefect.severity === 'high' ? '高风险' : (selectedDefect.severity === 'medium' ? '中度风险' : '低风险') }}
                    </span>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tight">检测时间</span>
                    <span class="text-slate-700 dark:text-white text-xs font-semibold">{{ selectedDefect.timestamp.split(' ')[0] }}</span>
                </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                <router-link :to="'/damage-comparison/' + selectedDefect.id" class="bg-primary hover:bg-blue-600 text-white text-[12px] py-2.5 rounded-xl font-bold transition-colors text-center">病害详情</router-link>
                <button class="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-[#334155] text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-[#475569] text-[12px] font-bold py-2.5 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">compare</span>
                    查看历史对比
                </button>
                </div>
            </div>
            </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import store from '../store'

const routes = store.getAllRoutes
const defects = store.getAllDefects
const selectedDefectId = ref<string | number | null>(null)

const selectedDefect = computed(() => {
  return defects.value.find(d => d.id === selectedDefectId.value)
})

const getRouteIcon = (level: string) => {
  if (level === 'high') return 'warning'
  if (level === 'medium') return 'add_road'
  return 'subway' // subway or check_circle for good
}

const selectDefect = (id: string | number) => {
    if (selectedDefectId.value === id) {
        selectedDefectId.value = null
    } else {
        selectedDefectId.value = id
    }
}
</script>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #137fec;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #137fec;
}
.dark .toggle-checkbox {
  background-color: #101922;
  border-color: #334155;
}
.dark .toggle-label {
  background-color: #334155;
}
</style>
