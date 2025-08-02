<script setup lang="ts">
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  type SidebarProps,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  Earth,
  House,
  Users,
  Database,
  BadgeCheck,
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import logoFull from '@/assets/images/logo-full.png'
import logoIcon from '@/assets/images/logo-icon.png'
import NavMain from '@/components/dashboard/nav/NavMain.vue'
import NavSecondary from '@/components/dashboard/nav/NavSecondary.vue'
import NavCollapsible from '@/components/dashboard/nav/NavCollapsible.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
  class: 'bg-white',
})

const { state, isMobile } = useSidebar()

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Разделы',
      url: '#',
      items: [
        {
          title: 'Мои туры',
          url: '/dashboard/tours',
          icon: Earth,
        },
        {
          title: 'Мои заявки',
          url: '/dashboard/bookings',
          icon: Database,
        },
        {
          title: 'Мои паломники',
          url: '/dashboard/customers',
          icon: Users,
        },
        {
          title: 'Мои контрагенты',
          url: '/dashboard/partners',
          icon: BadgeCheck,
        },
        {
          title: 'Профиль ПС',
          url: '/dashboard/operator',
          icon: House,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Справочники',
      url: '#',
      items: [
        {
          title: 'Объекты',
          url: '/dashboard/entities',
        },
      ],
    },
  ],
  navCollapsible: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem size="lg" as-child>
          <div class="flex justify-center mt-1 mb-3 transition-transform duration-400">
            <RouterLink to="/dashboard">
              <img
                :src="state === 'collapsed' ? logoIcon : logoFull"
                class="aspect-auto object-contain md:object-cover transition-transform duration-400"
                :class="{
                  'w-10': state === 'collapsed',
                  'w-full': state === 'expanded',
                  hidden: isMobile && !openMobile,
                }"
                alt="АНО Паломнический центр"
              />
            </RouterLink>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavSecondary :items="data.navSecondary" />
      <!--      <NavCollapsible :items="data.navCollapsible" />-->
    </SidebarContent>
    <SidebarFooter></SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
