<template>
  <header class="flex items-center justify-between border-b border-gray-200 dark:border-[#233648] bg-white dark:bg-[#111a22] px-6 py-2.5 shrink-0 z-30 h-16">
    <!-- Logo Section -->
    <div class="flex items-center gap-3 min-w-[200px]">
      <div class="size-8 text-primary">
        <svg class="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd" d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" fill="currentColor" fill-rule="evenodd"></path>
        </svg>
      </div>
      <h1 class="text-slate-900 dark:text-white text-base font-bold tracking-tight hidden lg:block">道路桥梁病害管理系统</h1>
    </div>

    <!-- Navigation (Capsule Style) -->
    <nav class="hidden md:flex items-center bg-slate-100 dark:bg-[#1c2a38] p-1 rounded-xl">
       <router-link 
        to="/" 
        class="px-5 py-1.5 text-sm font-medium rounded-lg transition-all"
        active-class="bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
        :class="[$route.path === '/' ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']"
      >
        仪表盘
      </router-link>
      <router-link 
        to="/map-view" 
        class="px-5 py-1.5 text-sm font-medium rounded-lg transition-all"
        active-class="bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
        :class="[$route.path === '/map-view' ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']"
      >
        巡检地图
      </router-link>
      <router-link 
        to="/report-management" 
        class="px-5 py-1.5 text-sm font-medium rounded-lg transition-all"
        active-class="bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
        :class="[$route.path === '/report-management' ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']"
      >
        报告管理
      </router-link>
      <router-link 
        to="/settings" 
        class="px-5 py-1.5 text-sm font-medium rounded-lg transition-all"
        active-class="bg-white dark:bg-primary text-primary dark:text-white shadow-sm"
        :class="[$route.path === '/settings' ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200']"
      >
        设置
      </router-link>
    </nav>

    <!-- Right Actions -->
    <div class="flex items-center gap-3 min-w-[200px] justify-end">
      <button class="flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#233648] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#344c63] transition-colors">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
      </button>
      <div class="h-8 w-px bg-gray-200 dark:bg-[#233648]"></div>
      <div class="flex items-center gap-2">
        <div class="bg-center bg-no-repeat bg-cover rounded-full size-8 ring-1 ring-gray-200 dark:ring-[#233648]" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwzNnACUf3HM8y73YEEpu4XZkJvyXdYntNTYZtkWnfkAqY55G6BPxtIdG-_4wlOgWd4CjvqMEsKpYQ5dRDYeULs99j9Via_TJeT5RowL_fBzHW9POYAwF3KQfdizktxAEVmCrRd1ZiIAeY7q6ECVJvnLnwy42DBptGtGLXD5bnDImjwAVL2u4G_Zhw0WppR56gkiNy1Ich4YArbAmUBvAuYLuDd6JnPBXhiSN4bSDLsd9d-2EpttdzMLSBqvxpBsKbi29PnIKNzur8");'></div>
        <span class="text-xs font-semibold hidden lg:block text-slate-700 dark:text-white">管理员</span>
      </div>
      
      <!-- Mobile Menu Button -->
      <button class="md:hidden ml-2 text-slate-600 dark:text-slate-300" @click="$emit('toggle-menu')">
         <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const $route = useRoute()
</script>
