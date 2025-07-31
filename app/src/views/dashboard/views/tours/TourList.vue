<script setup lang="ts">
import { ref, watch } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/app/ConfirmDialog.vue'

import DataTable from '@/components/dashboard/tours/DataTable.vue'
import TourForm from '@/components/dashboard/tours/TourForm.vue'

import { tourApi } from '@/api/tours'
import { useCrudActions } from '@/composables/useCrudActions'

import Pagination from '@/components/app/Pagination.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

import { usePaginationFilters } from '@/composables/usePaginationFilters'
import CustomerForm from '@/components/dashboard/customers/CustomerForm.vue'

// Инициализация с дефолтными фильтрами
const { filters, complexFilters, applyFilters, resetFilters, handlePageChange, currentPage } =
  usePaginationFilters({
    search: '',
    status: '',
  })

const {
  isLoading,
  showConfirm,
  handledItemId,
  items,
  currentItem,
  pagination,
  loadCollection,
  handleSubmit,
  handleDelete,
  onDeleteConfirm,
  onCancel,
} = useCrudActions(tourApi, {
  successMessage: 'Данные сохранены',
  deleteMessage: 'Данные удалены',
})

// Загрузка данных при изменении фильтров
watch(
  complexFilters,
  (newFilters) => {
    loadCollection(newFilters)
  },
  { immediate: true },
)

import { useRouter } from 'vue-router'

const router = useRouter()

const handleAddTour = () => {
  router.push({ name: 'tour-create' })
}

const handleEditTour = (id: string | number) => {
  router
    .push({
      name: 'tour-edit',
      params: { id: String(id) },
    })
    .catch((err) => {
      console.error('Navigation error:', err)
    })
}

// const getCurrentPage = () => {
//   return route.query?.page || 1
// }
//
// // Load API data
// loadCollection({ page: getCurrentPage() })
//
// // Filters
// const filters = ref({
//   search: '',
//   status: '',
// })
//
// const handlePageChange = (page: number) => {
//   loadCollection({
//     page,
//     ...filters.value,
//   })
// }
//
// const applyFilters = () => {
//   // Сбрасываем на первую страницу при применении фильтров
//   loadCollection({
//     page: 1,
//     ...filters.value,
//   })
// }
</script>

<template>
  <div>
    <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
      <div class="flex shrink-0 items-center justify-between gap-2">
        <!-- Левая часть -->
        <div class="flex items-center gap-4 pl-4">
          <h1 class="text-lg font-bold text-muted-foreground">Мои туры</h1>
        </div>
        <!-- Правая часть -->
        <div class="flex items-center gap-4 pr-4">
          <Button
            class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
            @click="handleAddTour"
          >
            Добавить тур
          </Button>
        </div>
      </div>
    </div>
    <Card class="mb-8 gap-0">
      <CardContent>
        <DataTable
          :isLoading="isLoading"
          :collection="items"
          @edit="handleEditTour"
          @delete="handleDelete"
        />
      </CardContent>
      <CardFooter class="muted border-t" v-if="pagination.currentPage && pagination.lastPage > 1">
        <Pagination
          :current-page="currentPage"
          :per-page="pagination.perPage"
          :total="pagination.total"
          :last-page="pagination.lastPage"
          @update:current-page="handlePageChange"
        />
      </CardFooter>
    </Card>
    <ConfirmDialog
      v-model:show="showConfirm"
      title="Удалить запись?"
      description="Вы уверены что хотите удалить эту запись? Это действие нельзя отменить."
      confirm-text="Удалить"
      @dismiss="onCancel"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
