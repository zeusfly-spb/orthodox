<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  inputHeightPx: {
    type: Number,
    default: 26,
  },
  svgPath: {
    type: String,
    default: '',
  },
  inputType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'number', 'email', 'password', 'tel'].includes(value),
  },
  allowNegative: {
    type: Boolean,
    default: false,
    validator: (value, props) => {
      if (value === true && props.inputType !== 'number') {
        console.warn('allowNegative is only applicable for type="number"');
        return false;
      }
      return true;
    },
  },
  step: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: undefined,
  },
  max: {
    type: Number,
    default: undefined,
  },
});

const emit = defineEmits(['update:modelValue']);

// Преобразуем значение в число с учетом ограничений
function getNumericValue() {
  const num =
    typeof props.modelValue === 'string' ? parseFloat(props.modelValue) || 0 : props.modelValue;

  return num;
}

// Функция для изменения значения с валидацией
function changeValue(delta) {
  if (props.inputType !== 'number') return;

  let newValue = getNumericValue() + delta;

  // Проверяем минимальное значение
  if (props.min !== undefined && newValue < props.min) {
    newValue = props.min;
  }

  // Проверяем отрицательные значения
  if (!props.allowNegative && newValue < 0) {
    newValue = 0;
  }

  // Проверяем максимальное значение
  if (props.max !== undefined && newValue > props.max) {
    newValue = props.max;
  }

  emit('update:modelValue', newValue);
}

function increment() {
  changeValue(props.step);
}

function decrement() {
  changeValue(-props.step);
}

// Обработчик ввода с валидацией
function handleInput(event) {
  let value = event.target.value;

  if (props.inputType === 'number') {
    // Для числового поля проверяем валидность
    const numericValue = parseFloat(value);

    if (value === '' || !isNaN(numericValue)) {
      // Если пустая строка или валидное число - эмитим
      emit('update:modelValue', value === '' ? '' : numericValue);
    } else {
      // Если невалидный ввод - оставляем предыдущее значение
      event.target.value = props.modelValue;
    }
  } else {
    // Для текстовых полей эмитим как есть
    emit('update:modelValue', value);
  }
}
</script>

<template>
  <div
    :class="['search-box', { 'number-input-container': props.inputType === 'number' }]"
    :style="`height: ${props.inputHeightPx}px;`"
  >
    <img
      class="search-box__left-image"
      v-show="props.svgPath"
      :src="props.svgPath"
      alt="search icon"
    />
    <input
      :class="[
        'search-box__input',
        svgPath ? 'withImg' : 'withoutImg',
        { 'number-input': props.inputType === 'number' },
      ]"
      :type="props.inputType"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="handleInput"
      :min="props.inputType === 'number' ? (props.allowNegative ? undefined : 0) : undefined"
      :max="props.max"
      :step="props.step"
    />
    <div class="number-controls" v-if="props.inputType === 'number'">
      <button
        class="number-up"
        type="button"
        @click="increment"
        :disabled="props.max !== undefined && getNumericValue() >= props.max"
      >
        +
      </button>
      <button
        class="number-down"
        type="button"
        @click="decrement"
        :disabled="
          (!props.allowNegative && getNumericValue() <= 0) ||
          (props.min !== undefined && getNumericValue() <= props.min)
        "
      >
        -
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;

  &__left-image {
    position: absolute;
    left: 12px;
  }

  &__input {
    height: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    background-color: #f8fafc;
    transition: all 0.2s;

    &:focus,
    &:focus-visible,
    &:focus-within {
      outline: none;
      border-color: #94a3b8;
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
    }

    &.withoutImg {
      padding: 8px 12px 8px 8px;
    }

    &.withImg {
      padding: 8px 12px 8px 36px;
    }

    &.number-input {
      padding: 10px 36px 10px 14px;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
}

.number-input-container {
  position: relative;
  width: 100%;
  min-width: 80px;
}

.number-controls {
  position: absolute;
  right: 0;
  top: 1px;
  bottom: 1px;
  width: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 0 7px 7px 0;
  overflow: hidden;
}

.number-down,
.number-up {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 12px;
  font-weight: bold;

  &:hover:not(:disabled) {
    background: #cbd5e1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f1f5f9;
  }
}

.number-up {
  border-bottom: 1px solid #cbd5e1;
}
</style>
