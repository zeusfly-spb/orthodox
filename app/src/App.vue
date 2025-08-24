<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
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
