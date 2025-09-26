<script setup>
import { catalog, paragraph } from '@/composables/sidebar.js'
import { onMounted, ref, inject, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const selectedItem = ref(0)
const { isSidebarExpanded, toggleSidebar } = inject('sidebarExpanded')

// Упрощаем логику логотипа через computed
const logo = computed(() => {
  return isSidebarExpanded.value ? "/logo.png" : "/logo-icon.png"
})

function matchRouteName() {
  selectedItem.value =
    paragraph.find((item) => item.linkName === route.name)?.id || selectedItem.value
}

const handleToggle = () => {
  toggleSidebar()
  // Убираем изменение logo.value здесь - это делается автоматически в computed
}

onMounted(() => matchRouteName())
</script>

<template>
  <aside 
    class="fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-30 overflow-y-auto"
    :class="[
      isSidebarExpanded ? 'w-64' : 'w-16',
      'lg:translate-x-0',
      isSidebarExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="flex justify-center items-center py-6">
      <router-link to="/" class="block">
        <img 
          :src="logo" 
          alt="Logo"
          class="h-12 w-auto transition-all duration-300"
        />
      </router-link>
    </div>

    <!-- Остальной код без изменений -->
    <div class="px-4 pb-4">
      <!-- Toggle Button -->
      <button 
        @click="handleToggle"
        class="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-3 mb-5 flex items-center justify-center gap-2 transition-all duration-200"
        :class="{ 'rounded-full w-11 h-11 mx-auto': !isSidebarExpanded }"
      >
        <div class="flex flex-col gap-0.5">
          <span class="w-4 h-0.5 bg-white rounded"></span>
          <span class="w-4 h-0.5 bg-white rounded"></span>
          <span class="w-4 h-0.5 bg-white rounded"></span>
        </div>
        <span 
          v-if="isSidebarExpanded" 
          class="text-xs font-medium uppercase tracking-wider"
        >
          Свернуть
        </span>
      </button>

      <!-- Main Menu -->
      <div v-if="isSidebarExpanded" class="mb-6">
        <h3 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Раздел
        </h3>
      </div>

      <nav class="space-y-1">
        <router-link
          v-for="item in paragraph"
          :key="item.id"
          :to="{ name: item.linkName }"
          :class="[
            'flex items-center rounded-xl transition-all duration-200 group',
            isSidebarExpanded ? 'px-4 py-3 gap-3' : 'p-3 justify-center',
            selectedItem === item.id 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
          ]"
          @click="selectedItem = item.id"
        >
          <img 
            :src="item.image" 
            alt="" 
            class="w-5 h-5 transition-all duration-200"
            :class="{ 'group-hover:opacity-80': true }"
          />
          <span 
            v-if="isSidebarExpanded" 
            class="font-medium text-sm whitespace-nowrap"
          >
            {{ item.name }}
          </span>
        </router-link>
      </nav>

      <!-- Submenu -->
      <div v-if="isSidebarExpanded" class="mt-8">
        <h3 class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Справочники
        </h3>
        <router-link 
          :to="{ name: 'entities-view' }" 
          class="block px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          Объекты
        </router-link>
      </div>
    </div>
  </aside>
</template>