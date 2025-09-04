import { defineStore } from 'pinia'
import { markRaw, reactive, ref } from 'vue'
import About from '@/views/dashboard/views/operator/About.vue'
import Requisite from '@/views/dashboard/views/operator/Requisite.vue'
import FAQ from '@/views/dashboard/views/operator/FAQ.vue'
import Files from '@/views/dashboard/views/operator/Files.vue'

export const useProfileStore = defineStore('profile', () => {
    const error = ref<string | null>(null)
    const operator = reactive<object>({})
    const tabList = [
    {
        title: 'Данные о паломнической службе',
        component: markRaw(About)
    },
    {
        title: 'Реквизиты',
        component: markRaw(Requisite)
    },
    {
        title: 'Файлы',
        component: markRaw(Files)
    },
    {
        title: 'FAQ',
        component: markRaw(FAQ)
    }
]

    return {
        tabList,
        operator,
        error
    }
})