<template>
  <div class="tour-objects">
    <div class="section-header">
      <h2 class="section-title">Объекты в туре</h2>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
        title="Редактировать объекты"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>
    <div v-if="isLoading">
      <Spinner />
    </div>
    <div v-else class="flex items-center w-full mt-4">
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Объект</th>
              <th class="text-left py-3 px-4 font-medium text-gray-700 border-b border-gray-200">Тип</th>
              <th v-if="editMode" class="text-center py-3 px-4 font-medium text-gray-700 border-b border-gray-200 w-16">Действия</th>
            </tr>
            <tr v-if="editMode">
              <td colspan="3" class="py-3 px-4 border-b border-gray-200">
                <div class="flex items-center gap-2">
                  <select
                    v-model="selectedEntityId"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    @change="addEntity"
                  >
                    <option value="">Выберите объект для добавления</option>
                    <option
                      v-for="entity in availableEntities"
                      :key="entity.id"
                      :value="entity.id"
                    >
                      {{ entity.title }} ({{ entity.entityType.title }})
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entity in entities" :key="entity.id">
              <td class="text-left py-3 px-4">{{ entity.title }}</td>
              <td class="text-left py-3 px-4">{{ entity.entityType.title }}</td>
              <td v-if="editMode" class="text-center py-3 px-4">
                <button
                  @click="removeEntity(entity.id)"
                  class="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors touchable"
                  title="Удалить объект"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
    <div v-if="entitiesError" class="text-red-500 text-sm mt-1">
      {{ entitiesError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tour } from '@/types/tour';
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { useToursStore } from '@/stores/tours';
import { Pencil, Trash2, Plus } from 'lucide-vue-next';
import Spinner from '@/components/app/Spinner.vue';

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
  set(value) {
    emit('update:currentItem', value);
  },
});

const entities = computed(() => tour.value.entities.map((item: any) => item.entity));

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const toursStore = useToursStore();
const { isLoadingEntities, entitiesError, fetchEntities } = toursStore;

const isLoading = computed(() => toursStore.isLoadingEntities);
const selectedEntityId = ref<string | number>('');

const availableEntities = computed(() => {
  const currentEntityIds = entities.value.map((entity: any) => entity.id);
  return toursStore.objects.filter((entity: any) => !currentEntityIds.includes(entity.id));
});

const focusFirstInput = async () => {
  await nextTick();

  const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;

  if (firstInput) {
    firstInput.focus();
  }
};

const handleEdit = () => {
  editMode.value = !editMode.value;

  if (editMode.value) {
    focusFirstInput();
  }
};

const removeEntity = (entityId: number) => {
  const entityToRemove = tour.value.entities.find((item: any) => item.entity.id === entityId);
  const entityTypeTitle = entityToRemove?.entity?.entityType?.title;

  const updatedEntities = tour.value.entities.filter((item: any) => item.entity.id !== entityId);

  if (entityTypeTitle && tour.value.calculations?.expenses) {
    const updatedExpenses = tour.value.calculations.expenses.filter(
      (expense: any) => expense.expenseType !== entityTypeTitle
    );

    tour.value = {
      ...tour.value,
      entities: updatedEntities,
      calculations: {
        ...tour.value.calculations,
        expenses: updatedExpenses
      }
    };
  } else {
    tour.value = { ...tour.value, entities: updatedEntities };
  }
};

const addEntity = () => {
  if (!selectedEntityId.value) return;

  const entityToAdd = availableEntities.value.find((entity: any) => entity.id === selectedEntityId.value);
  if (entityToAdd) {
    const newEntityItem = {
      entity: entityToAdd
    };

    const updatedEntities = [...tour.value.entities, newEntityItem];
    const entityTypeTitle = entityToAdd.entityType?.title;

    if (entityTypeTitle && tour.value.calculations) {
      const expenseExists = tour.value.calculations.expenses?.some(
        (expense: any) => expense.expenseType === entityTypeTitle
      );

      if (!expenseExists) {
        const newExpense = {
          expenseType: entityTypeTitle,
          serviceName: '',
          serviceDetails: '',
          tourDays: '',
          quantity: 0,
          payers: 0,
          totalAmount: 0,
          perPersonAmount: 0,
        };

        tour.value = {
          ...tour.value,
          entities: updatedEntities,
          calculations: {
            ...tour.value.calculations,
            expenses: [...(tour.value.calculations.expenses || []), newExpense]
          }
        };
      } else {
        tour.value = { ...tour.value, entities: updatedEntities };
      }
    } else {
      tour.value = { ...tour.value, entities: updatedEntities };
    }

    selectedEntityId.value = '';
  }
};

onMounted(async () => {
  try {
    await fetchEntities();
  } catch (error) {
    console.error('Ошибка при загрузке объектов:', error);
  }
});
</script>

<style scoped>
.tour-objects {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}
</style>
