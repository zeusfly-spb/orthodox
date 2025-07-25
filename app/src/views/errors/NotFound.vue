<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const homeLink = computed(() => (authStore.isAuthenticated ? 'dashboard' : 'home'))
</script>

<template>
  <div class="flex grow items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="font-medium">404 - Страница не найдена</h1>
      <p class="text-sm font-medium text-gray-500 my-2">Такой страницы не существует.</p>
      <RouterLink
        :to="{ name: homeLink }"
        class="p-1 text-sm font-medium text-gray-500 hover:text-gray-500/80"
        >Назад</RouterLink
      >
    </div>
  </div>
</template>
