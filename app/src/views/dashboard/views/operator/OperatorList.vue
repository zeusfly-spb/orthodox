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
import logoOperator from '@/assets/images/logo-prof.svg'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
    <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
      <div class="flex shrink-0 items-center justify-between gap-2">
        <div class="flex items-center gap-4 pl-4">
          <template v-if="isLoading">
            <Skeleton class="h-20 w-20 rounded-full" />
            <Skeleton class="h-4 w-96" />
          </template>
          <template v-else>
            <Avatar class="h-20 w-20">
              <AvatarImage :src="logoOperator" :alt="items.name" />
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
            class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
            @click="showForm = true"
          >
            Редактировать
          </Button>
        </div>
      </div>
    </div>

    <div class="bg-bread-proc flex rounded-xl py-6 mb-8 gap-4 items-center">
      <div class="circular-progress">
        <svg class="progress-ring" width="48" height="48" viewBox="0 0 48 48">
          <circle
            class="progress-ring-circle-bg"
            cx="24"
            cy="24"
            r="18"
            stroke-width="6"
            fill="transparent"
          ></circle>
          <circle
            class="progress-ring-circle"
            cx="24"
            cy="24"
            r="18"
            stroke-width="6"
            fill="transparent"
            stroke-dasharray="113.1"
            stroke-dashoffset="30.5"
          ></circle>
        </svg>
      </div>
      <div class="progress-description">
        <h3 class="font-medium">Профиль Паломнической службы заполнен на 73%</h3>
      </div>
    </div>

    <div class="relative w-full overflow-auto">
      <Tabs default-value="tab-full-data" class="w-full">
        <TabsList>
          <TabsTrigger value="tab-full-data"> ДАННЫЕ О ПАЛОМНИЧЕСКОЙ СЛУЖБЕ </TabsTrigger>
          <TabsTrigger value="tab-requisite"> РЕКВИЗИТЫ </TabsTrigger>
          <TabsTrigger value="tab-files"> ФАЙЛЫ </TabsTrigger>
          <TabsTrigger value="tab-faq"> FAQ </TabsTrigger>
        </TabsList>

        <TabsContent value="tab-full-data">
          <div class="flex flex-col gap-6 rounded-xl py-6 px-4 mb-8 border shadow-sm">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              ДАННЫЕ О ПАЛОМНИЧЕСКОЙ СЛУЖБЕ
            </h3>
          </div>
        </TabsContent>

        <TabsContent value="tab-requisite">
          <div class="flex flex-col gap-6 rounded-xl py-6 px-4 mb-8 border shadow-sm">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              РЕКВИЗИТЫ
            </h3>
          </div>
        </TabsContent>

        <TabsContent value="tab-files">
          <div class="flex flex-col gap-6 rounded-xl py-6 px-4 mb-8 border shadow-sm">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">ФАЙЛЫ</h3>
          </div>
        </TabsContent>

        <TabsContent value="tab-faq">
          <div class="flex flex-col gap-6 rounded-xl py-6 px-4 mb-8 border shadow-sm">
            <h3 class="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">FAQ</h3>
          </div>
        </TabsContent>
      </Tabs>
    </div>

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
                class="bg-emerald-500 text-white shadow hover:bg-emerald-500/90 px-8 py-6"
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
