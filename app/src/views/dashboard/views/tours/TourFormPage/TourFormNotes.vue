<template>
  <div class="w-full p-6 bg-white rounded-xl">
    <div class="section-header">
      <h2 class="section-title">Важно знать</h2>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode 
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
        title="Редактировать важную информацию"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="description-content">
      <div v-if="!editMode">
        <div v-if="notes && notes.length > 0" class="space-y-2">
          <div
            v-for="(note, index) in notes"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors" @click="toggleNote(index)">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">
                  {{ note.title }}
                </h3>
                <div class="text-gray-400">
                  <svg 
                    class="w-4 h-4 transform transition-transform"
                    :class="{ 'rotate-180': expandedNotes.includes(index) }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div 
                v-if="expandedNotes.includes(index)"
                class="mt-3 text-sm text-gray-700 leading-relaxed"
              >
                {{ note.content }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 italic">
          Информация не добавлена
        </div>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Важная информация для туристов
          </label>
          
          <div class="space-y-3">
            <div
              v-for="(note, index) in notes"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Заголовок
                  </label>
                  <input
                    v-model="note.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Введите заголовок заметки"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">
                    Содержание
                  </label>
                  <textarea
                    v-model="note.content"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-vertical"
                    placeholder="Введите содержание заметки"
                  ></textarea>
                </div>
                <button
                  @click="removeNote(index)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Удалить заметку
                </button>
              </div>
            </div>
            
            <button
              @click="addNote"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              + Добавить заметку
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Pencil } from 'lucide-vue-next';
import type { Tour, TourNote } from '@/types/tour';

const props = defineProps<{
  currentItem: Tour | null;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour | null): void;
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

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const notes = computed({
  get() {
    return tour.value?.notes || [];
  },
  set(value: TourNote[]) {
    if (tour.value) {
      tour.value = { ...tour.value, notes: value };
    }
  },
});

const localNotes = ref<TourNote[]>([]);
const expandedNotes = ref<number[]>([]);

watch(() => tour.value?.notes, (newNotes) => {
  if (Array.isArray(newNotes)) {
    localNotes.value = [...newNotes];
    expandedNotes.value = newNotes.map((_, index) => index);
  } else {
    localNotes.value = [];
    expandedNotes.value = [];
  }
}, { immediate: true });

const handleEdit = () => {
  editMode.value = !editMode.value;
};

const toggleNote = (index: number) => {
  const expandedIndex = expandedNotes.value.indexOf(index);
  if (expandedIndex > -1) {
    expandedNotes.value.splice(expandedIndex, 1);
  } else {
    expandedNotes.value.push(index);
  }
};

const addNote = () => {
  const newIndex = notes.value.length;
  const newNotes = [...notes.value, {
    title: '',
    content: ''
  }];
  notes.value = newNotes;
  expandedNotes.value.push(newIndex);
};

const removeNote = (index: number) => {
  const newNotes = notes.value.filter((_, i) => i !== index);
  notes.value = newNotes;
  expandedNotes.value = expandedNotes.value
    .filter(expandedIndex => expandedIndex !== index)
    .map(expandedIndex => expandedIndex > index ? expandedIndex - 1 : expandedIndex);
};
</script>

<style scoped>
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

.touchable {
  cursor: pointer;
  user-select: none;
}

.description-content {
  min-height: 100px;
}

.prose {
  line-height: 1.6;
}

.prose strong {
  font-weight: 600;
  color: #111827;
}

.prose em {
  font-style: italic;
  color: #374151;
}
</style>
