<!-- <script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import Sidebar from './components/Sidebar.vue'
import { provide, ref } from 'vue';

const isSidebarExpanded = ref(localStorage.getItem("is_expanded") !== "true")

provide('sidebarExpanded', {
  isSidebarExpanded,
  toggleSidebar: () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
    localStorage.setItem("is_expanded", (!isSidebarExpanded.value).toString())
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen app">
    <main class="flex flex-col min-h-screen">
      <RouterView />
    </main>
    <Toaster position="top-right" richColors />
  </div>
</template>

<style>
.app {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.touchable {
  cursor: pointer;
}
</style>

<style lang="scss">
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: all 0.3s;
  min-width: 0;
}
.content {
  padding: 30px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style> -->


<script setup>
import { ref, provide } from 'vue'
import Sidebar from '@/views/dashboard/Sidebar.vue'
import Topbar from '@/views/dashboard/Topbar.vue'
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';

const isSidebarExpanded = ref(localStorage.getItem("is_expanded") !== "true")

provide('sidebarExpanded', {
  isSidebarExpanded,
  toggleSidebar: () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
    localStorage.setItem("is_expanded", (!isSidebarExpanded.value).toString())
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    
    <!-- Main Content Area -->
    <div 
      class="transition-all duration-300 ease-in-out"
      :class="[
        'min-h-screen',
        isSidebarExpanded 
          ? 'ml-0 lg:ml-64' 
          : 'ml-0 lg:ml-16'
      ]"
    >
      <!-- Topbar -->
      
      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <RouterView />
      </main>
    </div>
    <Toaster  position="top-right" richColor/>
    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarExpanded"
    @click="isSidebarExpanded = false"
    ></div>
  </div>
</template>

