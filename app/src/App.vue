<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
import Sidebar from './views/dashboard/Sidebar.vue'
import { provide, ref, computed } from 'vue';

const isSidebarExpanded = ref(localStorage.getItem("is_expanded") !== "false")

provide('sidebarExpanded', {
  isSidebarExpanded,
  toggleSidebar: () => {
    isSidebarExpanded.value = !isSidebarExpanded.value
    localStorage.setItem("is_expanded", isSidebarExpanded.value.toString())
  }
})

// Computed для адаптивного отступа контента
const contentMargin = computed(() => {
  return isSidebarExpanded.value ? 'ml-64' : 'ml-16'
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content Area -->
    <main 
      class="flex-1 min-h-screen transition-all duration-300 ease-in-out lg:ml-16"
      :class="[
        'ml-0',
        { 'lg:ml-64': isSidebarExpanded }
      ]"
    >
      <div class="p-4 sm:p-6 lg:p-8 w-full max-w-full">
        <RouterView />
      </div>
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