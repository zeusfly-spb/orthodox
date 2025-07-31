<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import SidebarToggler from '@/components/dashboard/nav/SidebarToggler.vue'
import NavUser from '@/components/dashboard/nav/NavUser.vue'
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm sticky top-0 z-50 bg-white"
  >
    <!-- Левая часть -->
    <div class="flex items-center gap-4 pl-4">
      <SidebarToggler />
      <Separator orientation="vertical" class="mr-4 h-4" />
    </div>
    <!-- Правая часть -->
    <div class="flex items-center gap-4 pr-4">
      <NavUser />
    </div>
  </header>
</template>
