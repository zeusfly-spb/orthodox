<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
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
import TourFormTreeView from './TourFormTreeView.vue';

const router = useRouter();
const route = useRoute();
const id = ref<string | null>(null);
const currentItem = ref<Tour | null>(null);
const activeTab = ref('Data');

const updateUrlTab = (tab: string) => {
  router.replace({
    name: route.name as string,
    params: route.params,
    query: { ...route.query, tab }
  });
};

const loadTabFromUrl = () => {
  const tabFromUrl = route.query.tab as string;
  if (tabFromUrl && ['Data', 'Params', 'Desc', 'ObjectsTab', 'Program', 'Map', 'TreeView'].includes(tabFromUrl)) {
    activeTab.value = tabFromUrl;
  }
};

watch(activeTab, (newTab) => {
  updateUrlTab(newTab);
});

const loadItem = async (): Promise<void> => {
  try {
    const { data } = await tourApi.getData(id.value!);
    currentItem.value = data;
  } catch (error: unknown) {
    toast.error('Ошибка загрузки данных');
    router.push({ name: 'tours-list' });
  }
};

const handleSubmit = async (formData: Partial<Tour>): Promise<void> => {
  try {
    if (id.value) {
      await tourApi.patchData(id.value, formData);
      toast.success('Тур успешно обновлен');
    } else {
      await tourApi.storeData(formData);
      toast.success('Тур успешно создан');
    }
    router.push({ name: 'tours-list' });
  } catch (error: unknown) {
    toast.error('Ошибка сохранения данных');
  }
};

const handleCancel = (): void => {
  router.push({ name: 'tours-list' });
};

onMounted(() => {
  loadTabFromUrl();
  const routeId = router.currentRoute.value.params.id;
  if (routeId && routeId !== 'new') {
    id.value = routeId as string;
    loadItem();
  }
});
</script>

<template>
  <div v-if="!currentItem" class="w-full p-6 bg-white rounded-xl">
    <div class="flex items-center justify-center h-32">
      <div class="text-gray-500">Загрузка данных...</div>
    </div>
  </div>
  <div 
    v-else
    class="main-content"
    style="margin-left: 279px; margin-top: 20px;"
  >
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Уникальный тур</h1>
      <TourFormTabControl
        v-model:modelValue="activeTab"
      />
    </div>
    <div class="content">
      <TourFormData
        v-if="activeTab === 'Data'"
        v-model:currentItem="currentItem"
      />
      <TourFormParams
        v-else-if="activeTab === 'Params'"
        v-model:currentItem="currentItem"
      />
      <TourFormObjectsTab
        v-else-if="activeTab === 'ObjectsTab'"
        v-model:currentItem="currentItem"
      />
      <TourFormProgram
        v-else-if="activeTab === 'Program'"
        v-model:currentItem="currentItem"
      />
      <TourFormMap
        v-else-if="activeTab === 'Map'"
        v-model:currentItem="currentItem"
      />
      <TourFormDesc
        v-else-if="activeTab === 'Desc'"
        v-model:currentItem="currentItem"
      />
      <TourFormTreeView
        v-else-if="activeTab === 'TreeView'"
        :currentItem="currentItem"
      />
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

