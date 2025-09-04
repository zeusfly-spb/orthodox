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
</style>
