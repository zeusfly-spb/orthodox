<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToursStore } from '@/stores/tours.ts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';
import DataTable from '@/components/dashboard/tours/DataTable.vue';
import Pagination from '@/components/app/Pagination.vue';
import TourListTags from '@/views/dashboard/views/tours/TourListTags.vue';
import TourListSort from '@/views/dashboard/views/tours/TourListSort.vue';
import TourListHead from '@/components/dashboard/tours/TourListHead.vue';
import TourListFilters from '@/components/dashboard/tours/TourListFilters.vue';

const router = useRouter();
const toursStore = useToursStore();
const { handlePageChange, handleDelete, showConfirm, onDeleteConfirm, onCancel, init } = toursStore;

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

init();
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

<style lang="scss" scoped>
.main-content {
  flex: 1;
  margin-left: 250px;
  transition: all 0.3s;
  min-width: 0;
}

.content {
  padding: 30px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.white-bg {
  background: #fff;
  padding: 20px;
  margin-bottom: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title-g {
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-primary {
  background-color: rgba(16, 185, 129, 1);
  color: #fff;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
}

.btn-primary:hover {
  background-color: #0f9166;
}

.search-filters-container2 {
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  grid-gap: 24px;
}

.search-container {
  margin-bottom: 16px;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.filters-scroll-container {
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -10px;
  padding-bottom: 10px;
  position: relative;
}

.filters-grid {
  display: flex;
  z-index: 1000;
  position: relative;
  gap: 12px;
  position: relative;
  width: max-content;
  min-width: 100%;
  gap: 12px;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
}

.filter-select {
  width: 100%;
  padding: 10px 14px;
  padding-right: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 20px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
  line-height: 1.5;
}

.tag-item.active {
  background: rgba(53, 53, 53, 1);
  color: #fff;
}

.tag-item.active svg {
  fill: #fff;
}

.tag-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag-close:hover {
  opacity: 1;
}

.tag-item:not(.active) .tag-close {
  display: none;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(241, 241, 244, 1);
  border: none;
  color: rgba(106, 110, 117, 1);
  font-size: 12px;
  border-radius: 44px;
  cursor: pointer;
  border: 1px dashed rgba(159, 166, 175, 1);
  padding: 6px 12px;
}

.add-tag-btn:hover {
  color: #3e8e41;
}

.add-tag-btn svg {
  flex-shrink: 0;
  fill: rgba(106, 110, 117, 1);
}

.table-wrapper2 {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  background: #f9fafb;
  font-weight: 500;
  color: #6a6e75;
  font-size: 12px;
  text-transform: uppercase;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.user-name2 {
  font-weight: 500;
  font-style: Medium;
  font-size: 16px;
  line-height: 24px;
  color: rgba(53, 53, 53, 1);
}

.status-item {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-name {
  background-color: rgba(16, 185, 129, 0.12);
  color: rgba(16, 185, 129, 1);
  border-radius: 44px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}

.actions-container {
  position: relative;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-btn,
.more-btn {
  background: 0 0;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover svg path,
.more-btn:hover svg path {
  fill: #10b981;
}
</style>
