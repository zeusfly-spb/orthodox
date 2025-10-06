<template>
  <div class="photo-upload">
    <div class="photo-gallery">
      <div class="gallery-container">
        <div
          v-for="(photo, index) in visiblePhotos"
          :key="index"
          class="photo-item"
        >
          <div class="photo-wrapper">
            <img
              :src="photo.path"
              :alt="`Photo ${index + 1}`"
              class="photo-image"
              :class="{ 'uploading': photo.isPreview }"
            />
            <div v-if="photo.isPreview" class="upload-overlay">
              <div class="upload-spinner"></div>
            </div>
            <button
              v-if="editMode && !photo.isPreview"
              @click="removePhoto(index)"
              class="delete-photo-btn"
              type="button"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div
          v-if="!editMode && hiddenPhotosCount > 0"
          class="photo-item more-photos-indicator"
          @click="showAllPhotos"
        >
          <div class="more-photos-wrapper">
            <span class="more-photos-text">+{{ hiddenPhotosCount }}</span>
          </div>
        </div>

        <div v-if="editMode" class="upload-button-container">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileSelect"
            class="hidden-file-input"
          />
          <button
            @click="triggerFileInput"
            class="upload-button"
            type="button"
          >
            <Plus class="w-4 h-4" />
            <span class="upload-text">Медиа</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, X } from 'lucide-vue-next';

interface Props {
  photos: any[];
  editMode: boolean;
}

interface Emits {
  (e: 'update:photos', photos: any[]): void;
  (e: 'upload', files: FileList): void;
  (e: 'delete', imageId: number | string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fileInput = ref<HTMLInputElement>();
const showAll = ref(false);

const maxVisiblePhotos = 3;

const visiblePhotos = computed(() => {
  if (props.editMode || showAll.value) {
    return props.photos;
  }
  return props.photos.slice(0, maxVisiblePhotos);
});

const hiddenPhotosCount = computed(() => {
  if (props.editMode || showAll.value) {
    return 0;
  }
  return Math.max(0, props.photos.length - maxVisiblePhotos);
});

const showAllPhotos = () => {
  showAll.value = true;
};


const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    emit('upload', target.files);
    target.value = '';
  }
};

const removePhoto = (index: number) => {
  const photo = props.photos[index];
  if (photo && photo.id) {
    emit('delete', photo.id);
  }
};
</script>

<style scoped>
.photo-upload {
  margin-top: 1rem;
}

.photo-gallery {
  margin-top: 1.5rem;
}

.gallery-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.photo-item {
  position: relative;
  flex-shrink: 0;
}

.photo-wrapper {
  position: relative;
  width: 11rem;
  height: 7.6rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s ease;
}

.photo-image.uploading {
  opacity: 0.7;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.delete-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease-in-out;
}

.photo-wrapper:hover .delete-photo-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-photo-btn:hover {
  background-color: rgba(220, 38, 38, 0.9);
}

.upload-button-container {
  flex-shrink: 0;
}

.hidden-file-input {
  display: none;
}

.upload-button {
  width: 11rem;
  height: 7.6rem;
  background-color: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: #6b7280;
}

.upload-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

.upload-button:active {
  background-color: #e5e7eb;
  border-color: #6b7280;
}

.upload-text {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

.upload-button.uploading {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-top: 2px solid #6b7280;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .photo-wrapper,
  .upload-button {
    width: 60px;
    height: 60px;
  }

  .upload-text {
    font-size: 0.625rem;
  }

  .delete-photo-btn {
    width: 16px;
    height: 16px;
    top: 2px;
    right: 2px;
  }

  .delete-photo-btn .w-3 {
    width: 0.625rem;
    height: 0.625rem;
  }
}

.more-photos-indicator {
  cursor: pointer;
}

.more-photos-wrapper {
  position: relative;
  width: 11rem;
  height: 7.6rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.more-photos-wrapper:hover {
  background: rgba(0, 0, 0, 0.8);
}

.more-photos-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
