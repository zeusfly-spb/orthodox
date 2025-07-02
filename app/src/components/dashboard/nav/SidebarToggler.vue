<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button variant="ghost" size="icon" class="p-2" @click="toggleSidebar">
    <Menu class="text-muted-foreground" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
