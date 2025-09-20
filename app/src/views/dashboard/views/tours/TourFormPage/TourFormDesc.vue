<template>
  <div class="tour-description">
    <div class="section-header">
      <h2 class="section-title">Описание</h2>
      <button
        :class="[
          'p-2 rounded-lg transition-colors touchable',
          editMode 
            ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        ]"
        @click="handleEdit"
        title="Редактировать описание"
      >
        <Pencil class="w-4 h-4" />
      </button>
    </div>

    <div class="description-content">
      <QuillEditor
        v-if="editMode"
        v-model:content="tourDescription"
        content-type="html"
        :options="editorOptions"
        class="html-editor"
        placeholder="Введите описание тура"
      />
      <div 
        v-else 
        class="description-html"
        v-html="tour.description || 'Описание не указано'"
      />

      <button v-if="!editMode" class="read-more-link" @click="handleReadMore">Читать подробнее</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil } from 'lucide-vue-next';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import type { Tour } from '@/types/tour';
import { computed, nextTick, watch } from 'vue';

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

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});

const tourDescription = computed({
  get() {
    return tour.value.description || '';
  },
  set(value: string) {
    tour.value = { ...tour.value, description: value };
  },
});

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ]
  },
  placeholder: 'Введите описание тура...',
};

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

const handleReadMore = () => {
  console.log('Read more about tour');
};
</script>

<style scoped>
.tour-description {
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

.edit-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  /* background-color: #f3f4f6; */
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.edit-button:hover {
  /* background-color: #e5e7eb; */
  color: #374151;
}

.description-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  text-align: justify;
}

.read-more-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
  transition: color 0.15s ease-in-out;
}

.read-more-link:hover {
  color: #2563eb;
  text-decoration: none;
}

.html-editor {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  min-height: 200px;
}

.html-editor:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.description-html {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  text-align: justify;
}

.description-html :deep(h1),
.description-html :deep(h2),
.description-html :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
}

.description-html :deep(h1) {
  font-size: 1.5rem;
}

.description-html :deep(h2) {
  font-size: 1.25rem;
}

.description-html :deep(h3) {
  font-size: 1.125rem;
}

.description-html :deep(p) {
  margin-bottom: 1rem;
}

.description-html :deep(ul),
.description-html :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.description-html :deep(li) {
  margin-bottom: 0.25rem;
}

.description-html :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.description-html :deep(a:hover) {
  color: #2563eb;
  text-decoration: none;
}

.description-html :deep(strong) {
  font-weight: 600;
}

.description-html :deep(em) {
  font-style: italic;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .tour-description {
    padding: 1rem;
  }

  .description-html {
    font-size: 0.875rem;
  }

  .html-editor {
    min-height: 150px;
  }
}
</style>
