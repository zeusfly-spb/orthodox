<script setup lang="ts">
import { MoreHorizontal, Trash2, SquarePen, Pencil, ArrowDownUp } from 'lucide-vue-next'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TableSkeleton from '@/components/app/TableSkeleton.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Badge from "@/components/app/Badge.vue";
import {computed, ref} from "vue";

const props = defineProps<{
  isLoading: boolean
  collection?: any[] | undefined
}>();

const priceSortDirection = ref('none');

const tours = computed(() => {
  let result = JSON.parse(JSON.stringify(props.collection));
  if (priceSortDirection.value === 'asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (priceSortDirection.value === 'desc') {
    result.sort((a, b) => b.price - a.price);
  }
  return result;
});

const priceSortingTitle = computed(() => {
  let result;
  switch (priceSortDirection.value) {
    case 'none':
      result = 'Сортировать по возрастанию цены';
      break;
    case 'asc':
      result = 'Сортировать по убыванию цены';
      break;
    case 'desc':
      result = 'Отменить сортировку по цене';
      break;
  }
  return result;
});

const changePriceSorting = () => {
  switch (priceSortDirection.value) {
    case 'none':
      priceSortDirection.value = 'asc';
      break;
    case 'asc':
      priceSortDirection.value = 'desc';
      break;
    case 'desc':
      priceSortDirection.value = 'none';
      break;
  }
};
</script>

<template>
  <div v-if="isLoading">
    <TableSkeleton />
  </div>
  <Table v-else>
    <TableHeader class="bg-muted/50">
      <TableRow>
        <TableHead class="w-[50px]"> Номер тура </TableHead>
        <TableHead>Название тура</TableHead>
        <TableHead>Тип тура</TableHead>
        <TableHead>Категория тура</TableHead>
        <TableHead>Логистика тура</TableHead>
        <TableHead>Кол-во ночей/дней</TableHead>
        <TableHead>Кол-во паломников</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead>
          <div
            class="flex flex-row"
          >
            Цена
            <div
              :title="priceSortingTitle"
            >
              <ArrowDownUp
                size="16"
                class="mt-1 ml-1 touchable"
                :class="{'text-gray-400': priceSortDirection === 'none'}"
                @click="changePriceSorting"
              />
            </div>
          </div>
        </TableHead>
        <TableHead>Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="item in tours"
        :key="item.id"
        class="hover:bg-green-50/50"
      >
        <TableCell>
          {{ item.id }}
        </TableCell>
        <TableCell class="font-medium">
          {{ item.title }}
        </TableCell>
        <TableCell>
          {{ item?.tourType?.title }}
        </TableCell>
        <TableCell>
          {{ item?.tourCategory?.title }}
        </TableCell>
        <TableCell>
          {{ item?.tourTransport?.title }}
        </TableCell>
        <TableCell>
          {{ item.night_count || 0 }} / {{ item.night_count || 0 }}
        </TableCell>
        <TableCell>
          {{ item.customers_count }}
        </TableCell>
        <TableCell>
          <Badge
            v-if="item.tourStatus"
            :caption="item.tourStatus?.title"
            :type="item.tourStatus?.slug"
          />
        </TableCell>
        <TableCell>
          {{ item.price }}
        </TableCell>
        <TableCell>
          <TableCell>
            <DropdownMenu title="Редактировать">
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="h-8 w-8 p-0  touchable">
                  <Pencil /> <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuItem @click="() => $emit('edit', item.id)">
                  <div class="flex items-center justify-between gap-4 w-full">
                    <span>Редактировать</span>
                    <SquarePen class="ml-2 h-4 w-4" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem @click="() => $emit('delete', item.id)">
                  <div class="flex items-center justify-between w-full">
                    <span>Удалить</span>
                    <Trash2 class="ml-2 h-4 w-4" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <span
    v-if="!collection?.length && !isLoading"
    class="flex justify-center text-gray-500 mt-2"
  >
    По заданным параметрам туров не найдено
  </span>
</template>
