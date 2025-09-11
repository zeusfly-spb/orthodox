<script setup lang="ts">
import { type LucideIcon } from 'lucide-vue-next';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

defineProps<{
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}>();

import { useRoute, RouterLink } from 'vue-router';
const route = useRoute();
const isItemActive = (url: string) => {
  return route.path === url;
};
</script>

<template>
  <SidebarGroup v-for="item in items" :key="item.title">
    <SidebarGroupLabel
      class="text-md uppercase font-medium text-muted-foreground flex justify-center lg:mb-3"
    >
      {{ item.title }}
    </SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="childItem in item.items" :key="childItem.title">
          <SidebarMenuButton
            as-child
            :is-active="isItemActive(childItem.url)"
            :tooltip="childItem.title"
            class="text-base text-muted-foreground"
          >
            <RouterLink :to="childItem.url" class="px-4 py-6">
              <component :is="childItem.icon" />
              <span>{{ childItem.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
