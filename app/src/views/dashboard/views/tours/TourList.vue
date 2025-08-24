<script setup lang="ts">
import {ref, watch, computed, reactive, onBeforeMount} from 'vue';
import api from '@/api/httpClient';

import {Card, CardContent, CardFooter} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'

import ConfirmDialog from '@/components/app/ConfirmDialog.vue'

import DataTable from '@/components/dashboard/tours/DataTable.vue'
import TourForm from '@/components/dashboard/tours/TourForm.vue'

import {tourApi} from '@/api/tours'
import {useCrudActions} from '@/composables/useCrudActions'

import Pagination from '@/components/app/Pagination.vue'
import {useRoute} from 'vue-router'

import {usePaginationFilters} from '@/composables/usePaginationFilters'
import CustomerForm from '@/components/dashboard/customers/CustomerForm.vue'

import {useRouter} from 'vue-router'
import {Badge} from '@/components/ui/badge'

import TourListTags from '@/views/dashboard/views/tours/TourListTags.vue'
import TourListSort from '@/views/dashboard/views/tours/TourListSort.vue'
import TourListHead from "@/components/dashboard/tours/TourListHead.vue";

import {useToursStore} from "@/stores/tours.ts";
import {storeToRefs} from "pinia";
import TourListFilters from "@/components/dashboard/tours/TourListFilters.vue";

const route = useRoute()
const router = useRouter()
const params = ref({});

const {queryFilters} = storeToRefs(useToursStore());
const tourTypes = computed(() => useToursStore().tourTypes);
const tourCategories = computed(() => useToursStore().tourCategories);
const tourTransports = computed(() => useToursStore().tourTransports);
const tourStatuses = computed(() => useToursStore().tourStatuses);

// Инициализация с дефолтными фильтрами
const {
  filters,
  complexFilters,
  applyFilters,
  resetFilters,
  handlePageChange,
  currentPage
} = usePaginationFilters({
  search: '',
  status: ''
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
  onCancel
} = useCrudActions(tourApi, {
  successMessage: 'Данные сохранены',
  deleteMessage: 'Данные удалены'
});

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
}

// Загрузка данных при изменении фильтров
watch(
  complexFilters,
  (newFilters) => {
    loadCollection(newFilters);
  },
  {immediate: true}
);

watch(queryFilters, val => {
  let filters = {};
  Object.keys(val).forEach(key => {
    if (!!val[key].value && val[key].value !== '0') {
      if (key === 'searchString' && val[key].value.length < 3) {
        return;
      }
      filters[val[key].param] = val[key].value;
    }
  });
  loadCollection(filters);
}, {immediate: true, deep: true});

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
          <TourListSort
            :items="items"
          />
        </div>
        <DataTable
          :isLoading="isLoading"
          :collection="items"
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
