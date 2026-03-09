<template>
  <div class="max-w-[1200px] mx-auto p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">系统设置</h1>
      <p class="text-slate-500 dark:text-slate-400">管理应用数据与系统偏好</p>
    </div>

    <!-- System Settings Section -->
    <div class="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-[#2c3b4b] p-8 shadow-sm mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <span class="material-symbols-outlined text-[24px]">settings_system_daydream</span>
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">系统设置</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">配置默认文件路径等系统选项</p>
        </div>
      </div>

      <div class="grid gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">默认数据导出/导入路径</label>
          <div class="flex gap-2">
            <input 
              type="text" 
              v-model="defaultPath" 
              readonly
              placeholder="未设置 (将使用系统默认)"
              class="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111a22] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button 
              @click="selectDefaultPath"
              class="px-4 py-2 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[18px]">folder_open</span>
              浏览
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management Section -->
    <div class="bg-white dark:bg-[#1a2632] rounded-2xl border border-slate-200 dark:border-[#2c3b4b] p-8 shadow-sm">
      <div class="flex items-center gap-3 mb-6">
        <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[24px]">database</span>
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">数据管理</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">导入或导出系统数据 (Excel 格式)</p>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-start">
        <!-- Import -->
        <div class="flex-1 w-full p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-slate-50 dark:hover:bg-[#111a22] transition-all group relative">
          <input 
            type="file" 
            ref="fileInput" 
            accept=".xlsx, .xls" 
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            @change="handleImport"
          />
          <div class="flex flex-col items-center gap-3">
             <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[24px]">upload_file</span>
             </div>
             <div>
               <h3 class="font-bold text-slate-900 dark:text-white">导入数据</h3>
               <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">支持 .xlsx 格式文件</p>
             </div>
             <button class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg mt-2 group-hover:scale-105 transition-transform">
               选择文件
             </button>
          </div>
        </div>

        <!-- Export -->
        <div class="flex-1 w-full p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-success hover:bg-success/5 transition-all group cursor-pointer" @click="handleExport">
          <div class="flex flex-col items-center gap-3">
             <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-success/20 group-hover:text-success flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[24px]">download</span>
             </div>
             <div>
               <h3 class="font-bold text-slate-900 dark:text-white">导出数据</h3>
               <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">保存为 Excel 文件</p>
             </div>
             <button class="px-4 py-2 bg-success text-white text-xs font-bold rounded-lg mt-2 group-hover:scale-105 transition-transform shadow-lg shadow-success/20">
               立即导出
             </button>
          </div>
        </div>

        <!-- Reset -->
        <div class="flex-1 w-full p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-danger hover:bg-danger/5 transition-all group cursor-pointer" @click="handleReset">
          <div class="flex flex-col items-center gap-3">
             <div class="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-danger/20 group-hover:text-danger flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[24px]">restart_alt</span>
             </div>
             <div>
               <h3 class="font-bold text-slate-900 dark:text-white">重置数据</h3>
               <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">恢复至默认演示数据</p>
             </div>
             <button class="px-4 py-2 bg-danger text-white text-xs font-bold rounded-lg mt-2 group-hover:scale-105 transition-transform shadow-lg shadow-danger/20">
               重置
             </button>
          </div>
        </div>
      </div>
      
      <div v-if="notification.show" :class="['mt-6 p-4 rounded-lg text-sm font-bold flex flex-col gap-2', notification.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger']">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">{{ notification.type === 'success' ? 'check_circle' : 'error' }}</span>
            <span>{{ notification.message }}</span>
          </div>
          
          <!-- Actions for success (Export) -->
          <div v-if="notification.type === 'success' && notification.filePath" class="pl-7 flex flex-col gap-1">
            <div class="text-xs opacity-80 font-mono break-all">{{ notification.filePath }}</div>
            <div class="flex gap-3 mt-2">
              <button @click="openFile(notification.filePath!)" class="text-xs underline hover:text-success-dark font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">description</span> 打开文件
              </button>
              <button @click="openFolder(notification.filePath!)" class="text-xs underline hover:text-success-dark font-medium flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">folder</span> 打开所在文件夹
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import store from '../store'
import { save, open as openDialog } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'
import { openPath, revealItemInDir } from '@tauri-apps/plugin-opener'

const fileInput = ref<HTMLInputElement | null>(null)
const defaultPath = ref('')

const notification = reactive<{
  show: boolean
  message: string
  type: 'success' | 'error'
  filePath?: string
}>({
  show: false,
  message: '',
  type: 'success'
})

// Load settings on mount
onMounted(() => {
  const savedPath = localStorage.getItem('rdd_settings_default_path')
  if (savedPath) {
    defaultPath.value = savedPath
  }
})

const showMessage = (msg: string, type: 'success' | 'error' = 'success', filePath?: string) => {
  notification.message = msg
  notification.type = type
  notification.filePath = filePath
  notification.show = true
  
  // Only auto-hide if it's NOT a success message with actions
  if (type === 'error' || !filePath) {
    setTimeout(() => {
      notification.show = false
    }, 5000)
  }
}

const selectDefaultPath = async () => {
    try {
        const selected = await openDialog({
            directory: true,
            multiple: false,
            defaultPath: defaultPath.value || undefined
        })
        
        if (selected) {
            defaultPath.value = selected as string
            localStorage.setItem('rdd_settings_default_path', selected as string)
            showMessage(`默认路径更新为: ${selected}`, 'success')
        }
    } catch (e) {
        console.error('Failed to select directory', e)
        showMessage('无法选择目录: ' + (e as Error).message, 'error')
    }
}

const openFile = async (path: string) => {
  try {
    await openPath(path)
  } catch (e) {
    console.error('Failed to open file', e)
    showMessage('无法打开文件: ' + (e as Error).message, 'error')
  }
}

const openFolder = async (filePath: string) => {
  try {
     // Use revealItemInDir to show the file in the file explorer
     await revealItemInDir(filePath)
  } catch (e) {
    console.error('Failed to open folder', e)
    showMessage('无法打开文件夹: ' + (e as Error).message, 'error')
  }
}

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      const newStoreData: any = {}

      // Parse Defects
      if (workbook.Sheets['defects']) {
        newStoreData.defects = XLSX.utils.sheet_to_json(workbook.Sheets['defects'])
      }

      // Parse Routes
      if (workbook.Sheets['routes']) {
        newStoreData.routes = XLSX.utils.sheet_to_json(workbook.Sheets['routes'])
      }

      // Parse Alerts
      if (workbook.Sheets['alerts']) {
        newStoreData.alerts = XLSX.utils.sheet_to_json(workbook.Sheets['alerts'])
      }
      
      // Parse Stats (Special handling due to nested structure in store vs flat in excel)
      // Expecting a sheet 'stats' with columns: range, distance, defects, newDefects, critical
      if (workbook.Sheets['stats']) {
          const statsRows = XLSX.utils.sheet_to_json(workbook.Sheets['stats']) as any[]
          const statsMap: any = {}
          statsRows.forEach(row => {
              if (row.range) {
                  statsMap[row.range] = {
                      distance: row.distance,
                      defects: row.defects,
                      newDefects: row.newDefects,
                      critical: row.critical
                  }
              }
          })
          if (Object.keys(statsMap).length > 0) {
              newStoreData.stats = statsMap
          }
      }

      store.loadData(newStoreData)
      showMessage(`成功导入数据! 包含 ${newStoreData.defects?.length || 0} 条病害记录。`)
      
      // Reset input
      if (fileInput.value) fileInput.value.value = ''

    } catch (error) {
      console.error(error)
      showMessage('无法解析 Excel 文件，请确保格式正确。', 'error')
    }
  }
  reader.readAsArrayBuffer(file)
}

const handleExport = async () => {
  try {
    const wb = XLSX.utils.book_new()

    // Helper to sanitize reactive data
    const sanitize = (data: any) => {
      try {
        return JSON.parse(JSON.stringify(data || []))
      } catch (e) {
        return []
      }
    }

    // Safely get data from store
    const defects = store.getAllDefects?.value || []
    const routes = store.getAllRoutes?.value || []
    const alerts = store.state?.alerts || []

    // Export Defects
    const defectsSheet = XLSX.utils.json_to_sheet(sanitize(defects))
    XLSX.utils.book_append_sheet(wb, defectsSheet, 'defects')

    // Export Routes
    const routesSheet = XLSX.utils.json_to_sheet(sanitize(routes))
    XLSX.utils.book_append_sheet(wb, routesSheet, 'routes')

    // Export Alerts
    const alertsSheet = XLSX.utils.json_to_sheet(sanitize(alerts))
    XLSX.utils.book_append_sheet(wb, alertsSheet, 'alerts')

    // Export Stats (only if they exist in state, otherwise skip)
    if (store.state?.stats && typeof store.state.stats === 'object') {
      const statsData = []
      try {
        for (const [range, stat] of Object.entries(store.state.stats)) {
            statsData.push({ range, ...(stat as any) })
        }
        if (statsData.length > 0) {
          const statsSheet = XLSX.utils.json_to_sheet(sanitize(statsData))
          XLSX.utils.book_append_sheet(wb, statsSheet, 'stats')
        }
      } catch (e) {
        console.warn('Error processing stats:', e)
      }
    }

    // Generate Excel file as binary array
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    
    // Check if we're running in Tauri environment
    // Use unsafe cast to avoid TS error if window.__TAURI__ is not defined in types
    const isTauri = (window as any).__TAURI__ !== undefined
    
    // Function to trigger browser download
    const browserDownload = (data: Uint8Array, filename: string) => {
      try {
        const blob = new Blob([data as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        showMessage('导出成功!')
      } catch (e) {
         throw new Error('浏览器导出失败: ' + (e as Error).message)
      }
    }

    if (isTauri) {
      try {
        // Attempt Tauri native export
        const filePath = await save({
          defaultPath: defaultPath.value ? `${defaultPath.value}/RDD_Data_Export.xlsx` : 'RDD_Data_Export.xlsx',
          filters: [{
            name: 'Excel Files',
            extensions: ['xlsx']
          }]
        })

        if (filePath) {
          await writeFile(filePath, new Uint8Array(wbout))
          showMessage('导出成功!', 'success', filePath)
        } else {
          // User cancelled, but it's not an error
           // Don't show error message for cancellation
        }
      } catch (tauriError) {
        console.warn('Tauri export failed, falling back to browser download:', tauriError)
        // Fallback to browser download if Tauri fails (e.g. plugins not loaded)
        browserDownload(wbout, 'RDD_Data_Export.xlsx')
      }
    } else {
      // Browser environment
      browserDownload(wbout, 'RDD_Data_Export.xlsx')
    }

  } catch (error) {
    console.error('Export critical error:', error)
    showMessage('导出失败: ' + (error as Error).message, 'error')
  }
}

const handleReset = () => {
    store.resetData()
    showMessage('数据已重置为默认演示状态')
}
</script>
