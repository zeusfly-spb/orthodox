<script setup>
import { ref, watch, computed } from 'vue';
import { useBookingStore } from '@/stores/booking';

const bookingStore = useBookingStore();

const payType = ref('full');
const inputValue = ref('');
const isTouristsExpanded = ref(false); // состояние свернуто/развернуто

// Получаем данные из стора
const bookingData = computed(() => bookingStore.booking);
const totalPrice = computed(
  () => bookingData.value.mainInfo.tourPrice * bookingData.value.counts.people,
);

// Отображаемые туристы (все или только первые 3)
const displayedTourists = computed(() => {
  if (isTouristsExpanded.value) {
    return bookingData.value.counts.people;
  }
  return Math.min(bookingData.value.counts.people, 3);
});

// Показывать ли кнопку "Показать еще"
const showMoreButton = computed(() => {
  return bookingData.value.counts.people > 3;
});

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
  },
});

function formatCurrency(value) {
  if (!value && value !== 0) return '';
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
}

function handleInput(event) {
  if (payType.value === 'partial') {
    let value = event.target.value.replace(/[^\d]/g, '');
    inputValue.value = value;
    // Сохраняем числовое значение в стейт
    bookingStore.booking.payment.amount = parseInt(value) || 0;
  }
}

function formatValue() {
  if (payType.value === 'partial' && inputValue.value) {
    const numericValue = parseInt(inputValue.value) || 0;
    inputValue.value = formatCurrency(numericValue);
  }
}

function toggleTourists() {
  isTouristsExpanded.value = !isTouristsExpanded.value;
}

async function handleSaveTourist() {
  try {
    // Обновляем данные оплаты перед сохранением
    bookingStore.booking.payment.type = payType.value;
    if (payType.value === 'full') {
      bookingStore.booking.payment.amount = totalPrice.value;
    }
    
    await bookingStore.saveBooking();
    console.log('Booking saved:', bookingStore.$state);
  } catch (error) {
    console.error('Error updating tourist:', error);
  }
}

watch(
  () => payType.value,
  (newValue) => {
    // Сохраняем тип оплаты в стейт
    bookingStore.booking.payment.type = newValue;
    
    if (newValue === 'full') {
      inputValue.value = formatCurrency(totalPrice.value);
      bookingStore.booking.payment.amount = totalPrice.value;
    } else if (newValue === 'partial') {
      if (!inputValue.value) {
        inputValue.value = '';
        bookingStore.booking.payment.amount = 0;
      }
    }
  },
  { immediate: true }
);

watch(totalPrice, (newPrice) => {
  if (payType.value === 'full') {
    inputValue.value = formatCurrency(newPrice);
    bookingStore.booking.payment.amount = newPrice;
  }
});

// Инициализация при монтировании
watch(() => bookingStore.booking.payment.type, (newType) => {
  if (newType) {
    payType.value = newType;
  }
}, { immediate: true });

watch(() => bookingStore.booking.payment.amount, (newAmount) => {
  if (payType.value === 'partial' && newAmount > 0) {
    inputValue.value = formatCurrency(newAmount);
  }
}, { immediate: true });
</script>

<template>
  <div class="section">
    <div class="filters">
      <h2 class="section-title">Детали заказа</h2>
      <div class="order-item">
        <div class="header-sec-right-col">
          <div><img :src="'/img/mini-sob.png'" /></div>
          <div>
            <div class="order-title3">{{ bookingData.title }}</div>
            <div class="order-meta">
              {{ bookingData.mainInfo.date }} {{ bookingData.mainInfo.time }} МСК /
              {{ bookingData.counts.nights }}
            </div>
            <div class="order-price-3">от {{ bookingData.mainInfo.tourPrice }} ₽</div>
          </div>
        </div>

        <!-- Сворачиваемый список туристов -->
        <div class="tourists-list">
          <div v-for="(item, index) in displayedTourists" :key="index" class="tourist-item2">
            <div class="tourist-name2">Турист {{ index + 1 }}</div>
            <div class="tourist-price2">{{ bookingData.mainInfo.tourPrice }} ₽</div>
          </div>
          
          <!-- Кнопка "Показать еще/Свернуть" -->
          <div v-if="showMoreButton" class="show-more-container">
            <button class="show-more-btn" @click="toggleTourists">
              {{ isTouristsExpanded ? 'Свернуть' : `Показать еще ${bookingData.counts.people - 3}` }}
            </button>
          </div>
        </div>

        <div class="total-price2">
          <div>Общая стоимость:</div>
          <div class="tot-pr">{{ formatCurrency(totalPrice) }}</div>
        </div>

        <hr />

        <div class="payment-options2">
          <label class="payment-option">
            <input type="radio" name="paymentType" value="full" v-model="payType" />
            <span class="custom-radio"></span>
            <span>Полная оплата</span>
          </label>
          <label class="payment-option">
            <input type="radio" name="paymentType" value="partial" v-model="payType" />
            <span class="custom-radio"></span>
            <span>Частичная оплата</span>
          </label>
        </div>

        <div v-if="payType === 'partial'" class="partial-payment-section">
          <label class="info-label">Сумма частичной оплаты</label>
          <input
            type="text"
            class="amount-input"
            v-model="displayValue"
            @input="handleInput"
            @blur="formatValue"
            placeholder="Введите сумму"
          />

          <label class="info-label">Дата полной оплаты</label>
          <!-- Добавьте date picker здесь -->
        </div>
      </div>

      <div class="booking-store-view">
        <h3>Данные для отправки (тест на заполняемость)</h3>
        <pre class="json-view">{{ bookingStore.booking }}</pre>
      </div>

      <div class="action-buttons3">
        <button class="btn btn-outline t-center">В архив</button>
        <button class="btn btn-primary t-center" @click="handleSaveTourist">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.json-view {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  border-left: 4px solid #007bff;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.tourists-list {
  margin: 10px 0;
}

.show-more-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.show-more-btn {
  background: none;
  border: 1px solid #e2e8f0;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
}

/* Остальные стили остаются без изменений */
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

.info-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
  display: block;
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
  margin-bottom: 10px;
  cursor: pointer;
}

.header-sec-right-col {
  display: flex;
  align-items: top;
  gap: 20px;
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
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
}

.tourist-name2 {
  font-weight: 400;
  color: rgba(106, 110, 117, 1);
}

.tourist-price2 {
  color: rgba(53, 53, 53, 1);
  font-weight: 600;
  font-size: 14px;
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
  margin-top: 10px;
}

.payment-options2 {
  display: block;
  margin-top: 16px;
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

/* Стили для radio кнопок */
.payment-option input[type='radio'] {
  position: absolute;
  opacity: 0;
}

.custom-radio {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  vertical-align: middle;
  margin-right: 8px;
  background: white;
}

.payment-option input[type='radio']:checked + .custom-radio {
  background-color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

.payment-option input[type='radio']:checked + .custom-radio::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>