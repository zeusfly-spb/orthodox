<template>
  <div class="tour-program">
    <div class="section-header">
      <h2 class="section-title">Программа тура</h2>
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

    <div class="program-content">
      <div class="days-tabs mb-6">
        <button
          v-for="(day, index) in (tour.days || [])"
          :key="index"
          @click="selectedDay = index"
          :class="[
            'day-tab',
            selectedDay === index ? 'day-tab-active' : 'day-tab-inactive'
          ]"
        >
          {{ index + 1 }} день
        </button>
        <button
          v-if="editMode && canAddDay"
          @click="addNewDay"
          class="day-tab day-tab-add"
        >
          + Добавить день
        </button>
      </div>

      <div class="day-activities mb-8">
        <div class="activities-list">
          <div v-if="currentDay" class="activity-item">
            <div v-if="editMode" class="edit-form">
              <div class="form-header">
                <h3 class="form-title">Редактирование дня {{ selectedDay + 1 }}</h3>
                <button
                  v-if="canDeleteDay"
                  @click="deleteCurrentDay"
                  class="delete-day-btn"
                  type="button"
                >
                  <Trash2 class="w-4 h-4" />
                  Удалить день
                </button>
              </div>
              <div class="form-group">
                <label class="form-label">Название дня:</label>
                <input
                  v-model="currentDayTitle"
                  class="form-input"
                  placeholder="Введите название дня"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Описание программы:</label>
                <textarea 
                  v-model="currentDayDescription" 
                  class="form-textarea"
                  placeholder="Введите описание программы дня"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Фотографии:</label>
                <TourPhotoUpload
                  :photos="currentDayPhotos"
                  :edit-mode="editMode"
                  @update:photos="updateCurrentDayPhotos"
                  @upload="handlePhotoUpload"
                  @delete="handlePhotoDelete"
                />
              </div>
            </div>
            <div v-else>
              <h3 class="day-title">{{ currentDay.title }}</h3>
              <div class="day-description" v-html="currentDay.description || 'Описание не указано'"></div>
              <TourPhotoUpload
                v-if="currentDayPhotos.length > 0"
                :photos="currentDayPhotos"
                :edit-mode="false"
                @update:photos="updateCurrentDayPhotos"
                @upload="handlePhotoUpload"
                @delete="handlePhotoDelete"
              />
            </div>
          </div>
          <div v-else class="activity-item">
            Нет данных для выбранного дня
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';
import type { Tour, DayItem } from '@/types/tour';
import { computed, ref, nextTick, watch } from 'vue';
import TourPhotoUpload from '@/components/dashboard/tours/TourPhotoUpload.vue';
import { tourApi } from '@/api/tours';

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

const selectedDay = ref(0);

const currentDay = computed<DayItem | undefined>(() => {
  if (!tour.value.days || !Array.isArray(tour.value.days) || selectedDay.value >= tour.value.days.length) {
    return undefined;
  }
  return tour.value.days[selectedDay.value];
});

const currentDayTitle = computed({
  get() {
    return currentDay.value?.title || '';
  },
  set(value: string) {
    if (!currentDay.value) return;

    const days = [...tour.value.days];
    days[selectedDay.value] = {
      ...days[selectedDay.value],
      title: value
    };

    const updatedTour = {
      ...tour.value,
      days: days
    };

    emit('update:currentItem', updatedTour);
  }
});

const currentDayDescription = computed({
  get() {
    return currentDay.value?.description || '';
  },
  set(value: string) {
    if (!currentDay.value) return;

    const days = [...tour.value.days];
    days[selectedDay.value] = {
      ...days[selectedDay.value],
      description: value
    };

    const updatedTour = {
      ...tour.value,
      days: days
    };

    emit('update:currentItem', updatedTour);
  }
});

const canAddDay = computed(() => {
  const currentDaysCount = tour.value.days?.length || 0;
  const maxDays = tour.value.duration || 0;
  return currentDaysCount < maxDays;
});

const canDeleteDay = computed(() => {
  const currentDaysCount = tour.value.days?.length || 0;
  return currentDaysCount > 1;
});

const addNewDay = () => {
  if (!canAddDay.value) return;

  const newDay: DayItem = {
    title: `День ${(tour.value.days?.length || 0) + 1}`,
    description: ''
  };

  const days = [...(tour.value.days || []), newDay];
  const updatedTour = {
    ...tour.value,
    days: days
  };

  emit('update:currentItem', updatedTour);

  selectedDay.value = days.length - 1;

  nextTick(() => {
    const titleInput = document.querySelector('.form-input') as HTMLInputElement;
    if (titleInput) {
      titleInput.focus();
      titleInput.select();
    }
  });
};

const deleteCurrentDay = () => {
  if (!canDeleteDay.value || !currentDay.value) return;

  const days = [...(tour.value.days || [])];
  days.splice(selectedDay.value, 1);

  const updatedTour = {
    ...tour.value,
    days: days
  };

  emit('update:currentItem', updatedTour);

  if (selectedDay.value >= days.length) {
    selectedDay.value = Math.max(0, days.length - 1);
  }
};

const currentDayPhotos = computed(() => {
  return currentDay.value?.images || [];
});

const updateCurrentDayPhotos = (images: any[]) => {
  if (!currentDay.value) return;

  const days = [...tour.value.days];
  days[selectedDay.value] = {
    ...days[selectedDay.value],
    images: images
  };

  const updatedTour = {
    ...tour.value,
    days: days
  };

  emit('update:currentItem', updatedTour);
};

const handlePhotoUpload = async (files: FileList) => {
  if (!tour.value.id) {
    console.error('Tour ID is required for upload');
    return;
  }

  const fileArray: File[] = [];
  for (let i = 0; i < files.length; i++) {
    fileArray.push(files[i]);
  }

  const previewImages = fileArray.map((file, index) => ({
    id: `preview_${Date.now()}_${index}`,
    path: URL.createObjectURL(file),
    original_name: file.name,
    filename: file.name,
    mime_type: file.type,
    isPreview: true // Mark as preview
  }));


  const currentPhotos = currentDayPhotos.value;
  const photosWithPreviews = [...currentPhotos, ...previewImages];
  updateCurrentDayPhotos(photosWithPreviews);

  try {
    const uploadedImagesResponse = await tourApi.photos.upload(
      tour.value.id,
      currentDay.value.id,
      fileArray
    );

    const imagesArray = Array.isArray(uploadedImagesResponse.data.data) ? uploadedImagesResponse.data.data : [];

    setTimeout(() => {
      const currentPhotosAfterUpload = currentDayPhotos.value;
      const existingPhotos = currentPhotosAfterUpload.filter(photo => !photo.isPreview);
      const updatedPhotos = [...existingPhotos, ...imagesArray];
      updateCurrentDayPhotos(updatedPhotos);
    }, 500);

  } catch (error) {
    console.error('Failed to upload images:', error);
    const currentPhotosOnError = currentDayPhotos.value;
    const photosWithoutFailedPreviews = currentPhotosOnError.filter(photo => !photo.isPreview);
    updateCurrentDayPhotos(photosWithoutFailedPreviews);
  }
};

const handlePhotoDelete = async (imageId: number | string) => {
  if (!tour.value.id || !currentDay.value?.id) {
    console.error('Tour ID and Day ID are required for delete');
    return;
  }

  try {
    await tourApi.photos.delete(
      tour.value.id,
      currentDay.value.id,
      imageId
    );
    const currentPhotos = currentDayPhotos.value;
    const updatedPhotos = currentPhotos.filter(photo => photo.id !== imageId);
    updateCurrentDayPhotos(updatedPhotos);

  } catch (error) {
    console.error('Failed to delete image:', error);
  }
};
</script>

<style scoped>
.tour-program {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.program-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.touchable {
  cursor: pointer;
  user-select: none;
}

.days-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.day-tab {
  padding: 0.75rem 1.5rem;
  border-radius: 1.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid;
  outline: none;
}

.day-tab-active {
  background-color: #374151;
  color: white;
  border-color: #374151;
}

.day-tab-inactive {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}

.day-tab-inactive:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.day-tab-add {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
  font-weight: 600;
}

.day-tab-add:hover {
  background-color: #059669;
  border-color: #059669;
}

.day-tab-add:active {
  background-color: #047857;
  border-color: #047857;
}

.day-activities {
  margin-bottom: 2rem;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
  border: none;
  background: none;
}

.day-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.day-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #6b7280;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.delete-day-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.delete-day-btn:hover {
  background-color: #dc2626;
}

.delete-day-btn:active {
  background-color: #b91c1c;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  transition: border-color 0.2s ease-in-out;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.program-gallery {
  margin-top: 2rem;
}

.gallery-images {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.gallery-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-more {
  width: 80px;
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .days-tabs {
    flex-wrap: wrap;
  }

  .day-tab {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .delete-day-btn {
    align-self: flex-start;
  }

  .gallery-images {
    flex-wrap: wrap;
  }

  .gallery-image,
  .gallery-more {
    width: 60px;
    height: 60px;
  }
}
</style>
