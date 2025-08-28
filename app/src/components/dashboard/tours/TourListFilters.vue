<template>
  <div class="flex flex-wrap items-center gap-3 mb-6">
    <input
      type="text"
      placeholder="Поиск по турам..."
      class="border rounded-xl px-3 py-2 w-64"
      v-model="queryFilters.searchString.value"
    />

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.dayCount.value"
    >
      <option value="">Длительность</option>
      <option value="1">1 день</option>
      <option value="2">2 дня</option>
    </select>

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.pilCount.value"
    >
      <option value="">Паломников</option>
      <option value="1">1 паломник</option>
      <option value="2">2 паломника</option>
    </select>

    <div class="flex border border-gray-300 rounded-[12px] overflow-hidden w-fit h-9">
      <div class="flex items-center px-3 border-r border-gray-300 bg-white">
        <input
          type="number"
          min="0"
          step="100"
          placeholder="Цена от"
          class="outline-none text-gray-500 placeholder-gray-400 bg-transparent w-20 text-sm"
          v-model="queryFilters.priceMin.value"
        />
        <span class="ml-1 text-gray-400 text-sm">₽</span>
      </div>
      <div class="flex items-center px-3 bg-white">
        <input
          type="number"
          min="0"
          step="100"
          placeholder="Цена до"
          class="outline-none text-gray-500 placeholder-gray-400 bg-transparent w-20 text-sm"
          v-model="queryFilters.priceMax.value"
        />
        <span class="ml-1 text-gray-400 text-sm">₽</span>
      </div>
    </div>

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.tourTypeId.value"
    >
      <option value="0">Тип тура</option>
      <option
        v-for="type in tourTypes"
        :key="`type-option-${type.id}`"
        :value="type.id"
      >
        {{ type.title }}
      </option>
    </select>

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.tourCategoryId.value"
    >
      <option value="0">Категория тура</option>
      <option
        v-for="category in tourCategories"
        :key="`category-option-${category.id}`"
        :value="category.id"
      >
        {{ category.title }}
      </option>
    </select>

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.tourTransportId.value"
    >
      <option value="0">Логистика тура</option>
      <option
        v-for="transport in tourTransports"
        :key="`transport-option-${transport.id}`"
        :value="transport.id"
      >
        {{ transport.title }}
      </option>
    </select>

    <select
      class="border rounded-xl px-2 py-2"
      v-model="queryFilters.tourStatusId.value"
    >
      <option value="0">Статус тура</option>
      <option
        v-for="status in tourStatuses"
        :key="`status-option-${status.id}`"
        :value="status.id"
      >
        {{ status.title }}
      </option>
    </select>
    <div
      v-if="filtered"
      title="Сбросить фильтры"
    >
      <FunnelX
        class="text-gray-500 touchable"
        @click="resetQueryParams"
      />
    </div>
  </div>

</template>

<script setup lang="ts">
import {FunnelX} from "lucide-vue-next";
import {Input} from "@/components/ui/input";
import {useToursStore} from "@/stores/tours.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

const {queryFilters} = storeToRefs(useToursStore());
const tourTypes = computed(() => useToursStore().tourTypes);
const tourCategories = computed(() => useToursStore().tourCategories);
const tourTransports = computed(() => useToursStore().tourTransports);
const tourStatuses = computed(() => useToursStore().tourStatuses);
const filtered = computed(() => useToursStore().filtered);

const {resetQueryFilters} = useToursStore();
const resetQueryParams = () => resetQueryFilters();
</script>
