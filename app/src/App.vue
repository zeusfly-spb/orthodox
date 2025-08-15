<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex flex-col min-h-screen">
      <RouterView />
    </main>
    <Toaster position="top-right" richColors />
  </div>
</template>

<style>
.touchable {
  cursor: pointer;
}
</style>
