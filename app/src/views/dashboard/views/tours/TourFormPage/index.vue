<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { tourApi } from '@/api/tours';
import { toast } from 'vue-sonner';
import type { Tour } from '@/types/tour';
import TourFormData from './TourFormData.vue';
import TourFormParams from './TourFormParams.vue';
import TourFormObjectsTab from './TourFormObjectsTab.vue';
import TourFormProgram from './TourFormProgram.vue';
import TourFormMap from './TourFormMap.vue';
import TourFormTabControl from './TourFormTabControl.vue';
import TourFormDesc from './TourFormDesc.vue';
import TourFormNotes from './TourFormNotes.vue';
import TourFormTreeView from './TourFormTreeView.vue';
import { cloneDeep, isEqual } from 'lodash';
import TourFormConditions from './TourFormConditions.vue';

const router = useRouter();
const route = useRoute();
const id = ref<string | null>(null);
const currentItem = ref<Tour | null>(null);
const backupItem = ref<Tour | null>(null);
const activeTab = ref('Data');
const editMode = ref(false);

const requestBody = computed(() => {
  if (!currentItem.value || !backupItem.value) return {};
  
  const changedFields: Partial<Tour> = {};
  
  const apiFields: (keyof Tour)[] = [
    'time',
    'date',
    'title',
    'route', 
    'price',
    'duration',
    'comfort',
    'difficulty',
    'seats',
    'description',
    'notes',
    'is_active',
    'ownerable_id',
    'ownerable_type',
    'parameters',
    'services',
    'entities',
    'days',
    'countries',
    'cities',
  ];
  
  apiFields.forEach(key => {
    const currentValue = (currentItem.value as any)[key];
    const originalValue = (backupItem.value as any)[key];
    if (!isEqual(currentValue, originalValue)) {
      (changedFields as any)[key] = currentValue;
    }
  });

  
  return changedFields;
});

const hasChanges = computed(() => {
  return Object.keys(requestBody.value).length > 0;
});

const cleanNullParameters = (parameters: any) => {
  if (!parameters) return parameters;
  
  const cleaned: any = {};
  Object.keys(parameters).forEach(key => {
    if (parameters[key] !== null) {
      cleaned[key] = parameters[key];
    }
  });
  
  return cleaned;
};

const updateUrlTab = (tab: string) => {
  router.replace({
    name: route.name as string,
    params: route.params,
    query: { ...route.query, tab },
  });
};

const loadTabFromUrl = () => {
  const tabFromUrl = route.query.tab as string;
  if (
    tabFromUrl &&
    ['Data', 'Params', 'Desc', 'Notes', 'ObjectsTab', 'Program', 'Map', 'TreeView'].includes(tabFromUrl)
  ) {
    activeTab.value = tabFromUrl;
  }
};

watch(activeTab, (newTab) => {
  updateUrlTab(newTab);
});

const loadItem = async (): Promise<void> => {
  try {
    const { data } = await tourApi.getData(id.value!);
    const parameters = {
      tourType: data.tourType?.id || null,
      tourCategory: data.tourCategory?.id || null,
      tourTransport: data.tourTransport?.id || null,
      tourStatus: data.tourStatus?.id || null,
    };
    data.parameters = parameters;
    currentItem.value = cloneDeep(data);
    backupItem.value = cloneDeep(data);
  } catch (error: unknown) {
    toast.error('Ошибка загрузки данных');
    router.push({ name: 'tours-list' });
  }
};

const prepareEntities = (entities: any) => entities.map((entity: any) => ({...entity, entity_id: entity.entity.id}));
const prepareServices = (services: any) => services.map((service: any) => {
  if (service.entity) {
    service.entity_id = service.entity.id;
  }
  delete service.entity;
  delete service.id;
  return service;
});

const prepareParams = (params: any) => {
  if (params.entities) {
    params.entities = prepareEntities(params.entities);
  }
  if (params.parameters) {
    params.parameters = cleanNullParameters(params.parameters);
  }
  if (params.services) {
    params.services = prepareServices(params.services);
  }
  if (params.countries) {
    params.countries = params.countries.map((country: any) => country.id);
  }
  if (params.cities) {
    params.cities = params.cities.map((city: any) => city.id);
  }
  return params;
};


const handleSubmit = async (): Promise<void> => {
  try {
    if (id.value) {
      let body = { ...requestBody.value, title: currentItem.value!.title };
      const params = prepareParams(body);
      await tourApi.patchData(id.value, params);
      toast.success('Тур успешно обновлен');
    } else {
      let body = { ...currentItem.value! };
      const params = prepareParams(body);
      await tourApi.storeData(params);
      toast.success('Тур успешно создан');
    }
    backupItem.value = cloneDeep(currentItem.value);
    editMode.value = false;
  } catch (error: unknown) {
    console.error(error);
    toast.error('Ошибка сохранения данных');
  }
};

const handleCancel = (): void => {
  currentItem.value = cloneDeep(backupItem.value);
  editMode.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && editMode.value && !hasChanges.value) {
    handleCancel();
  }
};

const init = () => {
  loadTabFromUrl();
  const routeId = router.currentRoute.value.params.id;
  if (routeId && routeId !== 'new') {
    id.value = routeId as string;
    loadItem();
  }
};

onMounted(() => {
  init();
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div v-if="!currentItem" class="w-full p-6 bg-white rounded-xl">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Загрузка данных...</div>
    </div>
  </div>
  <div v-else class="main-content" style="margin-left: 279px; margin-top: 20px">
    <div class="mb-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          <span class="text-gray-500 text-2xl">
            Уникальный тур
          </span>
          {{ currentItem.title }}
        </h1>
        
        <div v-if="hasChanges || editMode" class="flex gap-3">
          <button
            @click="handleCancel"
            data-cancel-edit
            class="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            :disabled="!hasChanges"
            @click="handleSubmit"
            class="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            :class="{
              'opacity-50 cursor-not-allowed': !hasChanges,
            }"
          >
            Сохранить
          </button>
        </div>
      </div>
      <TourFormTabControl 
        v-model:modelValue="activeTab" 
        :hasChanges="hasChanges" 
      />
    </div>
    <div class="content">
      <TourFormData
       v-if="activeTab === 'Data'" 
       v-model:currentItem="currentItem" 
       v-model:editMode="editMode" 
      />
      <TourFormParams 
        v-else-if="activeTab === 'Params'" 
        v-model:currentItem="currentItem" 
        v-model:editMode="editMode" 
      />
      <TourFormObjectsTab
        v-else-if="activeTab === 'ObjectsTab'"
        v-model:currentItem="currentItem"
        v-model:editMode="editMode"
      />
      <TourFormProgram 
        v-else-if="activeTab === 'Program'" 
        v-model:currentItem="currentItem" 
        v-model:editMode="editMode"
      />
      <TourFormMap 
        v-else-if="activeTab === 'Map'" 
        v-model:currentItem="currentItem" 
        v-model:editMode="editMode"
      />
      <TourFormDesc 
        v-else-if="activeTab === 'Desc'" 
        v-model:currentItem="currentItem" 
        v-model:editMode="editMode" 
      />
      <TourFormNotes 
        v-else-if="activeTab === 'Notes'" 
        v-model:currentItem="currentItem" 
        v-model:editMode="editMode" 
      />
      <!-- <TourFormTreeView 
        v-else-if="activeTab === 'TreeView'" 
        :currentItem="currentItem" 
      /> -->
    </div>
  </div>
</template>

<style lang="scss">
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
</style>
