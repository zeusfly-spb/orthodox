<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const props = withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {
    title: 'Вы уверены?',
    description: 'Это действие нельзя отменить',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
  },
);

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'dismiss'): void;
}>();

const onConfirm = () => {
  emit('update:show', false);
  emit('confirm');
};

const onCancel = () => {
  emit('update:show', false);
  emit('dismiss');
};
</script>

<template>
  <AlertDialog :open="show" @update:open="(val) => $emit('update:show', val)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">
          {{ cancelText }}
        </AlertDialogCancel>
        <AlertDialogAction @click="onConfirm">
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
