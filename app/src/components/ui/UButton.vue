<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  text: String,
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['big', 'medium', 'small'].includes(value),
  },
  action: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'disabled', 'warning'].includes(value),
  },
  svgPath: {
    type: String,
    default: '',
  },
});
</script>
<template>
  <button :class="[`btn ${props.variant}-${props.action} ${props.size}`, { spbn: props.svgPath }]">
    <img v-if="props.svgPath" :src="props.svgPath" alt="icon" />
    {{ props.text }}
  </button>
</template>
<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
}
.primary {
  &-normal {
    border: none;
    background-color: #10b981;
    color: #ffffff;

    &:hover {
      background-color: #13a575;
      transition: 0.3s;
    }
    &:focus {
      background-color: #149168;
    }
  }
  &-disabled {
    background-color: #ebedef;
    color: #8f95b2;
  }
  &-warning {
    background-color: red;
    color: #ebedef;
  }
}

.secondary {
  &-normal {
    background-color: #fff;
    color: #10b981;
    border: 1px solid #10b981;

    &:hover {
      color: #13a575;
      border-color: #13a575;
      transition: 0.3s;
    }
    &:focus {
      color: #149168;
      border-color: #149168;
    }
  }
  &-disabled {
    border: 1px solid #d4d6d9;
    color: #9fa6af;
  }
  &-warning {
    background-color: white;
    border: 1px solid #d14343;
    color: #d14343;
  }
}

.small {
  padding: 6px 20px;
  height: 36px;
  border-radius: 10px;
}
.medium {
  padding: 12px 28px;
  height: 48px;
  border-radius: 12px;
}
.big {
  padding: 16px 32px;
  height: 56px;
  border-radius: 12px;
}
.spbn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
