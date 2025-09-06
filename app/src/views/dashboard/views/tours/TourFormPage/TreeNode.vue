<template>
  <div class="tree-node">
    <div class="node-line flex items-center" :style="{ paddingLeft: `${level * 20}px` }">
      <button
        v-if="hasChildren"
        @click="toggle"
        class="expand-button mr-2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
      >
        <span class="text-xs">{{ isExpanded ? '▼' : '▶' }}</span>
      </button>
      <span v-else class="w-4 mr-2"></span>

      <span class="node-key font-medium text-blue-600">{{ nodeKey }}:</span>

      <span v-if="!hasChildren" class="node-value ml-2" :class="valueClass">
        {{ formattedValue }}
      </span>
    </div>

    <div v-if="hasChildren && isExpanded" class="children">
      <TreeNode
        v-for="(child, key) in children"
        :key="key"
        :node="child"
        :nodeKey="key"
        :level="level + 1"
        :expanded="expanded"
        :parentPath="nodePath"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  node: any;
  nodeKey: string | number;
  level: number;
  expanded: Set<string>;
  parentPath?: string;
}>();

const emit = defineEmits<{
  (e: 'toggle', path: string): void;
}>();

const nodePath = computed(() => {
  if (props.parentPath) {
    return `${props.parentPath}.${props.nodeKey}`;
  }
  return props.nodeKey.toString();
});

const isExpanded = computed(() => {
  return props.expanded.has(nodePath.value);
});

const hasChildren = computed(() => {
  if (Array.isArray(props.node)) {
    return props.node.length > 0;
  }
  if (typeof props.node === 'object' && props.node !== null) {
    return Object.keys(props.node).length > 0;
  }
  return false;
});

const children = computed(() => {
  if (Array.isArray(props.node)) {
    return props.node;
  }
  if (typeof props.node === 'object' && props.node !== null) {
    return props.node;
  }
  return {};
});

const formattedValue = computed(() => {
  if (props.node === null) return 'null';
  if (props.node === undefined) return 'undefined';
  if (typeof props.node === 'string') return `"${props.node}"`;
  if (typeof props.node === 'boolean') return props.node.toString();
  if (typeof props.node === 'number') return props.node.toString();
  if (Array.isArray(props.node)) return `Array(${props.node.length})`;
  if (typeof props.node === 'object') return 'Object';
  return String(props.node);
});

const valueClass = computed(() => {
  if (props.node === null) return 'text-gray-500';
  if (typeof props.node === 'string') return 'text-green-600';
  if (typeof props.node === 'number') return 'text-purple-600';
  if (typeof props.node === 'boolean') return 'text-orange-600';
  if (Array.isArray(props.node)) return 'text-blue-500';
  if (typeof props.node === 'object') return 'text-gray-600';
  return 'text-gray-700';
});

const toggle = () => {
  emit('toggle', nodePath.value);
};
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.node-line {
  min-height: 24px;
  display: flex;
  align-items: center;
  padding: 2px 0;
}

.expand-button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s;
}

.expand-button:hover {
  background-color: #f3f4f6;
}

.node-key {
  font-weight: 500;
}

.node-value {
  font-weight: 400;
}

.children {
  border-left: 1px solid #e5e7eb;
  margin-left: 10px;
}
</style>
