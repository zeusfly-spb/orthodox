<script setup>
import { catalog, paragraph } from '@/composables/sidebar.js'
import { onMounted, ref, inject, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedItem = ref(0)
const { isSidebarExpanded, toggleSidebar } = inject('sidebarExpanded')

const logo = computed(() => {
  return isSidebarExpanded.value ? "/logo.png" : "/logo-icon.png"
})

const handleToggle = () => {
  toggleSidebar()
}

const matchRouteName = () => {
  selectedItem.value =
    paragraph.find((item) => item.linkName === route.name)?.id || selectedItem.value
}

onMounted(() => matchRouteName())
</script>

<template>
  <!-- Mobile Overlay -->
  <div 
    v-if="isSidebarExpanded"
    @click="toggleSidebar"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
  ></div>

  <!-- Sidebar -->
  <aside 
    class="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50 overflow-y-auto"
    :class="[
      isSidebarExpanded ? 'w-64' : 'w-16',
      'lg:translate-x-0',
      isSidebarExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="flex justify-center items-center py-6 px-4">
      <router-link to="/" class="block">
        <img 
          :src="logo" 
          alt="Logo"
          class="h-12 w-auto transition-all duration-300"
          :class="{ 'h-10': !isSidebarExpanded }"
        />
      </router-link>
    </div>

    <div class="px-4 pb-4">
      <!-- Toggle Button -->
      <button 
        @click="handleToggle"
        class="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-3 mb-5 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
        :class="{ 'rounded-full w-11 h-11 mx-auto p-0': !isSidebarExpanded }"
      >
        <div class="flex flex-col gap-0.5">
          <span class="w-4 h-0.5 bg-white rounded transition-transform duration-200" :class="{ 'rotate-45 translate-y-1': isSidebarExpanded }"></span>
          <span class="w-4 h-0.5 bg-white rounded transition-opacity duration-200" :class="{ 'opacity-0': isSidebarExpanded }"></span>
          <span class="w-4 h-0.5 bg-white rounded transition-transform duration-200" :class="{ '-rotate-45 -translate-y-1': isSidebarExpanded }"></span>
        </div>
        <span 
          v-if="isSidebarExpanded" 
          class="text-xs font-medium uppercase tracking-wider"
        >
          Свернуть
        </span>
      </button>

      <!-- Main Menu -->
      <div v-if="isSidebarExpanded" class="mb-4">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
          Раздел
        </h3>
      </div>

      <nav class="space-y-1">
        <router-link
          v-for="item in paragraph"
          :key="item.id"
          :to="{ name: item.linkName }"
          :class="[
            'flex items-center rounded-xl transition-all duration-200 group relative',
            isSidebarExpanded ? 'px-4 py-3 gap-3' : 'p-3 justify-center',
            selectedItem === item.id 
              ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
          ]"
          @click="selectedItem = item.id"
        >
          <img 
            :src="item.image" 
            alt="" 
            class="w-5 h-5 transition-all duration-200 flex-shrink-0"
            :class="{ 'group-hover:scale-110': true }"
          />
          <span 
            v-if="isSidebarExpanded" 
            class="font-medium text-sm whitespace-nowrap"
          >
            {{ item.name }}
          </span>
          
          <!-- Tooltip for collapsed state -->
          <div 
            v-if="!isSidebarExpanded"
            class="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none"
          >
            {{ item.name }}
            <div class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </router-link>
      </nav>

      <!-- Submenu -->
      <div v-if="isSidebarExpanded" class="mt-8">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Справочники
        </h3>
        <router-link 
          :to="{ name: 'entities-view' }" 
          class="block px-4 py-2.5 text-sm text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
        >
          Объекты
        </router-link>
      </div>
    </div>
  </aside>
</template>