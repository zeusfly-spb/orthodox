<script setup>
import { defineProps, defineEmits, reactive } from 'vue';
import UInput from '@/components/ui/UInput.vue';

const props = defineProps({
    countContacts: {
        type: Number,
        default: 1
    },
    showAddButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['add-item'])

const form = reactive({
    fullname: '',
    email: '',
    phone: '',
    comment: ''
})

function pushForm() {
    emit('add-item', { ...form })
    
    // Object.assign(form, {
    //     fullname: '',
    //     email: '',
    //     phone: '',
    //     comment: ''
    // })
}
</script>
<template>
    <div class="section filters">
        <div class="contact-person">
            <div class="contact-title">Контактное лицо {{ props.countContacts }}</div>
            <div class="info-grid">
                <div class="info-item">
                    <label class="info-label">ФИО</label>
                    <UInput 
                        inputType="text" 
                        v-model="form.fullname" 
                        :inputHeightPx="43"
                    />
                </div>
                <div class="info-item">
                    <label class="info-label">Email</label>
                    <UInput 
                        inputType="text" 
                        v-model="form.email" 
                        :inputHeightPx="43"
                    />
                </div>
                <div class="info-item">
                    <label class="info-label">Телефон</label>
                    <UInput 
                        inputType="tel" 
                        v-model="form.phone" 
                        :inputHeightPx="43"
                    />
                </div>
            </div>

            <div class="info-item">
                <label class="info-label">Комментарий</label>
                <textarea class="input-field" rows="3" v-model="form.comment"></textarea>
            </div>
        </div>
        <button v-if="showAddButton" class="add-contact-btn" @click="pushForm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="rgba(16, 185, 129, 1)" />
            </svg>
            Добавить контактное лицо
        </button>
    </div>
</template>
<style scoped lang="scss">
.section {
    margin-bottom: 30px;
}
.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #353535;
    padding-bottom: 8px;
    margin-bottom: 20px;
}
.filters {
    background: #fff;
    padding: 20px;
    border-radius: 24px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.contact-person {
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}
.contact-title {
    font-weight: 500;
    margin-bottom: 16px;
}
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
}
.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6a6e75;
    font-size: 14px;
    padding-left: 25px;
    position: relative;
    margin-bottom: 0;
}
.contact-item a {
    color: #6a6e75;
    text-decoration: none;
}
.contact-item a:hover {
    text-decoration: underline;
}
.contact-item svg {
    flex-shrink: 0;
}
.contact-item::before {
    content: "";
    position: absolute;
    top: 3px;
    left: -3px;
    margin-left: 0;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background-repeat: no-repeat;
}
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
    margin-top: 10px;
}
.info-item {
    margin-bottom: 12px;
}
.info-label {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
    display: block;
}
.info-value {
    font-size: 14px;
    color: #353535;
    font-weight: 500;
}
.input-field {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
}
.add-contact-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(16, 185, 129, 1);
    background: 0 0;
    border: none;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
}
</style>