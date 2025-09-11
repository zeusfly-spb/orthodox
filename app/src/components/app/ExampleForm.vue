<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

//
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

// Схема валидации
const formSchema = toTypedSchema(
  z.object({
    firstname: z.string().min(2, 'Минимум 2 символа'),
    lastname: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    phone: z.string().optional(),
    patronymic: z.string().optional(),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted', values);
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Данные туриста</CardTitle>
        <CardDescription>Заполните обязательные поля</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Основные поля -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Фамилия -->
          <FormField v-slot="{ componentField }" name="lastname">
            <FormItem>
              <FormLabel>Фамилия</FormLabel>
              <FormControl>
                <Input placeholder="Иванов" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Имя -->
          <FormField v-slot="{ componentField }" name="firstname">
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Отчество -->
          <FormField v-slot="{ componentField }" name="patronymic">
            <FormItem>
              <FormLabel>Отчество</FormLabel>
              <FormControl>
                <Input placeholder="Иванович" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Контактные данные -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Email -->
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Телефон -->
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input placeholder="+7 (999) 123-45-67" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter class="flex justify-end gap-2">
        <Button variant="outline" type="button"> Отмена </Button>
        <Button type="submit"> Сохранить </Button>
      </CardFooter>
    </Card>
  </form>
</template>
