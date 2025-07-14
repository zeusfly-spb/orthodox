<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/app/ConfirmDialog.vue'
import ManagerTable from '@/components/dashboard/operator/ManagerTable.vue'
import { profileApi } from '@/api/profile'
import { useCrudActions } from '@/composables/useCrudActions'
import { useManagerActions } from '@/composables/useManagerActions'
import Pagination from '@/components/app/Pagination.vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import IconHome from '@/components/icons/IconHome.vue'
import { Skeleton } from '@/components/ui/skeleton'
import OperatorForm from '@/components/dashboard/operator/OperatorForm.vue'
import ManagerForm from '@/components/dashboard/operator/ManagerForm.vue'

// Оператор
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

// Менеджеры
const {
  isLoading: isLoadingManagers,
  showConfirm: showConfirmManager,
  showForm: showManagerForm,
  handledItemId: handledManagerId,
  items: managers,
  currentItem: currentManager,
  pagination: paginationManagers,
  loadCollection: loadManagers,
  handleSubmit: handleSubmitManager,
  handleEdit: handleEditManager,
  handleDelete: handleDeleteManager,
  onDeleteConfirm: onDeleteConfirmManager,
  onCancel: onCancelManager,
} = useManagerActions()

// Load initial data
loadCollection()
//loadManagers()

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
  loadCollection({
    page: 1,
    ...filters.value,
  })
}
</script>

<template>
  <div>
    <!-- Оператор -->
    <Card class="mb-8">
      <CardContent>
        <div class="flex shrink-0 items-center justify-between gap-2">
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

    <!-- Менеджеры -->
    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="mb-8">
          <div class="flex shrink-0 items-center justify-between gap-2">
            <div class="flex items-center gap-4 pl-4">
              <h1 class="text-lg font-bold text-muted-foreground">Менеджеры</h1>
            </div>
            <div class="flex items-center gap-4 pr-4">
              <Button
                class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90"
                @click="showManagerForm = true"
              >
                Добавить менеджера
              </Button>
            </div>
          </div>
        </div>
        <ManagerTable
          :isLoading="isLoadingManagers"
          :collection="items.managers"
          @edit-manager="handleEditManager"
          @delete-manager="handleDeleteManager"
        />
      </CardContent>
      <CardFooter
        class="muted border-t"
        v-if="paginationManagers.currentPage && paginationManagers.lastPage > 1"
      >
        <Pagination
          :current-page="paginationManagers.currentPage"
          :per-page="paginationManagers.perPage"
          :total="paginationManagers.total"
          :last-page="paginationManagers.lastPage"
          @update:current-page="(page) => loadManagers({ page })"
        />
      </CardFooter>
    </Card>

    <!-- Формы -->
    <OperatorForm
      v-model:open="showForm"
      createTitle="Редактировать данные"
      editTitle="Редактировать данные"
      description="Данные"
      submit-text="Сохранить"
      cancel-text="Отмена"
      :item="items"
      @dismiss="onCancel"
      @submit="handleSubmit"
    />

    <ManagerForm
      v-model:open="showManagerForm"
      createTitle="Добавить менеджера"
      editTitle="Редактировать менеджера"
      description="Данные менеджера"
      submit-text="Сохранить"
      cancel-text="Отмена"
      :item="currentManager"
      @dismiss="onCancelManager"
      @submit="handleSubmitManager"
    />

    <ConfirmDialog
      v-model:show="showConfirmManager"
      title="Удалить менеджера?"
      description="Вы уверены что хотите удалить этого менеджера? Это действие нельзя отменить."
      confirm-text="Удалить"
      @dismiss="onCancelManager"
      @confirm="onDeleteConfirmManager"
    />
  </div>
</template>
