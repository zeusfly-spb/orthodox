<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/app/ConfirmDialog.vue'

import ManagerTable from '@/components/dashboard/operator/ManagerTable.vue'
import PartnerForm from '@/components/dashboard/partners/PartnerForm.vue'
import { profileApi } from '@/api/profile'
import { useCrudActions } from '@/composables/useCrudActions'
import Pagination from '@/components/app/Pagination.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import IconHome from '@/components/icons/IconHome.vue'
import { Skeleton } from '@/components/ui/skeleton'

const {
  isLoading,
  showConfirm,
  showForm,
  handledItemId,
  items,
  currentItem,
  pagination,
  loadCollection,
  handleSubmit,
  handleEdit,
  handleDelete,
  onDeleteConfirm,
  onCancel,
} = useCrudActions(profileApi, {
  successMessage: 'Данные сохранены',
  deleteMessage: 'Данные удалены',
})

// Load API data
loadCollection()

// Filters
const filters = ref({
  search: '',
  status: '',
})

const handlePageChange = (page: number) => {
  loadCollection({
    page,
    ...filters.value,
  })
}

const applyFilters = () => {
  // Сбрасываем на первую страницу при применении фильтров
  loadCollection({
    page: 1,
    ...filters.value,
  })
}
</script>

<template>
  <div>
    <Card class="mb-8">
      <CardContent>
        <div class="flex shrink-0 items-center justify-between gap-2">
          <!-- Левая часть -->
          <div class="flex items-center gap-4 pl-4">
            <template v-if="isLoading">
              <Skeleton class="h-20 w-20 rounded-full" />
              <Skeleton class="h-4 w-96" />
            </template>
            <template v-else>
              <Avatar class="h-20 w-20">
                <AvatarImage :src="items?.avatar || ''" :alt="items.name" />
                <AvatarFallback>
                  <IconHome />
                </AvatarFallback>
              </Avatar>
              <div class="flex-column items-center">
                <h1 class="text-lg font-bold text-muted-foreground">{{ items.name }}</h1>
                <div class="text-md text-muted-foreground">
                  {{ items?.json_attributes?.number_date || '' }}
                </div>
              </div>
            </template>
          </div>
          <!-- Правая часть -->
          <div class="flex items-center gap-4 pr-4">
            <Button
              class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
              @click="showForm = true"
            >
              Редактировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="mb-8">
          <div class="flex shrink-0 items-center justify-between gap-2">
            <!-- Левая часть -->
            <div class="flex items-center gap-4 pl-4">
              <h1 class="text-lg font-bold text-muted-foreground">Менеджеры</h1>
            </div>
            <!-- Правая часть -->
            <div class="flex items-center gap-4 pr-4">
              <Button
                class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
                @click="showForm = true"
              >
                Добавить менеджера
              </Button>
            </div>
          </div>
        </div>
        <ManagerTable
          :isLoading="isLoading"
          :collection="items.managers || []"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </CardContent>
      <CardFooter class="muted border-t" v-if="pagination.currentPage && pagination.lastPage > 1">
        <Pagination
          :current-page="pagination.currentPage"
          :per-page="pagination.perPage"
          :total="pagination.total"
          :last-page="pagination.lastPage"
          @update:current-page="handlePageChange"
        />
      </CardFooter>
    </Card>
    <PartnerForm
      v-model:open="showForm"
      createTitle="Добавить менеджера"
      editTitle="Редактировать данные"
      description="Данные"
      submit-text="Сохранить"
      cancel-text="Отмена"
      :item="currentItem"
      @dismiss="onCancel"
      @submit="handleSubmit"
    />
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
