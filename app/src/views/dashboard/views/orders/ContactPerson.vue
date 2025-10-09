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

const contactPersons = ref([
  {
    id: Date.now(),
    fio: '',
    phone: ''
  }
]);

// Sync with parent
watch(contactPersons, (newVal) => {
  emit('update:modelValue', newVal.map(({ fio, phone }) => ({ fio, phone })));
}, { deep: true });

const addContactPerson = () => {
  contactPersons.value.push({
    id: Date.now(),
    fio: '',
    phone: ''
  });
};

const removeContactPerson = (index) => {
  if (contactPersons.value.length > 1) {
    contactPersons.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-6">Контактные лица</h2>
    
    <div class="space-y-4">
      <div
        v-for="(contact, index) in contactPersons"
        :key="contact.id"
        class="p-4 border border-gray-200 rounded-xl"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-gray-700">Контактное лицо {{ index + 1 }}</span>
          <button
            v-if="contactPersons.length > 1"
            @click="removeContactPerson(index)"
            type="button"
            class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-2">ФИО</label>
            <input
              v-model="contact.fio"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Введите ФИО"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-2">Телефон</label>
            <input
              v-model="contact.phone"
              type="tel"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+7 (999) 999-99-99"
            />
          </div>
        </div>
      </div>

      <button
        @click="addContactPerson"
        type="button"
        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Добавить контактное лицо
      </button>
    </div>
  </div>
</template>
