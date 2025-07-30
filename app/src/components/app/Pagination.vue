<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

const PageParamName = 'page'

interface PaginationProps {
  currentPage: number
  perPage: number
  total: number
  lastPage?: number
}

const props = defineProps<PaginationProps>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const route = useRoute()
const router = useRouter()

const lastPage = computed(() => props.lastPage || Math.ceil(props.total / props.perPage))

const shouldShowPage = (page) => {
  return Math.abs(page - props.currentPage) < 3 || page === 1 || page === lastPage.value
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > lastPage.value) return

  router.push({
    query: {
      ...route.query,
      [PageParamName]: page > 1 ? page : undefined,
    },
  })

  if (page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <Pagination v-slot="{ page }" :items-per-page="10" :total="30" :default-page="2">
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious as-child>
        <Button
          variant="ghost"
          size="icon"
          :disabled="props.currentPage === 1"
          class="h-10 w-20"
          @click="handlePageChange(props.currentPage - 1)"
        >
          <ChevronLeftIcon />
          <span class="hidden sm:block">Назад</span>
        </Button>
      </PaginationPrevious>

      <!-- Numbers -->
      <template v-for="page in lastPage" :key="page">
        <PaginationItem v-if="shouldShowPage" :value="page" :is-active="props.currentPage === page">
          <button
            :class="{
              'font-bold text-primary': page === props.currentPage,
              'hover:bg-accent hover:text-accent-foreground': page !== props.currentPage,
            }"
            class="flex h-10 items-center justify-center px-4 py-2"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </PaginationItem>

        <!-- Dots -->
        <PaginationItem
          v-if="
            (page === 2 && props.currentPage - 3 > 1) ||
            (page === lastPage - 1 && props.currentPage + 3 < lastPage)
          "
        >
          <span class="h-10 px-4 py-2">...</span>
        </PaginationItem>
      </template>

      <PaginationNext as-child>
        <Button
          variant="ghost"
          size="icon"
          :disabled="props.currentPage === lastPage"
          class="h-10 w-20"
          :class="{ 'pointer-events-none opacity-50': props.currentPage === lastPage }"
          @click="handlePageChange(props.currentPage + 1)"
        >
          <span class="hidden sm:block">Вперед</span>
          <ChevronRightIcon />
        </Button>
      </PaginationNext>
    </PaginationContent>
  </Pagination>
</template>
