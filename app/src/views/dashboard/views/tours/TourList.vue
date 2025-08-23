<script setup lang="ts">
import {ref, watch, computed, reactive} from 'vue'
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
import {ArrowDownToLine, X, ArrowDownUp, Pencil} from 'lucide-vue-next'

import {useRouter} from 'vue-router'
import {Badge} from '@/components/ui/badge'
import TourListTags from '@/views/dashboard/views/tours/TourListTags.vue'
import TourListSort from '@/views/dashboard/views/tours/TourListSort.vue'

import api from '@/api/httpClient';
import Spinner from "@/components/app/Spinner.vue";


const route = useRoute()
const router = useRouter()
const params = ref({});

const tourTypes = ref([]);
const tourCategories = ref([]);
const tourTransports = ref([]);

const queryParams = reactive({
  searchString: {param: 'filter[title]', value: ''},
  dayCount: {param: '', value: ''},
  pilCount: {param: '', value: ''},
  tourTypeId: {param: 'filter[tourType.id]', value: 0},
  tourCategoryId: {param: 'filter[tourCategory.id]', value: 0},
  tourTransportId: {param: 'filter[tourTransport.id]', value: 0},
});

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

const getParams = async () => {
  const {data} = await api.get('/manage/tours/parameters');
  tourTypes.value = data.data.find(item => item.slug === 'tour-types').children;
  tourCategories.value = data.data.find(item => item.slug === 'tour-categories').children;
  tourTransports.value = data.data.find(item => item.slug === 'tour-transports').children;
  params.value = data.data;
};

const handleAddTour = () => {
  router.push({name: 'tour-create'})
}

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

watch(queryParams, val => {
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

watch(isLoading, val => {
  if (val) {
    console.log('LOADING...');
  }
});

getParams();
</script>

<template>
  <div>
    <Card class="mb-8 gap-0">
      <CardContent>
        <div class="flex flex-col gap-6 rounded-xl py-6 mb-8">
          <div class="flex shrink-0 items-center justify-between gap-2">
            <div class="flex items-center gap-4 pl-4">
              <h1 class="text-lg font-bold text-muted-foreground">
                Паломнические туры
              </h1>
            </div>
            <div class="flex items-center gap-4 pr-4">
              <Button
                variant="outline"
                class="bg-white text-emerald-500 border-emerald-500 shadow hover:bg-emerald-500/90 hover:text-white px-8 py-6 touchable"
                @click="handleAddTour"
              >
                <ArrowDownToLine/>
                Скачать отчет
              </Button>
              <Button
                class="bg-emerald-500 text-white shadow hover:bg-white hover:text-emerald-500 px-8 py-6 touchable"
                @click="handleAddTour"
              >
                Создать новый тур
              </Button>
            </div>
          </div>
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center mb-6">
              <span
                class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white mr-4">
              <svg width="16" height="16" fill="none"><circle cx="8" cy="8" r="8"
                                                              fill="gray"/></svg>
              </span>
            <div>
              <div class="font-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div class="text-gray-500 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
            <button class="ml-auto text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor"/>
              </svg>
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Поиск по турам..."
              class="border rounded-xl px-3 py-2 w-64"
              v-model="queryParams.searchString.value"
            />

            <select
              class="border rounded-xl px-2 py-2"
              v-model="queryParams.dayCount.value"
            >
              <option value="">Длительность</option>
              <option value="1">1 день</option>
              <option value="2">2 дня</option>
            </select>

            <select
              class="border rounded-xl px-2 py-2"
              v-model="queryParams.pilCount.value"
            >
              <option value="">Паломников</option>
              <option value="1">1 паломник</option>
              <option value="2">2 паломника</option>
            </select>

            <div class="flex border border-gray-300 rounded-[12px] overflow-hidden w-fit h-9">
              <div class="flex items-center px-3 border-r border-gray-300 bg-white">
                <input
                  type="number"
                  placeholder="Цена от"
                  class="outline-none text-gray-500 placeholder-gray-400 bg-transparent w-20 text-sm"
                />
                <span class="ml-1 text-gray-400 text-sm">₽</span>
              </div>
              <div class="flex items-center px-3 bg-white">
                <input
                  type="number"
                  placeholder="Цена до"
                  class="outline-none text-gray-500 placeholder-gray-400 bg-transparent w-20 text-sm"
                />
                <span class="ml-1 text-gray-400 text-sm">₽</span>
              </div>
            </div>

            <select
              class="border rounded-xl px-2 py-2"
              v-model="queryParams.tourTypeId.value"
            >
              <option value="0">Тип тура</option>
              <option
                v-for="type in tourTypes"
                :key="`type-option-${type.id}`"
                :value="type.id"
              >
                {{ type.title }}
              </option>
            </select>
            
            <select
              class="border rounded-xl px-2 py-2"
              v-model="queryParams.tourCategoryId.value"
            >
              <option value="0">Категория тура</option>
              <option
                v-for="category in tourCategories"
                :key="`category-option-${category.id}`"
                :value="category.id"
              >
                {{ category.title }}
              </option>
            </select>

            <select
              class="border rounded-xl px-2 py-2"
              v-model="queryParams.tourTransportId.value"
            >
              <option value="0">Логистика тура</option>
              <option
                v-for="transport in tourTransports"
                :key="`transport-option-${transport.id}`"
                :value="transport.id"
              >
                {{ transport.title }}
              </option>
            </select>

          </div>
          <TourListTags/>
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
