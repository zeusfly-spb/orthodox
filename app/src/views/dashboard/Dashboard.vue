<script setup lang="ts">
import { RouterView } from 'vue-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/nav/DashboardSidebar.vue';
import DashboardHeader from '@/components/dashboard/nav/DashboardHeader.vue';
</script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <DashboardHeader />
      <!-- Контент -->
      <article
        class="flex flex-1 flex-col gap-4 px-2 py-4 md:px-4 md:py-4 lg:px-8 lg:py-8 bg-gray-50"
      >
        <RouterView />
      </article>
    </SidebarInset>
  </SidebarProvider>
</template>
