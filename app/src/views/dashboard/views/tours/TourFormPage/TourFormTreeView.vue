<template>
  <div class="tree-view-container">
    <div class="tree-header">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Структура данных тура</h3>
      <div class="flex gap-2 mb-4">
        <button 
          @click="expandAll"
          class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Развернуть все
        </button>
        <button 
          @click="collapseAll"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Свернуть все
        </button>
      </div>
    </div>
    
    <div class="tree-content bg-white border border-gray-200 rounded-lg p-4">
      <TreeNode 
        v-if="currentItem"
        :node="currentItem"
        :nodeKey="'tour'"
        :level="0"
        :expanded="expandedNodes"
        @toggle="toggleNode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Tour } from '@/types/tour';
import TreeNode from './TreeNode.vue';

const props = defineProps<{
  currentItem: Tour | null;
}>();

const expandedNodes = ref<Set<string>>(new Set());

const toggleNode = (nodePath: string) => {
  if (expandedNodes.value.has(nodePath)) {
    expandedNodes.value.delete(nodePath);
  } else {
    expandedNodes.value.add(nodePath);
  }
};

const expandAll = () => {
  if (props.currentItem) {
    const allPaths = getAllNodePaths(props.currentItem, 'tour');
    expandedNodes.value = new Set(allPaths);
  }
};

const collapseAll = () => {
  expandedNodes.value.clear();
};

const getAllNodePaths = (obj: any, path = ''): string[] => {
  const paths: string[] = [];
  
  if (path === 'tour') {
    paths.push('tour');
  }
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach((item: any, index: number) => {
        const arrayPath = `${path}.${index}`;
        if (typeof item === 'object' && item !== null) {
          paths.push(arrayPath);
          paths.push(...getAllNodePaths(item, arrayPath));
        }
      });
    } else {
      Object.keys(obj).forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null) {
          paths.push(currentPath);
          paths.push(...getAllNodePaths(value, currentPath));
        }
      });
    }
  }
  
  return paths;
};

onMounted(() => {
    watch(() => props.currentItem, (newItem) => {
      if (newItem) {
        const allPaths = getAllNodePaths(newItem, 'tour');
        expandedNodes.value = new Set(allPaths);
      }
    }, { immediate: true });
});
</script>

<style scoped>
.tree-view-container {
  max-width: 100%;
  overflow-x: auto;
}

.tree-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
