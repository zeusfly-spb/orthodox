<script setup>
import { defineProps, defineEmits, reactive, watch, ref, onMounted } from 'vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import {useAuthStore} from '@/stores/auth'
import {fetchOperators} from '@/api/operators'

const authStore = useAuthStore()

const props = defineProps({
    clientTypeList: {
        type: Array,
        default: []
    },
})

const emit = defineEmits(['add-item'])

const form = reactive({
    clientType: '',
    clientName: '',
    comment: ''
})
const clientNameList = ref([])

function pushForm() {
    emit('add-item', { ...form })
    
    // Object.assign(form, {
    //     fullname: '',
    //     email: '',
    //     phone: '',
    //     comment: ''
    // })
}
watch(() => form.clientType, (newVal) => {
    if (isMounted.value) pushForm()
})
watch(() => form.clientName, (newVal) => {
    if (isMounted.value) pushForm()
})
watch(() => form.comment, (newVal) => {
    if (isMounted.value) pushForm()
})

onMounted(async () => {
    try {
        clientNameList.value = Object.values(await fetchOperators())
        
        // Добавляем проверку на null/undefined
        if (authStore.operators) {
            form.clientType = authStore.operators.type || ''
            form.clientName = authStore.operators.name || ''
        } else {
            // Устанавливаем значения по умолчанию
            form.clientType = ''
            form.clientName = ''
        }
    } catch (err) {
        console.error('Ошибка:', err)
        // Также устанавливаем значения по умолчанию при ошибке
        form.clientType = ''
        form.clientName = ''
    }
})
</script>
<template>
    <div class="section filters">
        <h2 class="section-title">Заказчик</h2>
        <div class="customer-info">
            <div class="info-grid grid-n">
                <div class="info-item">
                    <label class="info-label">Тип Заказчика</label>
                    <div class="filter-item">
                        <div class="custom-select">
                            <UDropdown v-model="form.clientType" :list="props.clientTypeList"/>
                        </div>
                    </div>
                </div>
                <div class="info-item">
                    <label class="info-label">Наименование Заказчика</label>
                    <div class="filter-item">
                        <div class="custom-select">
                            <UDropdown v-model="form.clientName" :list="clientNameList" :withSearch="true"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-item">
                <label class="info-label">Комментарий</label>
                <textarea class="input-field"
                    rows="3" v-model="form.comment"></textarea>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss"></style>