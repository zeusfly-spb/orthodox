<script setup>
import { reactive, watch, ref, onMounted } from 'vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import { useCustomerStore } from '@/stores/customer';

const emit = defineEmits(['add-item']);

const customerStore = useCustomerStore();
const isMounted = ref(false);

const form = reactive({
  clientType: 'Выберите тип',
  clientName: 'Выберите наименование',
  comment: '',
});

function pushForm() {
  emit('add-item', { ...form });
}

watch(
  () => form.clientType,
  (newVal) => {
    if (isMounted.value) pushForm();
  },
);
watch(
  () => form.clientName,
  (newVal) => {
    if (isMounted.value) pushForm();
  },
);
watch(
  () => form.comment,
  (newVal) => {
    if (isMounted.value) pushForm();
  },
);

onMounted(async () => {
  try {
    await customerStore.fetchClientNames();
    isMounted.value = true;
  } catch (err) {
    console.error('Ошибка:', err);
    form.clientType = '';
    form.clientName = '';
  }
});
</script>

<template>
  <div class="section filters">
    <h2 class="section-title">Заказчик</h2>
    <div class="customer-info">
      <div class="info-grid grid-n">
        <div class="info-item">
          <label class="info-label">Тип Заказчика</label>
          <div class="filter-item">
            <UDropdown v-model="form.clientType" :list="['Физ.лицо', 'Юр.лицо']" />
          </div>
        </div>
        <div class="info-item">
          <label class="info-label">Наименование Заказчика</label>
          <div class="filter-item">
            <UDropdown
              v-model="form.clientName"
              :list="customerStore.clientNames"
              :withSearch="true"
            />
          </div>
        </div>
      </div>
      <div class="info-item">
        <label class="info-label">Комментарий</label>
        <textarea class="input-field" rows="3" v-model="form.comment"></textarea>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.section {
  margin-bottom: 30px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #353535;
  padding-bottom: 8px;
  margin-bottom: 20px;
}
.filters {
  background: #fff;
  padding: 20px;
  border-radius: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.customer-info {
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  margin-top: 10px;
}
.info-item {
  margin-bottom: 12px;
}
.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
}
.info-value {
  font-size: 14px;
  color: #353535;
  font-weight: 500;
}
.info-grid.grid-n {
  grid-template-columns: 150px 1fr;
}
.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
}
</style>
