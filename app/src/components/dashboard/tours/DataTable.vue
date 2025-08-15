<script setup lang="ts">
import { MoreHorizontal, Trash2, SquarePen, Pencil } from 'lucide-vue-next'
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
        <TableHead class="w-[50px]"> Номер тура </TableHead>
        <TableHead>Название тура</TableHead>
        <TableHead>Тип тура</TableHead>
        <TableHead>Категория тура</TableHead>
        <TableHead>Логистика тура</TableHead>
        <TableHead>Кол-во ночей/дней</TableHead>
        <TableHead>Кол-во паломников</TableHead>
        <TableHead>Действия</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="item in collection"
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
          ??
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
</template>
