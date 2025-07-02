<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок формы -->
    <!--    <div class="space-y-2">-->
    <!--      <Skeleton class="h-8 w-[200px]" />-->
    <!--      <Skeleton class="h-5 w-[300px]" />-->
    <!--    </div>-->

    <!-- Основные поля (3 колонки) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Фамилия -->
      <div class="space-y-2">
        <Skeleton class="h-5 w-[80px]" />
        <Skeleton class="h-10 w-full" />
      </div>

      <!-- Имя -->
      <div class="space-y-2">
        <Skeleton class="h-5 w-[50px]" />
        <Skeleton class="h-10 w-full" />
      </div>

      <!-- Отчество -->
      <div class="space-y-2">
        <Skeleton class="h-5 w-[80px]" />
        <Skeleton class="h-10 w-full" />
      </div>
    </div>

    <!-- Контактные данные (2 колонки) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Email -->
      <div class="space-y-2">
        <Skeleton class="h-5 w-[50px]" />
        <Skeleton class="h-10 w-full" />
      </div>

      <!-- Телефон -->
      <div class="space-y-2">
        <Skeleton class="h-5 w-[80px]" />
        <Skeleton class="h-10 w-full" />
      </div>
    </div>

    <!-- Кнопки действий -->
    <!--    <div class="flex justify-end gap-2 pt-4">-->
    <!--      <Skeleton class="h-10 w-[100px]" />-->
    <!--      <Skeleton class="h-10 w-[120px]" />-->
    <!--    </div>-->
  </div>
</template>
