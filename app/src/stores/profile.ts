import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import About from '@/views/dashboard/views/operator/About.vue';
import Requisite from '@/views/dashboard/views/operator/Requisite.vue';
import FAQ from '@/views/dashboard/views/operator/FAQ.vue';
import Files from '@/views/dashboard/views/operator/Files.vue';

export const useProfileStore = defineStore('profile', () => {
  const error = ref<string | null>(null);
  const operator = reactive<object>({});
  const tabList = [
    {
      title: 'Данные о паломнической службе',
      component: About,
    },
    {
      title: 'Реквизиты',
      component: Requisite,
    },
    {
      title: 'Файлы',
      component: Files,
    },
    {
      title: 'FAQ',
      component: FAQ,
    },
  ];

  return {
    tabList,
    operator,
    error,
  };
});
