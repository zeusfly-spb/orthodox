<script setup lang="ts">
import { MoreHorizontal, Trash2, SquarePen } from 'lucide-vue-next'
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

const props = defineProps<{
  isLoading: boolean
  collection?: any[] | undefined
}>()
</script>

<template>
  <div v-if="isLoading">
    <TableSkeleton />
  </div>
  <Table v-else>
    <TableHeader class="bg-muted/50">
      <TableRow>
        <TableHead class="w-[50px]"> ID </TableHead>
        <TableHead>Название</TableHead>
        <TableHead>Маршрут</TableHead>
        <TableHead>Дней</TableHead>
        <TableHead>Статус</TableHead>
        <TableHead>Цена</TableHead>
        <TableHead class="w-[50px] text-right px-4 pl-6">
          <MoreHorizontal class="h-4 w-4" />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in collection" :key="item.id" class="hover:bg-green-50/50">
        <TableCell>{{ item.id }}</TableCell>
        <TableCell class="font-medium">
          {{ item.title }}
        </TableCell>
        <TableCell>{{ item.route }}</TableCell>
        <TableCell>{{ item.duration }}</TableCell>
        <TableCell>{{ item.is_active }}</TableCell>
        <TableCell>
          {{ item.price }}
        </TableCell>
        <TableCell>
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
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
