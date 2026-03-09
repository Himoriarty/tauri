<template>
  <div class="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
    <Header @toggle-menu="isDrawerOpen = true" />

    <!-- Mobile Navigation Drawer -->
    <el-drawer
      v-model="isDrawerOpen"
      direction="ltr"
      size="75%"
      :with-header="false"
      class="!p-0 !bg-[#111a22]"
    >
      <div class="flex flex-col h-full bg-[#111a22] p-4 gap-4">
         <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center">
               <div class="w-4 h-4 bg-primary rotate-45 rounded-[2px]"></div>
            </div>
            <span class="text-white font-bold text-lg">InfraGuard AI</span>
         </div>
         <router-link to="/" @click="isDrawerOpen = false" class="text-slate-400 hover:text-white p-2">仪表盘</router-link>
         <router-link to="/map-view" @click="isDrawerOpen = false" class="text-slate-400 hover:text-white p-2">巡检地图</router-link>
         <router-link to="/report-management" @click="isDrawerOpen = false" class="text-slate-400 hover:text-white p-2">报告管理</router-link>
         <router-link to="/settings" @click="isDrawerOpen = false" class="text-slate-400 hover:text-white p-2">设置</router-link>
      </div>
    </el-drawer>

    <!-- Main Content -->
    <main class="flex-1 w-full relative">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import { ref } from 'vue'

const isDrawerOpen = ref(false)
</script>

<style>
/* Override Element Plus Drawer Styles if needed */
.el-drawer__body {
  padding: 0 !important;
  background-color: #111a22;
}
</style>