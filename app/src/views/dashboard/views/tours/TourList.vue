<script setup lang="ts">
import {ref, watch, computed } from 'vue';
import {useRoute} from 'vue-router';
import {useRouter} from 'vue-router';
import {useToursStore} from "@/stores/tours.ts";
import {storeToRefs} from "pinia";
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import ConfirmDialog from '@/components/app/ConfirmDialog.vue';
import DataTable from '@/components/dashboard/tours/DataTable.vue';
import Pagination from '@/components/app/Pagination.vue';
;import TourListTags from '@/views/dashboard/views/tours/TourListTags.vue'
import TourListSort from '@/views/dashboard/views/tours/TourListSort.vue'
import TourListHead from "@/components/dashboard/tours/TourListHead.vue";
;import TourListFilters from "@/components/dashboard/tours/TourListFilters.vue";

const route = useRoute();
const router = useRouter();
const {handlePageChange, handleDelete, showConfirm, onDeleteConfirm, onCancel}  = useToursStore();

const tours = computed<any>(() => useToursStore().items);
const isLoading = computed<boolean>(() => useToursStore().isLoading);
const currentPage = computed(() => useToursStore().currentPage);
const pagination = computed(() => useToursStore().pagination);

const handleAddTour = () => {
  router.push({name: 'tour-create'})
};

const handleDownloadReport = () => {
  console.log('DOWNLOAD REPORT');
};

const handleEditTour = (id: string | number) => {
  router
    .push({
      name: 'tour-edit',
      params: {id: String(id)}
    })
    .catch((err) => {
      console.error('Navigation error:', err)
    })
};
</script>

<template>
  <div>
    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
          <TourListHead
            @addTour="handleAddTour"
            @downloadReport="handleDownloadReport"
          />
          <TourListFilters />
          <TourListTags />
          <TourListSort />
        </div>
        <DataTable
          @edit="handleEditTour"
          @delete="handleDelete"
        />
      </CardContent>
      <CardFooter
        class="muted border-t"
        v-if="pagination.currentPage && pagination.lastPage > 1"
      >
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
