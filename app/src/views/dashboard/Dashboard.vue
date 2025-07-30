<script setup lang="ts">
import { RouterView } from 'vue-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from '@/components/dashboard/nav/DashboardSidebar.vue'
import DashboardHeader from '@/components/dashboard/nav/DashboardHeader.vue'
</script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <DashboardHeader />
      <!-- Контент -->
      <article class="flex flex-1 flex-col gap-4 md:p-4 lg:p-8">
        <RouterView />
      </article>
    </SidebarInset>
  </SidebarProvider>
</template>
