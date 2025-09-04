<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import TourFormHeader from '@/views/dashboard/views/tours/TourFormHeader.vue';
import TourFormOverview from '@/views/dashboard/views/tours/TourFormOverview.vue';
import TourFormCards from './TourFormCards.vue';
import TourFormLogistics from './TourFormLogistics.vue';
import TourFormRatings from './TourFormRatings.vue';
import TourFormExtras from './TourFormExtras.vue';
import TourFormSummary from './TourFormSummary.vue';
import { tourApi } from '@/api/tours';
import { toast } from 'vue-sonner';
import type { Tour } from '@/types/tour';
import { useToursStore } from '@/stores/tours';
import TourFormObjects from './TourFormObjects.vue';


const router = useRouter();
const { formatCurrency } = useToursStore();
const id = ref<string | null>(null);
const currentItem = ref<Tour | null>(null);

onMounted(() => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId && routeId !== 'new') {
    id.value = routeId as string;
    loadItem();
  }
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
  >
  <div class="content">
    <TourFormHeader 
      :currentItem="currentItem" 
    />

    <TourFormOverview
      v-model:currentItem="currentItem"
    />

    <TourFormCards 
      v-model:currentItem="currentItem" 
    /> 

    <TourFormLogistics 
      v-model:currentItem="currentItem"
    />

    <TourFormObjects
      v-model:currentItem="currentItem" 
    />

    <TourFormRatings
      v-model:currentItem="currentItem" 
    />

    <TourFormExtras 
      v-model:currentItem="currentItem" 
    />

    <TourFormSummary
        v-model:currentItem="currentItem" 
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

