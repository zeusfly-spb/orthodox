<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  variant?: 'info' | 'warning' | 'success' | 'error'
}>()


</script>

<template>
      <UBanner>
          <template #title>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</template>
          <template #description
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus temporibus sit,
            impedit adipisci perferendis incidunt accusantium neque, fuga, molestiae harum quae
            maiores expedita beatae sapiente voluptatibus? Aut distinctio atque facilis!</template
          >
        </UBanner>
</template>
