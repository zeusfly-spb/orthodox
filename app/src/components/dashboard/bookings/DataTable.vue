<script setup lang="ts">
import { MoreHorizontal, Trash2, SquarePen } from 'lucide-vue-next';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TableSkeleton from '@/components/app/TableSkeleton.vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { BookingStatuses } from '@/types/statuses/statuses';

const props = defineProps<{
  isLoading: boolean;
  collection?: any[] | undefined;
}>();
const translateStatus = (status: BookingStatuses): string => {
  const statusMap: Record<BookingStatuses, string> = {
    pending: 'Ожидание',
    confirmed: 'Подтверждено',
    cancelled: 'Отменено',
    completed: 'Завершено'
  };
  
  return statusMap[status] || status;
};
</script>

<template>
  <div v-if="isLoading">
    <TableSkeleton />
  </div>
  <Table v-else>
    <TableHeader class="bg-muted/50">
      <TableRow>
        <TableHead class="w-[50px]"> ID </TableHead>
        <TableHead>Тур</TableHead>
        <TableHead>Фамилия</TableHead>
        <TableHead>Имя</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead>Дата</TableHead>
        <TableHead class="w-[50px] text-right px-4">
          <MoreHorizontal class="h-4 w-4" />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in collection" :key="item.id" class="hover:bg-green-50/50">
        <TableCell>{{ item.id }}</TableCell>
        <TableCell class="font-medium">
          {{ item?.tour.title }}
        </TableCell>
        <TableCell>{{ item?.customers[0].firstname }}</TableCell>
        <TableCell>{{ item?.customers[0].lastname }}</TableCell>
        <TableCell>{{ translateStatus(item.status) }}</TableCell>
        <TableCell>
          {{ item.created_at }}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="h-8 w-8 p-0">
                <MoreHorizontal class="h-4 w-4" />
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
      </TableRow>
    </TableBody>
  </Table>
</template>
