<script setup>
import { defineProps, defineEmits, reactive, ref, watch, computed, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import UInput from './UInput.vue';

const dropdownRef = ref(null);
const inputWidth = ref(0);
const maxItemWidth = ref(0);

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    modelValue: String,
    withSearch: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const dropdown = reactive({
    isShowList: false,
    selectedItem: props.modelValue || '',
    searchValue: ''
});

const filteredList = computed(() => {
  return Object.entries(props.list).filter(([key, value]) => 
    String(value).toLowerCase().includes(dropdown.searchValue.toLowerCase())
  );
});

const listWidth = computed(() => {
  return Math.max(inputWidth.value, maxItemWidth.value + 30) + 'px';
});

onMounted(() => {
  inputWidth.value = dropdownRef.value?.offsetWidth || 0;
  const items = dropdownRef.value?.querySelectorAll('.dropdown__item');
  if (items) {
    maxItemWidth.value = Math.max(
      ...Array.from(items).map(item => item.scrollWidth)
    );
  }
});

watch(
    () => props.modelValue, (newValue) => {
        dropdown.selectedItem = newValue;
    }
);

function selectItem(item) {
    emit('update:modelValue', props.withSearch? item[1] : item);
    dropdown.searchValue = ''
}

onClickOutside(dropdownRef, () => {
    dropdown.isShowList = false;
});
</script>

<template>
    <div class="dropdown" ref="dropdownRef" @click.stop="dropdown.isShowList = !dropdown.isShowList">
        <div class="dropdown__input">
            {{ dropdown.selectedItem }} 
            <img :class="{'inverse': dropdown.isShowList}" src="/svg/arrow-down.svg" alt="open list">
        </div>
        <ul 
            class="dropdown__list" 
            v-if="dropdown.isShowList"
            :style="{ minWidth: listWidth }"
        >
            <UInput 
                v-if="withSearch" 
                v-model="dropdown.searchValue" 
                svgPath="/svg/search.svg" 
                :inputHeightPx="40" 
                placeholder="Поиск" 
                @click.stop
            />
            <li 
                v-for="(item, index) in withSearch? filteredList : props.list"
                :key="index"
                class="dropdown__item"
                @click="selectItem(item)"
            >
                {{ `${withSearch? item[1] : item}` }}
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.dropdown {
  position: relative;
  z-index: 10; /* Создаем контекст наложения */

  &__input {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative; /* Для корректного z-index */

    &:hover {
      border-color: #94a3b8;
    }

    & img {
      width: 10px;
      transition: transform 0.3s ease;
    }
  }

  &__list {
    min-width: 100%;
    width: auto;
    padding: 5px;
    position: absolute;
    top: calc(100% + 5px); /* Добавляем отступ от инпута */
    left: 0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    // overflow: hidden;
    background-color: #f8fafc;
    white-space: nowrap;
    // z-index: 10; /* Высокий z-index для поверх других элементов */
    // transform-origin: top center;
    // animation: fadeIn 0.2s ease-out forwards;
    background-color: white;
    
    /* Для плавного появления */
    // opacity: 0;
    // transform: translateY(-10px);
    // transition: 
    //   opacity 0.2s ease,
    //   transform 0.2s ease;
    
    // &.show {
    //   opacity: 1;
    //   transform: translateY(0);
    // }
  }

  &__item {
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(76, 175, 80, 0.1);
      border-radius: 12px;
    }
  }
}

.inverse {
  transform: rotate(180deg);
}

/* Анимация появления */
// @keyframes fadeIn {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
</style>