<template>
  <div class="flex shrink-0 items-center justify-between gap-2">
    <div class="flex items-center gap-4 pl-4">
      <h1 class="text-lg font-bold text-muted-foreground">
        Паломнические туры
      </h1>
    </div>
    <div class="flex items-center gap-4 pr-4">
      <Button
        variant="outline"
        class="bg-white text-emerald-500 border-emerald-500 shadow hover:bg-emerald-500/90 hover:text-white px-8 py-6 touchable"
        @click="emit('downloadReport')"
      >
        <ArrowDownToLine/>
        Скачать отчет
      </Button>
      <Button
        class="bg-emerald-500 text-white shadow hover:bg-white hover:text-emerald-500 px-8 py-6 touchable"
        @click="emit('addTour')"
      >
        Создать новый тур
      </Button>
    </div>
  </div>
  <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center mb-6">
              <span
                class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white mr-4">
              <svg width="16" height="16" fill="none"><circle cx="8" cy="8" r="8"
                                                              fill="gray"/></svg>
              </span>
    <div>
      <div class="font-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
      <div class="text-gray-500 text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </div>
    </div>
    <button class="ml-auto text-gray-400 hover:text-gray-600">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import {ArrowDownToLine} from "lucide-vue-next";
import {Button} from "@/components/ui/button";

const emit = defineEmits<{
  (e: 'addTour'): void
  (e: 'downloadReport'): void
}>();
</script>
