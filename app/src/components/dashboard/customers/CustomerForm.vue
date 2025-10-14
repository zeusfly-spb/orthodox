<script setup>
import { ref, watch } from 'vue';
import { Plus, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const customers = ref([
  {
    id: Date.now(),
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    phone: '',
    passport_series: '',
    passport_number: '',
    passport_issue_date: null,
    passport_unit_name: null,
    passport_unit_code: null,
    passport_birth_date: null,
    passport_birth_place: null,
    passport_address: null
  }
]);

// Sync with parent
watch(customers, (newVal) => {
  emit('update:modelValue', newVal.map(({ id, ...customer }) => customer));
}, { deep: true });

const addCustomer = () => {
  customers.value.push({
    id: Date.now(),
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',  
    phone: '',
    passport_series: '',
    passport_number: '',
    passport_issue_date: null,
    passport_unit_name: null,
    passport_unit_code: null,
    passport_birth_date: null,
    passport_birth_place: null,
    passport_address: null
  });
};

const removeCustomer = (index) => {
  if (customers.value.length > 1) {
    customers.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Заказчик</h2>
    
    <div class="space-y-6">
      <div
        v-for="(customer, index) in customers"
        :key="customer.id"
        class="p-4 border border-gray-200 rounded-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-700">Заказчик </span>
          <button
            v-if="customers.length > 1"
            @click="removeCustomer(index)"
            type="button"
            class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-2">Фамилия</label>
              <input
                v-model="customer.lastname"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Фамилия"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">Имя</label>
              <input
                v-model="customer.firstname"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Имя"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">Отчество</label>
              <input
                v-model="customer.patronymic"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Отчество"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-2">Email</label>
              <input
                v-model="customer.email"
                type="email"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">Телефон</label>
              <input
                v-model="customer.phone"
                type="tel"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+7 (999) 999-99-99"
              />
            </div>
          </div>

           Passport Info 
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-2">Серия паспорта</label>
              <input
                v-model="customer.passport_series"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="1234"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">Номер паспорта</label>
              <input
                v-model="customer.passport_number"
                type="text"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="567890"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        @click="addCustomer"
        type="button"
        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Добавить закачика
      </button>
    </div>
  </div>
</template>
