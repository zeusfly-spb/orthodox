<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Mail, Lock, Pencil, Trash2 } from 'lucide-vue-next';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'suspended';
}

const props = defineProps<{
  isLoading: boolean;
  collection: User[];
}>();

const emit = defineEmits<{
  (e: 'edit-manager', id: string): void;
  (e: 'delete-manager', id: string): void;
}>();

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const getRoleLabel = (role: User['role']) => {
  switch (role) {
    case 'tour_admin':
      return 'Администратор';
    case 'tour_manager':
      return 'Менеджер';
    case 'user':
      return 'Менеджер';
    default:
      return 'Пользователь';
  }
};
</script>

<template>
  <div class="rounded-md">
    <Table class="border-0">
      <TableHeader class="bg-muted/50">
        <TableRow>
          <TableHead class="w-[100px]">Имя пользователя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead class="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in collection" :key="user.id" class="hover:bg-green-50/50">
          <TableCell class="font-medium">
            <div class="flex items-center gap-3">
              <Avatar class="h-12 w-12 rounded-lg">
                <AvatarImage :src="user.avatar || ''" :alt="user.name" />
                <AvatarFallback class="rounded-lg">{{ getInitials(user.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ getRoleLabel(user.roles[0].name) }}
                </div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div class="flex items-center gap-2">
              <Mail class="h-4 w-4 text-muted-foreground" />
              {{ user.email }}
            </div>
          </TableCell>
          <TableCell class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="h-8 w-8 p-0">
                  <MoreHorizontal class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuItem @click="() => $emit('edit-manager', user.id)">
                  <div class="flex items-center justify-between gap-4 w-full">
                    <span>Редактировать</span>
                    <Pencil class="ml-2 h-4 w-4" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem @click="() => $emit('delete-manager', user.id)">
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
  </div>
</template>
