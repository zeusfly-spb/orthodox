<script setup>
import { ref } from 'vue';

const tags = ref([
  { id: 1, name: 'Паломнический', active: true },
  { id: 2, name: 'Культурный', active: false },
  { id: 3, name: 'Исторический', active: false },
]);

const removeTag = (tagId) => {
  tags.value = tags.value.filter(tag => tag.id !== tagId);
};

const addTag = () => {
  const newTagName = prompt('Введите название тега:');
  if (newTagName && newTagName.trim()) {
    const newId = Math.max(...tags.value.map(t => t.id)) + 1;
    tags.value.push({
      id: newId,
      name: newTagName.trim(),
      active: false
    });
  }
};
</script>

<template>
  <div class="tags-container">
    <div class="tags-list">
      <div 
        v-for="tag in tags" 
        :key="tag.id"
        :class="['tag-item', { active: tag.active }]"
      >
        <span>{{ tag.name }}</span>
        <svg
          v-if="tag.active"
          class="tag-close"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="removeTag(tag.id)"
        >
          <path
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          />
        </svg>
      </div>
    </div>
    <button class="add-tag-btn" @click="addTag">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
      Добавить тег
    </button>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 20px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
  line-height: 1.5;
}

.tag-item.active {
  background: rgba(53, 53, 53, 1);
  color: #fff;
}

.tag-item.active svg {
  fill: #fff;
}

.tag-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag-close:hover {
  opacity: 1;
}

.tag-item:not(.active) .tag-close {
  display: none;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(241, 241, 244, 1);
  border: none;
  color: rgba(106, 110, 117, 1);
  font-size: 12px;
  border-radius: 44px;
  cursor: pointer;
  border: 1px dashed rgba(159, 166, 175, 1);
  padding: 6px 12px;
}

.add-tag-btn:hover {
  color: #3e8e41;
}

.add-tag-btn svg {
  flex-shrink: 0;
  fill: rgba(106, 110, 117, 1);
}
</style>
