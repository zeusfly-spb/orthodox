<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import IconUser from '@/components/icons/IconUser.vue'
import { useAuthStore } from '@/stores/auth'

// const props = defineProps<{
//   user: {
//     name: string
//     email: string
//     avatar: string
//   }
// }>()

const { isMobile } = useSidebar()

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-stone-50/50 hover:text-color-sidebar-primary hover:bg-stone-50/50 active:bg-stone-50/50 active:text-color-sidebar-primary"
          >
            <template v-if="authStore.isLoading">
              <Skeleton class="h-8 w-8 round-lg" />
              <Skeleton class="h-4 w-24" />
            </template>
            <template v-else>
              <Avatar class="h-8 w-8 round-lg">
                <AvatarImage
                  v-if="authStore.user?.avatar"
                  :src="authStore.user.avatar"
                  :alt="authStore.user?.name"
                />
                <AvatarFallback class="round-lg">
                  <IconUser />
                </AvatarFallback>
              </Avatar>
            </template>
            <div class="grid flex-1 text-left text-sm leading-tight" :class="{ hidden: isMobile }">
              <span class="truncate font-semibold">{{ authStore.user?.name }}</span>
              <span class="truncate text-xs">{{ authStore.user?.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'bottom'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <template v-if="authStore.isLoading">
                <Skeleton class="h-8 w-8 round-lg" />
                <Skeleton class="h-4 w-24" />
              </template>
              <template v-else>
                <Avatar class="h-8 w-8 round-lg">
                  <AvatarImage
                    v-if="authStore.user?.avatar"
                    :src="authStore.user.avatar"
                    :alt="authStore.user?.name"
                  />
                  <AvatarFallback class="round-lg">
                    <IconUser />
                  </AvatarFallback>
                </Avatar>
              </template>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ authStore.user?.name }}</span>
                <span class="truncate text-xs">{{ authStore.user?.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut />
            Выход
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
