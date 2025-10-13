<script setup>
import { ref, watch, onMounted } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  tourId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const services = ref([]);
const availableServices = ref([]);

// Fetch available services for selected tour
const fetchServices = async () => {
  if (!props.tourId) {
    availableServices.value = [];
    return;
  }

  try {
    const response = await fetch(`/api/tours/${props.tourId}/services`);
    if (response.ok) {
      availableServices.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

// Watch tour ID changes
watch(() => props.tourId, () => {
  fetchServices();
  services.value = [];
});

// Sync with parent
watch(services, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

const addService = () => {
  services.value.push({
    id: null,
    quantity: 1
  });
};

const removeService = (index) => {
  services.value.splice(index, 1);
};

onMounted(() => {
  fetchServices();
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Услуги и места</h2>
    
    <div v-if="!tourId" class="text-center py-8 text-gray-500">
      Сначала выберите тур
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="p-4 border border-gray-200 rounded-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-700">Услуга {{ index + 1 }}</span>
          <button
            @click="removeService(index)"
            type="button"
            class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-2">Услуга</label>
            <select
              v-model="service.id"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option :value="null">Выберите услугу</option>
              <option
                v-for="availService in availableServices"
                :key="availService.id"
                :value="availService.id"
              >
                {{ availService.name }} - {{ availService.price }} ₽
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2">Количество</label>
            <input
              v-model.number="service.quantity"
              type="number"
              min="1"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <button
        @click="addService"
        type="button"
        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Добавить услугу
      </button>
    </div>
  </div>
</template>
