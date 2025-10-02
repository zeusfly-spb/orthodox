<script setup lang="ts">
import { watch, reactive, nextTick, ref } from 'vue';
import { Calendar as CalendarIcon, Trash2, Search, Check } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox';
import AppDatePicker from '@/components/app/AppDatePicker.vue';
import { toast } from 'vue-sonner';
import { cn } from '@/lib/utils';

import type { Customer } from '@/types/customer.ts';
import type { Tour } from '@/types/tour.ts';
import { tourApi } from '@/api/tours';

const searchQuery = ref('');
const tours = ref<Tour[]>([]);
const isLoadingTours = ref(false);

interface BookingForm {
  id?: number;
  status: string;
  description: string | null;
  customers: Customer[];
  tour_id: number | null;
  tour?: Tour | null;
}

const props = withDefaults(
  defineProps<{
    open: boolean;
    item?: BookingForm | null;
    createTitle?: string;
    editTitle?: string;
    description?: string;
    submitText?: string;
    cancelText?: string;
  }>(),
  {
    createTitle: 'Создать бронирование',
    editTitle: 'Редактировать бронирование',
    description: '',
    submitText: 'Сохранить',
    cancelText: 'Отмена',
    item: null,
  },
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', item: BookingForm): void;
  (e: 'dismiss'): void;
}>();

const customerTemplate: Customer = {
  firstname: '',
  lastname: '',
  patronymic: null,
  email: '',
  phone: '',
  passport_series: null,
  passport_number: null,
  passport_issue_date: null,
  passport_unit_name: null,
  passport_unit_code: null,
  passport_birth_date: null,
  passport_birth_place: null,
  passport_address: null,
  gender: null,
  snils: null,
};

const form = reactive<BookingForm>({
  id: undefined,
  status: 'pending',
  description: null,
  customers: [{ ...customerTemplate }],
  tour_id: null,
  tour: null,
});

// Исправленная функция debounce
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

const debouncedSearchTours = debounce(async (query: string) => {
  if (query.length < 2) {
    tours.value = [];
    return;
  }

  try {
    isLoadingTours.value = true;
    const response = await tourApi.fetchData({ 'filter[title]': query });
    tours.value = response.data;
  } catch (error) {
    toast.error('Ошибка поиска');
    console.error(error);
  } finally {
    isLoadingTours.value = false;
  }
}, 300);

const handleInput = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  searchQuery.value = query;
  debouncedSearchTours(query);
};

const selectTour = (tour: Tour) => {
  form.tour = tour;
  form.tour_id = tour.id;
  searchQuery.value = tour.title;
  tours.value = [];
};

const clearTour = () => {
  form.tour = null;
  form.tour_id = null;
  searchQuery.value = '';
  tours.value = [];
};

const addCustomer = () => {
  form.customers.push({ ...customerTemplate });
};

const removeCustomer = (index: number) => {
  if (form.customers.length > 1) {
    form.customers.splice(index, 1);
  } else {
    toast.error('Должен быть хотя бы один клиент');
  }
};

const resetForm = () => {
  form.id = undefined;
  form.status = 'pending';
  form.description = null;
  form.customers = [{ ...customerTemplate }];
  form.tour = null;
  form.tour_id = null;
  searchQuery.value = '';
  tours.value = [];
};

watch(
  () => props.item,
  (item) => {
    if (item) {
      form.id = item.id;
      form.status = item.status;
      form.description = item.description;
      form.customers = item.customers.map((customer) => ({
        ...customerTemplate,
        ...customer,
      }));
      form.tour = item.tour ? { ...item.tour } : null;
      form.tour_id = item.tour?.id || null;
      if (item.tour) {
        searchQuery.value = item.tour.title;
      }
    } else {
      resetForm();
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      nextTick(() => {
        resetForm();
        emit('dismiss');
      });
    }
  },
);

const validateForm = (): boolean => {
  if (!form.tour_id || !form.tour) {
    toast.error('Тур не выбран');
    return false;
  }

  for (const [index, customer] of form.customers.entries()) {
    if (!customer.firstname?.trim() || !customer.lastname?.trim() || 
        !customer.email?.trim() || !customer.phone?.trim()) {
      toast.error(`Заполните обязательные поля для клиента ${index + 1}`);
      return false;
    }

    if (!customer.passport_series?.trim() || !customer.passport_number?.trim()) {
      toast.error(`Заполните паспортные данные для клиента ${index + 1}`);
      return false;
    }
  }

  return true;
};

const onSubmit = () => {
  if (!validateForm()) return;

  const formData: BookingForm = {
    id: form.id,
    status: form.status,
    description: form.description,
    customers: form.customers.map(customer => ({ ...customer })),
    tour_id: form.tour_id,
  };

  emit('submit', formData);
  emit('update:open', false);
};
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)" :auto-focus="false">
    <DialogContent class="max-w-[95vw] lg:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col" @openAutoFocus.prevent>
      <DialogHeader class="flex-shrink-0">
        <DialogTitle>
          {{ item?.id ? props.editTitle : props.createTitle }}
        </DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="flex flex-col flex-1 min-h-0">
        <div class="flex-1 overflow-y-auto py-4 space-y-6">
          <!-- Tour and Status Selection -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div class="space-y-2">
              <Label required>Тур</Label>
              <div v-if="!item?.id" class="space-y-2">
                <Combobox v-model="searchQuery">
                  <ComboboxAnchor class="w-full">
                    <div class="relative w-full items-center">
                      <ComboboxInput
                        class="pl-9 w-full"
                        placeholder="Поиск тура..."
                        :model-value="searchQuery"
                        @input="handleInput"
                      />
                      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                        <Search class="size-4 text-muted-foreground" />
                      </span>
                      <Button
                        v-if="searchQuery"
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="absolute end-0 inset-y-0 px-3"
                        @click="clearTour"
                      >
                        <Trash2 class="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </ComboboxAnchor>

                  <ComboboxList
                    v-if="tours.length > 0 || isLoadingTours"
                    class="w-full max-w-full lg:max-w-md max-h-60 overflow-y-auto overscroll-contain relative scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-md hover:scrollbar-thumb-gray-500"
                  >
                    <ComboboxEmpty v-if="isLoadingTours">
                      <div class="w-full px-6 py-4 text-center">Загрузка...</div>
                    </ComboboxEmpty>
                    <ComboboxEmpty v-else-if="tours.length === 0 && searchQuery.length >= 2">
                      <div class="w-full px-6 py-4 text-center">Туры не найдены</div>
                    </ComboboxEmpty>

                    <ComboboxItem
                      v-for="tour in tours"
                      :key="tour.id"
                      :value="tour.title"
                      @click="selectTour(tour)"
                      class="cursor-pointer px-4 py-3"
                    >
                      <div class="flex flex-col">
                        <span class="font-medium truncate">{{ tour.title }}</span>
                        <span class="text-sm text-muted-foreground truncate">
                          {{ tour.route }} • {{ tour.price }} ₽ • {{ tour.duration }} дн.
                        </span>
                      </div>

                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4 flex-shrink-0')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxList>
                </Combobox>
              </div>
              <div v-else class="py-2">
                <div class="font-medium text-foreground truncate">
                  {{ form.tour?.title || 'Тур не выбран' }}
                </div>
                <p v-if="form.tour" class="text-sm text-muted-foreground truncate">
                  {{ form.tour.route }} • {{ form.tour.price }} ₽ • {{ form.tour.duration }} дн.
                </p>
              </div>
            </div>
            
            <div class="space-y-2">
              <Label>Статус</Label>
              <Select v-model="form.status">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Примечание</Label>
            <Input id="description" v-model="form.description" placeholder="Введите примечание..." />
          </div>

          <!-- Customers Section -->
          <div class="border-t pt-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h3 class="text-lg font-medium">Клиенты</h3>
              <Button type="button" variant="outline" @click="addCustomer" class="w-full sm:w-auto">
                Добавить клиента
              </Button>
            </div>

            <Accordion type="multiple" class="w-full space-y-3">
              <AccordionItem
                v-for="(customer, index) in form.customers"
                :key="index"
                :value="`item-${index}`"
                class="border rounded-lg px-3 lg:px-4 data-[state=open]:bg-muted/10"
              >
                <div class="flex justify-between items-center gap-2">
                  <AccordionTrigger class="hover:no-underline py-3 lg:py-4 flex-1 min-w-0">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                      <div class="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {{ index + 1 }}
                      </div>
                      <div class="text-left min-w-0 flex-1">
                        <h4 class="font-medium truncate">
                          <template v-if="customer.lastname || customer.firstname">
                            {{ customer.lastname }} {{ customer.firstname }}
                            {{ customer.patronymic }}
                          </template>
                          <template v-else>
                            Новый клиент
                          </template>
                        </h4>
                        <p class="text-sm text-muted-foreground truncate">
                          {{ customer.phone || 'Телефон не указан' }}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    class="text-destructive hover:text-destructive flex-shrink-0"
                    @click.stop="removeCustomer(index)"
                    :disabled="form.customers.length <= 1"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>

                <AccordionContent class="pb-6 pt-2 space-y-4">
                  <!-- Основные данные -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="space-y-2">
                      <Label :for="`lastname-${index}`" required>Фамилия</Label>
                      <Input 
                        :id="`lastname-${index}`" 
                        v-model="customer.lastname" 
                        placeholder="Введите фамилию"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label :for="`firstname-${index}`" required>Имя</Label>
                      <Input 
                        :id="`firstname-${index}`" 
                        v-model="customer.firstname" 
                        placeholder="Введите имя"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label :for="`patronymic-${index}`">Отчество</Label>
                      <Input 
                        :id="`patronymic-${index}`" 
                        v-model="customer.patronymic" 
                        placeholder="Введите отчество"
                      />
                    </div>
                  </div>

                  <!-- Контактные данные -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label :for="`email-${index}`" required>Email</Label>
                      <Input 
                        :id="`email-${index}`" 
                        v-model="customer.email" 
                        type="email" 
                        placeholder="email@example.com"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label :for="`phone-${index}`" required>Телефон</Label>
                      <Input
                        :id="`phone-${index}`"
                        v-model="customer.phone"
                        placeholder="+7 (XXX) XXX-XX-XX"
                      />
                    </div>
                  </div>

                  <!-- Паспортные данные -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label :for="`passport_series-${index}`" required>Серия паспорта</Label>
                      <Input 
                        :id="`passport_series-${index}`" 
                        v-model="customer.passport_series" 
                        placeholder="0000"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label :for="`passport_number-${index}`" required>Номер паспорта</Label>
                      <Input 
                        :id="`passport_number-${index}`" 
                        v-model="customer.passport_number" 
                        placeholder="000000"
                      />
                    </div>
                  </div>

                  <!-- Даты -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label :for="`passport_issue_date-${index}`">Дата выдачи</Label>
                      <div class="flex gap-2">
                        <Popover>
                          <PopoverTrigger as-child>
                            <Button
                              variant="outline"
                              class="w-full justify-start text-left font-normal flex-1"
                            >
                              <CalendarIcon class="mr-2 h-4 w-4 flex-shrink-0" />
                              <span class="truncate">{{ customer.passport_issue_date || 'Выберите дату' }}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <AppDatePicker v-model="customer.passport_issue_date" />
                          </PopoverContent>
                        </Popover>
                        <Button
                          v-if="customer.passport_issue_date"
                          type="button"
                          variant="ghost"
                          size="sm"
                          @click="customer.passport_issue_date = null"
                          class="flex-shrink-0"
                        >
                          <Trash2 class="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <Label :for="`passport_birth_date-${index}`">Дата рождения</Label>
                      <div class="flex gap-2">
                        <Popover>
                          <PopoverTrigger as-child>
                            <Button
                              variant="outline"
                              class="w-full justify-start text-left font-normal flex-1"
                            >
                              <CalendarIcon class="mr-2 h-4 w-4 flex-shrink-0" />
                              <span class="truncate">{{ customer.passport_birth_date || 'Выберите дату' }}</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <AppDatePicker v-model="customer.passport_birth_date" />
                          </PopoverContent>
                        </Popover>
                        <Button
                          v-if="customer.passport_birth_date"
                          type="button"
                          variant="ghost"
                          size="sm"
                          @click="customer.passport_birth_date = null"
                          class="flex-shrink-0"
                        >
                          <Trash2 class="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <!-- Дополнительные поля -->
                  <div class="space-y-2">
                    <Label :for="`passport_unit_name-${index}`">Кем выдан</Label>
                    <Input
                      :id="`passport_unit_name-${index}`"
                      v-model="customer.passport_unit_name"
                      placeholder="Введите кем выдан паспорт"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" type="button" @click="() => emit('update:open', false)" class="w-full sm:w-auto">
            {{ props.cancelText }}
          </Button>
          <Button type="submit" class="w-full sm:w-auto">
            {{ props.submitText }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
[required]::after {
  content: ' *';
  color: hsl(0, 84.2%, 60.2%);
}

:deep(.accordion-trigger) {
  min-width: 0;
}

:deep(.combobox-list) {
  z-index: 50;
}
</style>