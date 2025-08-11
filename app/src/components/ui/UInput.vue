<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  inputHeightPx: {
    type: Number,
    default: 26
  },
  svgPath: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="search-box">
    <img 
      class="search-box__left-image" 
      v-show="props.svgPath" 
      :src="props.svgPath" 
      alt="search icon"
    >        
    <input 
      :class="['search-box__input', svgPath ? 'withImg' : 'withoutImg']" 
      type="text" 
      :placeholder="props.placeholder" 
      :style="`height: ${props.inputHeightPx}px;`"
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
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
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        font-size: 14px;
        width: 100%;

        &:focus, &:focus-visible, &:focus-within {
            outline: none;
        }

        &.withoutImg{
            padding: 8px 12px 8px 8px;
        }

        &.withImg{
            padding: 8px 12px 8px 36px;
        }
    }
}

</style>