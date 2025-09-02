<script setup>
import { ref, watch, computed } from 'vue';
import { useBookingStore } from '@/stores/booking'

const bookingStore = useBookingStore()

const payType = ref('full')
const inputValue = ref('');

// Получаем данные из стора
const bookingData = computed(() => bookingStore.booking)
const totalPrice = computed(() => bookingData.value.mainInfo.tourPrice * bookingData.value.counts.people)

const displayValue = computed({
    get: () => {
        if (payType.value === 'full') {
            return formatCurrency(totalPrice.value);
        } else {
            return inputValue.value;
        }
    },
    set: (value) => {
        if (payType.value === 'partial') {
            inputValue.value = value;
        }
    }
});

function formatCurrency(value) {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

function handleInput(event) {
    if (payType.value === 'partial') {
        let value = event.target.value.replace(/[^\d]/g, '');
        inputValue.value = value;
    }
}

function formatValue() {
    if (payType.value === 'partial' && inputValue.value) {
        const numericValue = parseInt(inputValue.value) || 0;
        inputValue.value = formatCurrency(numericValue);
    }
}

watch(() => payType.value, (newValue) => {
    if (newValue === 'full') {
        inputValue.value = formatCurrency(totalPrice.value);
    } else if (newValue === 'partial') {
        if (!inputValue.value) {
            inputValue.value = '';
        }
    }
});

watch(totalPrice, (newPrice) => {
    if (payType.value === 'full') {
        inputValue.value = formatCurrency(newPrice);
    }
});
</script>

<template>
    <div class="section">
        <div class="filters">
            <h2 class="section-title">Детали заказа</h2>
            <div class="order-item">
                <div class="header-sec-right-col">
                    <div><img :src="'/img/mini-sob.png'"></div>
                    <div>
                        <div class="order-title3">{{ bookingData.title }}</div>
                        <div class="order-meta">{{ bookingData.mainInfo.date }} {{ bookingData.mainInfo.time }} МСК / {{ bookingData.counts.nights }}</div>
                        <div class="order-price-3">от {{ bookingData.mainInfo.tourPrice }} ₽</div>
                    </div>
                </div>
                
                <div v-for="(item, index) in bookingData.counts.people" :key="index">
                    <div class="tourist-item2">
                        <div class="tourist-name2">Турист {{ index + 1 }}</div>
                        <div class="tourist-price2">{{ bookingData.mainInfo.tourPrice }} ₽</div>
                    </div>
                </div>

                <div class="total-price2">
                    <div>Общая стоимость:</div>
                    <div class="tot-pr">{{ totalPrice }} ₽</div>
                </div>

                <hr>

                <div class="payment-options2">
                    <label class="payment-option">
                        <input 
                            type="radio" 
                            name="paymentType"
                            value="full"
                            v-model="payType"
                        >
                        <span class="custom-radio"></span>
                        <span>Полная оплата</span>
                    </label>
                    <label class="payment-option">
                        <input 
                            type="radio" 
                            name="paymentType"
                            value="partial"
                            v-model="payType"
                        >
                        <span class="custom-radio"></span>
                        <span>Частичная оплата</span>
                    </label>
                </div>

                <div class="partial-payment-section">
                    <label class="info-label">Сумма частичной оплаты</label>
                    <input 
                        type="text" 
                        class="amount-input" 
                        v-model="displayValue"
                        :disabled="payType === 'full'"
                        @input="handleInput"
                        @blur="formatValue"
                    >

                    <label class="info-label">Дата полной оплаты</label>
                    <!-- Добавьте date picker здесь -->
                </div>
            </div>

            <div class="action-buttons3">
                <button class="btn btn-outline t-center">В архив</button>
                <button class="btn btn-primary t-center">Сохранить</button>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.main-content {
    margin-left: 250px;
    flex: 1;
    transition: all 0.3s;
    min-width: 0;
}

.content {
    padding: 30px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.btn {
    padding: 8px 15px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.btn-primary {
    background-color: rgba(16, 185, 129, 1);
    color: #fff;
    border-radius: 12px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    
    &:hover {
        background-color: #0f9166;
    }
}

.btn-outline {
    background: #fff;
    border: 1px solid rgba(16, 185, 129, 1);
    color: rgba(16, 185, 129, 1);
    border-radius: 12px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
}

.filters {
    background: #fff;
    padding: 20px;
    border-radius: 24px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1000px;
}

td, th {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
}

td {
    font-weight: 400;
    font-size: 14px;
    color: rgba(53, 53, 53, 1);
}

th {
    font-weight: 500;
    color: rgba(106, 110, 117, 1);
    text-transform: uppercase;
    font-size: 11px;
}

tr:hover {
    background-color: rgba(76, 175, 80, 0.05);
}

.edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #4caf50;
        
        svg path {
            fill: #4caf50;
        }
    }
    
    svg {
        width: 18px;
        height: 18px;
    }
}

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

.input-field {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
}

.title-bread-com {
    font-weight: 400;
    color: rgba(106, 110, 117, 1);
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 20px;
}

.order-meta {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 12px;
}

.order-price-3 {
    font-weight: 500;
    color: #353535;
    font-size: 12px;
}

.payment-option {
    display: flex;
    align-items: center;
    gap: 8px;
}

.checkbox {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    position: relative;
    vertical-align: middle;
    margin-right: 8px;
}

input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    
    &:checked + .checkbox {
        background-color: rgba(16, 185, 129, 1);
        border-color: rgba(16, 185, 129, 1);
        
        &::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 2px;
            width: 4px;
            height: 8px;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
    }
}

.date-input-wrapper {
    position: relative;
    width: 100%;
}

.calendar-icon {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 20px;
}

.grid-tours-fd {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
}

.order-item {
    margin-bottom: 20px;
}

.order-title3 {
    font-weight: 500;
    margin-bottom: 8px;
    color: #353535;
    font-size: 14px;
}

.tourist-item2 {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
}

.tourist-name2 {
    font-weight: 400;
    color: rgba(106, 110, 117, 1);
}

.tourist-price2 {
    color: rgba(53, 53, 53, 1);
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
}

.tot-pr {
    font-size: 20px;
}

.total-price2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    background: rgba(249, 249, 250, 1);
    padding: 16px;
}

.payment-options2 {
    display: block;
    margin-top: 16px;
}

.payment-options2 .payment-option {
    margin-bottom: 15px;
}

.header-sec-right-col {
    display: flex;
    align-items: top;
    gap: 20px;
}

.partial-payment-section {
    margin-top: 16px;
}

.action-buttons3 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 30px;
}

.t-center {
    text-align: center;
    display: block;
}

hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 16px 0;
}

.amount-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    background-color: #f8fafc;
    margin-bottom: 12px;
}

.table-wrapper2 {
    width: 100%;
    overflow-x: auto;
    margin-bottom: 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th {
    text-align: left;
    padding: 12px 16px;
    background: #f9fafb;
    font-weight: 500;
    color: #6a6e75;
    font-size: 12px;
    text-transform: uppercase;
}

.users-table td {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
}

.user-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.actions-container {
    position: relative;
}

.date-rekz {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(53, 53, 53, 1);
}

.stacked-avatars2 {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 32px;
}

.avatar3 {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    position: relative;
    margin-left: -10px;
    background-color: rgba(214, 224, 255, 1);
}

.avatar3:first-child {
    margin-left: 0;
    background-color: rgba(220, 242, 234, 1);
}

.avatar3:nth-child(2) {
    background-color: rgba(255, 239, 210, 1);
}

.plus-count {
    margin-left: 5px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(53, 53, 53, 1);
}

.avtor-dog-tab {
    font-weight: 400;
    font-size: 12px;
    margin-top: 10px;
    line-height: 100%;
    color: rgba(106, 110, 117, 1);
}

.name-dog {
    display: flex;
    align-items: center;
    gap: 20px;
}

.name-dogov-tab {
    font-weight: 500;
}

.more-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    
    &:hover svg path {
        fill: #4caf50;
    }
}

@media (max-width: 768px) {
    .grid-tours-fd {
        grid-template-columns: 1fr;
    }
    
    .table-wrapper2 {
        border-radius: 0;
    }
    
    .users-table td,
    .users-table th {
        padding: 10px 12px;
        font-size: 13px;
    }
    
    .action-buttons3 {
        grid-template-columns: 1fr;
        gap: 16px;
    }
}

@media (max-width: 1600px) {
    .table-wrapper2 {
        overflow-x: auto;
    }
}

.table-wrapper2::-webkit-scrollbar {
    height: 6px;
}

.table-wrapper2::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
.payment-option input[type="radio"] {
    position: absolute;
    opacity: 0;
}

/* Стили для кастомных radio кнопок (квадратиков) */
.custom-radio {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 4px; /* Квадратные с небольшим скруглением */
    position: relative;
    vertical-align: middle;
    margin-right: 8px;
    background: white;
}

/* Стиль для выбранной radio кнопки */
.payment-option input[type="radio"]:checked + .custom-radio {
    background-color: rgba(16, 185, 129, 1);
    border-color: rgba(16, 185, 129, 1);
}

/* Галочка внутри квадратика */
.payment-option input[type="radio"]:checked + .custom-radio::after {
    content: "";
    position: absolute;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Убираем старые стили чекбоксов */
.checkbox {
    display: none;
}
</style>