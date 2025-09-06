<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToursStore } from '@/stores/tours.ts';
import { storeToRefs } from 'pinia';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';
import DataTable from '@/components/dashboard/tours/DataTable.vue';
import Pagination from '@/components/app/Pagination.vue';
import TourListTags from '@/views/dashboard/views/tours/TourListTags.vue';
import TourListSort from '@/views/dashboard/views/tours/TourListSort.vue';
import TourListHead from '@/components/dashboard/tours/TourListHead.vue';
import TourListFilters from '@/components/dashboard/tours/TourListFilters.vue';

const route = useRoute();
const router = useRouter();
const toursStore = useToursStore();
const { handlePageChange, handleDelete, showConfirm, onDeleteConfirm, onCancel } = toursStore;

const tours = computed<Array<{ id: string | number; [key: string]: unknown }>>(
  () => toursStore.items,
);
const isLoading = computed<boolean>(() => toursStore.isLoading);
const currentPage = computed<number>(() => toursStore.currentPage);
const pagination = computed<{
  currentPage?: number | null;
  lastPage?: number | null;
  perPage?: number | null;
  total?: number | null;
}>(() => toursStore.pagination);

const handleAddTour = (): void => {
  router.push({ name: 'tour-create' });
};

const handleDownloadReport = (): void => {
  console.log('DOWNLOAD REPORT');
};
const handleEditTour = (id: string | number): void => {
  router
    .push({
      name: 'tour-edit',
      params: { id: String(id) },
    })
    .catch((err: Error) => {
      console.error('Navigation error:', err);
    });
};
</script>

<template>
  <div class="main-content">
    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
          <TourListHead @addTour="handleAddTour" @downloadReport="handleDownloadReport" />
          <TourListFilters />
          <TourListTags />
          <TourListSort />
        </div>
        <DataTable @edit="handleEditTour" @delete="handleDelete" />
      </CardContent>
      <CardFooter
        class="muted border-t"
        v-if="pagination?.currentPage && pagination?.lastPage && pagination.lastPage > 1"
      >
        <Pagination
          :current-page="currentPage || 1"
          :per-page="pagination?.perPage || 10"
          :total="pagination?.total || 0"
          :last-page="pagination?.lastPage || 1"
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
