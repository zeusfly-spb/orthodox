
<!-- <div class="relative">
          <button class="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L3.93 8.96M2 12h4M5.84 16.95l3.12-3.12M12 22v-4M16.95 18.16l3.12 3.12M22 12h-4M18.16 7.05l-3.12 3.12"></path>
            </svg>
          </button>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </div> -->



        <script setup>
import { ref, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isOpened = ref(false)
const { isSidebarExpanded, toggleSidebar } = inject('sidebarExpanded')

const dropdownList = ref([
  {
    link: '/settings',
    name: 'Настройки',
  },
  {
    link: '/messages',
    name: 'Сообщения',
  },
])

function handleLogout() {
  authStore.logout()
  localStorage.removeItem('tour_operator_id')
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
    <div class="flex items-center justify-between px-4 lg:px-6 py-4">
      <!-- Mobile Menu Button -->
      <button
        @click="toggleSidebar"
        class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Spacer for desktop -->
      <div class="hidden lg:block"></div>

      <!-- User Panel -->
      <div class="flex items-center gap-4">
        <!-- Notifications -->
       <div class="relative">
          <button class="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7.05 5.84L3.93 8.96M2 12h4M5.84 16.95l3.12-3.12M12 22v-4M16.95 18.16l3.12 3.12M22 12h-4M18.16 7.05l-3.12 3.12"></path>
            </svg>
          </button>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </div>

        <!-- User Dropdown -->
        <div class="relative">
          <button
            @click="isOpened = !isOpened"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <img 
              class="w-8 h-8 rounded-full object-cover" 
              :src="authStore.user?.avatar || '/svg/unknown-user.svg'" 
              :alt="authStore.user?.data.full_name || 'User'"
            />
            <span class="hidden sm:block text-sm font-medium text-gray-700">
              {{ authStore.user?.data.full_name || 'Unknown' }}
            </span>
            <svg 
              class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': isOpened }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isOpened"
            class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <router-link
              v-for="item in dropdownList"
              :key="item.name"
              :to="item.link"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              {{ item.name }}
            </router-link>
            <hr class="my-2 border-gray-200">
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              Выход
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
