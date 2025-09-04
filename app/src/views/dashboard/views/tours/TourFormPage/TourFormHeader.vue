<template>
    <div class="flex justify-between items-start mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Данные о паломническом туре</h1>
      <div class="flex items-center gap-3">
        <button 
          class="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
          @click="handleDownloadTourists"
        >
          <Download class="w-4 h-4" />
          Скачать список туристов
        </button>
        <button 
          class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          @click="handleAddOrder"
        >
          <Plus class="w-4 h-4" />
          Добавить заказ
        </button>
        <button 
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          @click="handleEdit"
        >
          <Pencil class="w-4 h-4" />
        </button>
        <button 
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          @click="handleClose"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>  
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Download, Plus, Pencil, X } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    currentItem: Object;
}>();

const handleDownloadTourists = () => {
    console.log('Download tourists list');
};

const handleAddOrder = () => {
    console.log('Add order');
};

const handleEdit = () => {
    console.log('Edit tour');
};

const handleClose = () => {
    router.push({ name: 'tours-list' });
};
</script>


