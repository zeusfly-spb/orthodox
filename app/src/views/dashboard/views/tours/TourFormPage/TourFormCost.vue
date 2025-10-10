<template>
    <div class="tour-cost">
      <div v-if="!editMode" class="view-mode">
        <div class="view-header">
          <h2 class="section-title">Стоимость тура</h2>
          <button
            :class="[
              'p-2 rounded-lg transition-colors touchable',
              editMode
                ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
            ]"
            @click="handleEdit"
          >
            <Pencil class="w-4 h-4" />
          </button>
        </div>
        <div class="view-content" v-if="basicServices.length > 0 && basicServices[0].title.length > 0">
          <div v-for="service in basicServices" :key="service.id" class="view-service-row">
            <span class="service-name">{{ service.title }}</span>
            <span class="service-price">{{ formatCurrency(service.price) }} ₽</span>
          </div>
        </div>
      </div>

      <div v-else class="edit-mode">
        <div class="section-header">
          <div class="section-title-wrapper">
            <h2 class="section-title">Стоимость тура</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <button class="help-button" type="button" @click.stop>
                    <IconQuestionMark />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Информация о стоимости тура</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <button
              :class="[
                'p-2 rounded-lg transition-colors touchable ml-auto',
                editMode
                  ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
              ]"
              @click="handleEdit"
            >
              <Pencil class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="cost-content">
          <div v-for="(service, index) in basicServices" :key="service.id" class="cost-row">
            <div class="cost-field">
              <label class="cost-label">Наименование основной услуги</label>
              <Input
                v-model="service.title"
                type="text"
                class="cost-input"
                placeholder="Введите наименование основной услуги"
              />
            </div>
            <div class="cost-field cost-field-price">
              <label class="cost-label">Стоимость</label>
              <Input
                v-model.number="service.price"
                type="number"
                class="cost-input"
                placeholder="Введите стоимость тура"
              />
            </div>
            <button
              type="button"
              class="delete-service-button"
              @click="removeService(index)"
              title="Удалить услугу"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <button class="add-service-button" @click="addService">
            <IconPlus />
            Еще основная услуга
          </button>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Tour } from '@/types/tour';
import type { Service } from '@/types/service';
import IconQuestionMark from '@/components/icons/IconQuestionMark.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import { Pencil, Trash2 } from 'lucide-vue-next';
const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});


const basicServices = computed({
  get(): Service[] {
    if (!tour.value.services) {
      return [];
    }
    return tour.value.services.filter(s => s.type === 'basic');
  },
  set(value: Service[]) {
    const otherServices = tour.value.services?.filter(s => s.type !== 'basic') || [];
    tour.value = { ...tour.value, services: [...otherServices, ...value] };
  },
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}



const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const handleEdit = () => {
  editMode.value = !editMode.value;
};

function addService() {
  const newService: Service = {
    id: Date.now().toString(),
    title: '',
    description: '',
    price: 0,
    type: 'basic',
    is_active: true,
  };

  const updatedBasicServices = [...basicServices.value, newService];
  basicServices.value = updatedBasicServices;
}

function removeService(index: number) {
    const updatedBasicServices = basicServices.value.filter((_, i) => i !== index);
    basicServices.value = updatedBasicServices;
}
</script>

<style scoped>
.tour-cost {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}


.view-mode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-icon-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.edit-icon-button:hover {
  opacity: 0.7;
}

.view-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.view-service-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6B7280;
  font-size: 0.875rem;
}

.service-name {
  color: #6B7280;
}

.service-price {
  color: #111827;
  font-weight: 500;
}

.edit-mode {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.help-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.help-button svg {
  fill: #353535;
  width: 19.5px;
  height: 19.5px;
}

.cost-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cost-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: end;
}

.cost-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cost-field-price {
  min-width: 200px;
}

.cost-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: #9CA3AF;
}

.cost-input {
  font-size: 0.875rem;
  color: #111827;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.cost-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.add-service-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  background: none;
  border: none;
  color: #10B981;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  align-self: flex-start;
}

.add-service-button:hover {
  opacity: 0.8;
}

.add-service-button svg {
  width: 16px;
  height: 16px;
  fill: #10B981;
}

.delete-service-button {
  background: none;
  border: none;
  padding: 0.625rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EF4444;
  transition: all 0.2s;
  border-radius: 6px;
  margin-bottom: 0;
}

.delete-service-button:hover {
  background-color: #FEE2E2;
  color: #DC2626;
}
</style>
