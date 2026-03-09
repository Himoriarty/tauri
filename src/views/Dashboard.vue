<template>
  <div class="max-w-[1600px] mx-auto flex flex-col gap-8 p-4 md:p-8">
    
    <!-- Top Stats & Filter Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl md:text-4xl font-black tracking-tight dark:text-white text-slate-900">巡检概览 - A区域</h2>
        <p class="text-slate-500 dark:text-slate-400 text-base">监控基础设施健康状况及AI检测状态</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex bg-white dark:bg-card-dark rounded-lg p-1 shadow-sm border border-slate-200 dark:border-slate-800">
           <button 
            v-for="range in ['24h', '7d', '30d']" 
            :key="range"
            @click="activeRange = range"
            :class="[
              'px-4 py-1.5 rounded text-xs font-medium transition-colors',
              activeRange === range 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ range === '24h' ? '过去24小时' : range === '7d' ? '近7天' : '近30天' }}
          </button>
        </div>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20">
          <span class="material-symbols-outlined text-[20px]">download</span>
          导出报告
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-5xl text-primary">straighten</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">已巡检总里程</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold dark:text-white text-slate-900">{{ currentStats.distance }} 公里</h3>
          <span class="text-xs font-medium text-success flex items-center bg-success/10 px-1.5 py-0.5 rounded">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> +12%
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-5xl text-warning">warning</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">活动病害总数</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold dark:text-white text-slate-900">{{ currentStats.defects }}</h3>
          <span class="text-xs font-medium text-warning flex items-center bg-warning/10 px-1.5 py-0.5 rounded">
            <span class="material-symbols-outlined text-[14px]">trending_up</span> 新增 {{ currentStats.newDefects }} 个
          </span>
        </div>
      </div>

      <div class="bg-white dark:bg-card-dark p-6 rounded-xl border-l-4 border-l-danger border-y border-r border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-5xl text-danger">gpp_maybe</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">高风险预警</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-danger">{{ currentStats.critical }}</h3>
          <span class="text-xs font-bold text-danger animate-pulse">需立即处理</span>
        </div>
      </div>

      <div class="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span class="material-symbols-outlined text-5xl text-primary">smart_toy</span>
        </div>
        <p class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">平均 AI 置信度</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold dark:text-white text-slate-900">98.2%</h3>
          <span class="text-xs font-medium text-success flex items-center bg-success/10 px-1.5 py-0.5 rounded">稳定运行</span>
        </div>
      </div>
    </div>

    <!-- Charts & Alerts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Trend Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col min-h-[400px]">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-bold dark:text-white text-slate-900">病害累计趋势</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">本年度与去年同期检测数据对比</p>
          </div>
          <button class="text-primary text-sm font-bold hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">查看分析详情</button>
        </div>
        <div class="flex-1 w-full relative flex items-end gap-3 px-4 pb-8 border-b border-l border-slate-200 dark:border-slate-700">
           <!-- Grid Background -->
           <div class="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 pb-8 pl-0 opacity-10">
             <div class="w-full h-px bg-slate-500"></div>
             <div class="w-full h-px bg-slate-500"></div>
             <div class="w-full h-px bg-slate-500"></div>
             <div class="w-full h-px bg-slate-500"></div>
           </div>
           
           <!-- Bars -->
           <div class="w-full h-full flex items-end justify-between gap-3 z-10">
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-[30%] group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-all relative"></div>
                <span class="text-xs text-slate-400">1月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-[45%] group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-all"></div>
                <span class="text-xs text-slate-400">2月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-primary/40 rounded-t-lg h-[40%] group-hover:bg-primary/50 transition-all relative"></div>
                <span class="text-xs text-slate-400">3月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-primary/60 rounded-t-lg h-[55%] group-hover:bg-primary/70 transition-all relative"></div>
                <span class="text-xs text-slate-400">4月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-primary rounded-t-lg h-[75%] group-hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(19,127,236,0.3)] relative">
                  <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold">5月峰值: 142</div>
                </div>
                <span class="text-xs text-slate-400 font-bold text-primary">5月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                 <div class="w-full bg-primary/80 rounded-t-lg h-[60%] group-hover:bg-primary/90 transition-all relative"></div>
                 <span class="text-xs text-slate-400">6月</span>
              </div>
              <div class="flex flex-col items-center gap-2 group w-full">
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg h-[25%] group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-all relative"></div>
                <span class="text-xs text-slate-400">7月</span>
              </div>
           </div>
        </div>
      </div>

      <!-- Severe Alerts -->
      <div class="lg:col-span-1 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
         <div class="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20 rounded-t-xl">
             <h3 class="text-lg font-bold dark:text-white text-slate-900 flex items-center gap-2">
                 <span class="material-symbols-outlined text-danger">report</span>
                 严重警报
             </h3>
             <span class="bg-danger/10 text-danger text-xs px-3 py-1 rounded-full font-bold">{{ alerts.length }}条待处理</span>
         </div>
         <div class="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-1 custom-scrollbar">
             <div 
               v-for="alert in alerts" 
               :key="alert.id"
               class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer group border-l-4 border-transparent hover:border-danger"
               @click="openDetail(alert)"
             >
                 <div class="flex justify-between items-start mb-2">
                     <span class="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded">高危</span>
                     <span class="text-xs text-slate-500">{{ alert.time }}</span>
                 </div>
                 <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ alert.title }}</h4>
                 <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{{ alert.desc }}</p>
             </div>
         </div>
         <div class="p-4 border-t border-slate-200 dark:border-slate-700 text-center">
             <a class="text-sm text-primary hover:underline font-bold" href="#">查看完整警报清单</a>
         </div>
      </div>
    </div>

    <!-- Pie Chart & Table -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
        <h3 class="text-lg font-bold dark:text-white text-slate-900 mb-8">病害类型分布</h3>
        <div class="flex items-center justify-around h-full py-4">
           <div class="relative w-40 h-40 rounded-full flex items-center justify-center" style="background: conic-gradient(#137fec 0% 45%, #ef4444 45% 60%, #f59e0b 60% 85%, #10b981 85% 100%);">
              <div class="absolute inset-0 m-auto w-28 h-28 bg-white dark:bg-card-dark rounded-full flex flex-col items-center justify-center shadow-inner">
                <span class="text-3xl font-black dark:text-white">342</span>
                <span class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">病害总数</span>
              </div>
           </div>
           <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-primary"></span><div><p class="text-[10px] text-slate-500 font-bold">裂缝</p><p class="text-sm font-bold dark:text-white">45%</p></div></div>
              <div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-danger"></span><div><p class="text-[10px] text-slate-500 font-bold">露筋</p><p class="text-sm font-bold dark:text-white">15%</p></div></div>
              <div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-warning"></span><div><p class="text-[10px] text-slate-500 font-bold">剥落</p><p class="text-sm font-bold dark:text-white">25%</p></div></div>
              <div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-success"></span><div><p class="text-[10px] text-slate-500 font-bold">坑洼</p><p class="text-sm font-bold dark:text-white">15%</p></div></div>
           </div>
        </div>
      </div>

      <div class="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
         <div class="p-6 pb-4 flex justify-between items-center">
             <h3 class="text-lg font-bold dark:text-white text-slate-900">近期巡检动态</h3>
             <div class="flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded">
               <span class="flex h-2 w-2 relative">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span class="text-[10px] text-green-500 font-black uppercase tracking-widest">实时更新中</span>
             </div>
         </div>
         <div class="flex-1 overflow-x-auto">
             <table class="w-full text-left text-sm text-slate-400">
               <thead class="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold dark:text-slate-400 text-slate-600 tracking-wider">
                 <tr>
                    <th class="px-6 py-4">病害快照</th>
                    <th class="px-6 py-4">位置 / 桩号</th>
                    <th class="px-6 py-4">检测类型</th>
                    <th class="px-6 py-4">AI 置信度</th>
                    <th class="px-6 py-4">流程状态</th>
                    <th class="px-6 py-4 text-right">操作</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                 <tr 
                   v-for="item in filteredInspections" 
                   :key="item.id"
                   class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                   @click="openDetail(item)"
                 >
                    <td class="px-6 py-4">
                      <div class="h-12 w-20 rounded-lg overflow-hidden border border-slate-700/50">
                        <img :src="item.image" class="object-cover w-full h-full" />
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-slate-900 dark:text-white font-bold">{{ item.location }}</span>
                        <span class="text-[10px] text-slate-500">{{ item.coordinates }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                       <span 
                         class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                         :class="getStatusColor(item.type)"
                       >
                         {{ item.type }}
                       </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <div class="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div class="bg-success h-full" :style="{width: item.confidence}"></div>
                        </div>
                        <span class="text-[10px] font-black text-slate-300">{{ item.confidence }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                       <span class="text-[10px] font-bold text-slate-400 border border-slate-700 px-2 py-0.5 rounded">{{ item.status }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                       <button class="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
                          <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                       </button>
                    </td>
                 </tr>
               </tbody>
             </table>
         </div>
      </div>
    </div>

    <InspectionDetailModal 
      v-model="showModal" 
      :data="selectedItem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InspectionDetailModal from '../components/InspectionDetailModal.vue'
import store from '../store'
import { MockApi } from '../services/mockApi'

// State
const activeRange = ref('24h')
const showModal = ref(false)
const selectedItem = ref<any>(null)

// Computed from Store
const currentStats = computed(() => MockApi.getDashboardStats()[activeRange.value])
// In a real app we might filter recent alerts, for now using high severity ones as "Recent" or just all high severity
const alerts = store.getHighSeverityAlerts

const inspections = store.getAllDefects

const filteredInspections = computed(() => {
    // Basic mock filtering logic based on range
    const all = inspections.value
    if (activeRange.value === '24h') return all.slice(0, 1)
    if (activeRange.value === '7d') return all.slice(0, 3)
    return all
})

// Action
const openDetail = (item: any) => {
  selectedItem.value = {
    ...item,
    timestamp: item.timestamp || '2023-11-20 14:00',
    image: item.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcdI6EhVlTkGyW_Z8UdLkLix2LgxCV-UcX9DGY-_lpuQaAvuCxGs8ASewpXqNvHTO_PUd6adPk3AmaWL1O0CH0wLPoF-UyYL7tZq1dEV5XjRbyNtHytMkFdp8uubckxKd2nKmUWFVWyGo5vG8KoXlgdQ7Jy9Xbg_2gQG2Lz5B7kR7hsvXTEe5Q_em0BcdH15sQkf7J2BaSarvRWSTOaPZifMXSJ-QVfTtVXbfYLPVCoxuVJxWFk2yC60NhkJ2qdyriB2dc-LcFUB27'
  }
  showModal.value = true
}

// Helpers
const getStatusColor = (type: string) => {
  if (type.includes('裂缝')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  if (type.includes('剥落')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  if (type.includes('坑洼') || type.includes('严重')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  return 'bg-slate-100 text-slate-800'
}
</script>
