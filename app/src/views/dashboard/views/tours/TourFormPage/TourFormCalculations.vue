<template>
  <TooltipProvider>
    <div class="tour-calculations">
      <div class="section-header">
        <div class="section-title-wrapper">
          <h2 class="section-title">
          Расчеты
          </h2>
          <Tooltip>
            <TooltipTrigger as-child>
              <button class="help-button" type="button" @click.stop>
               <IconQuestionMark />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Информация о расчетах стоимости тура</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <button
          type="button"
          :class="[
            'p-2 rounded-lg transition-colors touchable',
            editMode
              ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200'
          ]"
          @click="handleEdit"
        >
          <Pencil class="w-4 h-4" />
        </button>
      </div>

    <div v-if="editMode" class="calculations-inputs">
      <div class="calc-input-item">
        <label class="calc-label">ЛИМИТ (маx мест к продаже, без персонала)</label>
        <div class="number-input-container">
          <input
            v-model.number="calculations.limit"
            type="number"
            class="number-input"
            min="1"
          />
          <div class="number-controls">
            <button type="button" class="number-btn" @click="decrementLimit">
              <IconMinus />
            </button>
            <button type="button" class="number-btn" @click="incrementLimit">
              <IconPlus />
            </button>
          </div>
        </div>
      </div>

      <div class="calc-input-item">
        <label class="calc-label">Количество дней</label>
        <div class="number-input-container">
          <input
            v-model.number="calculations.daysCount"
            type="number"
            class="number-input"
            min="1"
          />
          <div class="number-controls">
            <button type="button" class="number-btn" @click="decrementdaysCount">
              <IconMinus />
            </button>
            <button type="button" class="number-btn" @click="incrementdaysCount">
              <IconPlus />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="calculations-display">
      <div class="calc-display-item">
        <span class="calc-display-label">ЛИМИТ (маx мест к продаже, без персонала)</span>
        <span class="calc-display-value">{{ calculations.limit }}</span>
      </div>
      <div class="calc-display-item">
        <span class="calc-display-label">Количество дней</span>
        <span class="calc-display-value">{{ calculations.daysCount }}</span>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="expenses-table">
        <thead>
          <tr class="table-header">
            <th>
              <div class="th-content">
                ДОБАВИТЬ ТИП ЗАТРАТ
              </div>
            </th>
            <th>
              <div class="th-content">
                НАИМЕНОВАНИЕ УСЛУГИ (ИЗ СПРАВОЧНИКА)
              </div>
            </th>
            <th>
              <div class="th-content">
                ДЕТАЛИЗАЦИЯ УСЛУГИ
              </div>
            </th>
            <th>
              <div class="th-content">
                ПОРЯДКОВЫЙ НОМЕР ДНЯ ТУРА ИЛИ ДАТА (ДН)
              </div>
            </th>
            <th>
              <div class="th-content">
                КОЛ-ВО УСЛУГ(МЕСТ/ ШТ И ТД (ЧЕЛ)
              </div>
            </th>
            <th>
              <div class="th-content">
                КОЛ-ВО плательщикОВ (ЧЕЛ)
              </div>
            </th>
            <th>
              <div class="th-content">
                СУММА УСЛУГ (РУБ)
              </div>
            </th>
            <th>
              <div class="th-content">
                НА ОДНОГО
              </div>
            </th>
            <th v-if="editMode">
              <div class="th-content">
                УДАЛИТЬ
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in calculations.expenses" :key="expense.id || index">
            <td>
              <input
                v-model="expense.expenseType"
                type="text"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.expenseType }}</span>
            </td>
            <td>
              <input
                v-model="expense.serviceName"
                type="text"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.serviceName }}</span>
            </td>
            <td>
              <input
                v-model="expense.serviceDetails"
                type="text"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.serviceDetails }}</span>
            </td>
            <td>
              <input
                v-model="expense.tourDays"
                type="text"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.tourDays }}</span>
            </td>
            <td>
              <input
                v-model.number="expense.quantity"
                type="number"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.quantity }}</span>
            </td>
            <td>
              <input
                :value="expense.payers"
                @input="updateExpenseField(index, 'payers', Number($event.target.value))"
                type="number"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.payers }}</span>
            </td>
            <td>
              <input
                :value="expense.totalAmount"
                @input="updateExpenseField(index, 'totalAmount', Number($event.target.value))"
                type="number"
                class="table-input"
                :disabled="!editMode"
                v-if="editMode"
              />
              <span v-else>{{ expense.totalAmount }}</span>
            </td>
            <td>
              <span>{{ formatCurrency(calculatePerPersonAmount(expense)) }}</span>
            </td>
            <td v-if="editMode">
              <button
                type="button"
                class="delete-btn"
                @click="deleteExpenseRow(index)"
                title="Удалить строку"
              >
                <Trash2 class="w-4 h-4 text-red-500 hover:text-red-700" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editMode" class="add-expense-buttons">
      <button type="button" class="add-expense-btn" @click="addExpenseRow('')">
        + Новый тип затрат
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Билеты в музей')">
        + БИЛЕТЫ В МУЗЕЙ
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Гид')">
        + ГИД
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Сопровождающий гид')">
        + СОПРОВОЖДАЮЩИЙ ГИД
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Питание')">
        + ПИТАНИЕ
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Экскурсия')">
        + ЭКСКУРСИЯ
      </button>
      <button type="button" class="add-expense-btn" @click="addExpenseRow('Прочие затраты')">
        + ПРОЧИЕ ЗАТРАТЫ
      </button>
    </div>

    <div class="summary-section">
      <div class="summary-grid">
        <template v-for="(item, index) in summaryItems" :key="index">
          <div
            v-if="item.label"
            class="summary-item"
            :class="{ 'summary-highlight': item.highlight, 'summary-indent': item.indent }"
          >
            <div class="summary-label-container">
              <span class="summary-label">{{ item.label }}</span>
              <div v-if="item.editable && editMode" class="markup-toggle">
                <button
                  type="button"
                  class="markup-toggle-btn"
                  :class="{ active: markupMode === 'percent' }"
                  @click="markupMode = 'percent'"
                >
                  проценты %
                </button>
                <button
                  type="button"
                  class="markup-toggle-btn"
                  :class="{ active: markupMode === 'rubles' }"
                  @click="markupMode = 'rubles'"
                >
                  рубли
                </button>
              </div>
            </div>
            <div v-if="item.editable && editMode" class="markup-input-container">
              <input
                v-if="markupMode === 'percent'"
                v-model.number="markupPercent"
                type="number"
                class="summary-input"
                placeholder="%"
              />
              <input
                v-else
                v-model.number="markupInRoubles"
                type="number"
                class="summary-input"
                placeholder="₽"
              />
            </div>
            <span v-else class="summary-value">
              {{ item.value }}{{ item.currency ? ' ₽' : '' }}
            </span>
          </div>
          <div v-else class="summary-item"></div>
        </template>
      </div>

      <div class="total-cost">
        <span class="total-label">Общая стоимость:</span>
        <span class="total-value">{{ formatCurrency(totalCost) }} ₽</span>
      </div>
    </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Pencil, Trash2 } from 'lucide-vue-next';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { Tour, TourCalculations, CalculationExpense } from '@/types/tour';
import IconPlus from '@/components/icons/IconPlus.vue';
import IconMinus from '@/components/icons/IconMinus.vue';
import IconQuestionMark from '@/components/icons/IconQuestionMark.vue';

const props = defineProps<{
  currentItem: Tour;
  editMode: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:currentItem', value: Tour): void;
  (e: 'update:editMode', value: boolean): void;
}>();

const tour = computed({
  get() {
    return props.currentItem;
  },
  set(value: Tour) {
    emit('update:currentItem', value);
  },
});

const calculations = computed({
  get(): TourCalculations {
    return tour.value.calculations || getDefaultCalculations();
  },
  set(value: TourCalculations) {
    tour.value = { ...tour.value, calculations: value };
  },
});

function getDefaultCalculations(): TourCalculations {
  return {
      limit: 1,
        daysCount: 1,
        expenses: [],
        costPerPayer: 0,
        markup: 0,
        vatRate: 0,
        vatType: '',
        markupAmount: 0,
        markupInRub: 0,
        totalWithMarkup: 0,
        vatAmount: 0,
        totalWithVat: 0,
        pricePerPayer: 0,
        totalCost: 0,
  };
}

function incrementLimit() {
  calculations.value = { ...calculations.value, limit: calculations.value.limit + 1 };
}

function decrementLimit() {
  if (calculations.value.limit > 1) {
    calculations.value = { ...calculations.value, limit: calculations.value.limit - 1 };
  }
}
function incrementdaysCount() {
  calculations.value = { ...calculations.value, daysCount: calculations.value.daysCount + 1 };
}

function decrementdaysCount() {
  if (calculations.value.daysCount > 1) {
    calculations.value = { ...calculations.value, daysCount: calculations.value.daysCount - 1 };
  }
}


function addExpenseRow(type: string) {
  const newExpense: CalculationExpense = {
    expenseType: type,
    serviceName: '',
    serviceDetails: '',
    tourDays: '',
    quantity: 0,
    payers: 0,
    totalAmount: 0,
    perPersonAmount: 0,
  };

  calculations.value = {
    ...calculations.value,
    expenses: [...calculations.value.expenses, newExpense],
  };
}


function formatCurrency(value: number): string {
  if (!isFinite(value) || isNaN(value)) {
    return '0,00';
  }
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const editMode = computed({
  get() {
    return props.editMode;
  },
  set(value) {
    emit('update:editMode', value);
  },
});
const markupMode = ref('percent');
const markupRublesInput = ref(0);

function calculatePerPersonAmount(expense: CalculationExpense): number {
  if (!expense.payers || expense.payers === 0) {
    return 0;
  }
  return expense.totalAmount / expense.payers;
}

//Себестоимость на 1 плательщика
const costPerPayer = computed(() => {
  return calculations.value.expenses.reduce(
    (sum, expense) => sum + calculatePerPersonAmount(expense),
    0
  );
});

//Наценка в процентах
const markupPercent = computed({
  get: () => calculations.value.markup || 0,
  set: (value: number) => {
    calculations.value = { ...calculations.value, markup: value };
    markupRublesInput.value = (costPerPayer.value * value) / 100;
  }
});

//Наценка в рублях (редактируемое поле)
const markupInRoubles = computed({
  get: () => {
    if (markupMode.value === 'rubles') {
      return markupRublesInput.value;
    }
    return (costPerPayer.value * markupPercent.value) / 100;
  },
  set: (value: number) => {
    markupRublesInput.value = value;
    if (costPerPayer.value > 0) {
      const newMarkupPercent = (value * 100) / costPerPayer.value;
      calculations.value = { ...calculations.value, markup: newMarkupPercent };
    }
  }
});


watch(markupMode, (newMode) => {
  if (newMode === 'rubles') {
    markupRublesInput.value = (costPerPayer.value * markupPercent.value) / 100;
  }
});


//Итого с наценкой
const totalWithMarkup = computed(() => {
  return costPerPayer.value * (markupPercent.value / 100) + costPerPayer.value;
});

//Размер наценки
const markupAmount = computed(() => {
  return totalWithMarkup.value - costPerPayer.value;
});

//Наценка в рублях
const markupInRub = computed(() => {
  return markupAmount.value;
});

//НДС в том числе
const vatInPrice = computed(() => {
  const vatRate = calculations.value.vatRate || 0;
  if (vatRate === 0) return 0;
  return (totalWithMarkup.value * vatRate) / (100 + vatRate);
});

//НДС начислить сверху
const vatOnTop = computed(() => {
  const vatRate = calculations.value.vatRate || 0;
  return totalWithMarkup.value * ((100 + vatRate) / 100)
});

//Итого с НДС
const totalWithVat = computed(() => {
  const vatRate = calculations.value.vatRate || 0;
  return totalWithMarkup.value * ((100 + vatRate) / 100)
});

//Итого цена на 1 плательщика
const pricePerPayer = computed(() => {
  const vatRate = calculations.value.vatRate || 0;
  return totalWithMarkup.value * ((100 + vatRate) / 100)
});

//Итого стоимость
const totalCost = computed(() => {
  return calculations.value.expenses.reduce(
    (sum, expense) => sum + (expense.totalAmount || 0),
    0
  );
});

const summaryItems = computed(() => [
  { label: 'Себестоимость на 1 плательщика:', value: formatCurrency(costPerPayer.value), currency: true },
  { label: 'Вид начисления НДС:', value: calculations.value.vatType || '-', currency: false },
  { label: 'Наценка:', value: markupMode.value === 'percent' ? (markupPercent.value || 0) + '%' : formatCurrency(markupInRoubles.value) + ' ₽', currency: false, editable: true },
  { label: 'НДС в том числе:', value: formatCurrency(vatInPrice.value), currency: true, indent: true },
  { label: 'Размер наценки:', value: formatCurrency(markupAmount.value), currency: true },
  { label: 'НДС начислить сверху:', value: formatCurrency(vatOnTop.value), currency: true, indent: true },
  { label: 'Наценка в руб:', value: formatCurrency(markupInRub.value), currency: true },
  { label: 'Итого с НДС:', value: formatCurrency(totalWithVat.value), currency: true },
  { label: 'Итого с наценкой:', value: formatCurrency(totalWithMarkup.value), currency: true },
  { label: 'Итого цена на 1 плательщика:', value: formatCurrency(pricePerPayer.value), currency: true, highlight: true },
  { label: 'НДС (выбрать ставку),%:', value: calculations.value.vatRate || 20, currency: false },
  { label: null },
]);

function updateExpenseField(index: number, field: keyof CalculationExpense, value: any) {
  const updatedExpenses = [...calculations.value.expenses];
  updatedExpenses[index] = { ...updatedExpenses[index], [field]: value };
  calculations.value = {
    ...calculations.value,
    expenses: updatedExpenses
  };
}

const handleEdit = () => {
  editMode.value = !editMode.value;
};

function deleteExpenseRow(index: number) {
  const updatedExpenses = calculations.value.expenses.filter((_, i) => i !== index);
  calculations.value = {
    ...calculations.value,
    expenses: updatedExpenses
  };
}


</script>

<style scoped>

.section-title-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

.tour-calculations{
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 1.5rem 0;
  margin-top: 1.5rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.1rem;
}

.help-button {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}


.help-button svg {
  fill: #353535;
  width: 19.5px;
  height: 19.5px;
}

.calculations-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.calculations-display {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.calc-display-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.calc-display-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: #6A6E75;
}

.calc-label {
  font-size: 0.75rem;
  font-weight: 400;
  color: #6A6E75;
}

.calc-display-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.calc-input-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}



.number-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.number-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.number-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.number-input:disabled {
  background-color: #f9fafb;
}

.number-controls {
  position: absolute;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem
}

.number-btn {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  fill: #6A6E75;
}

.number-btn:hover {
  fill: #111827;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border-radius: 12px;
  border: 1px solid #F1F1F4;
}

.expenses-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.table-header {
  background-color: #F9F9FA;
}

.expenses-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.625rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.expenses-table tbody tr {
  border-bottom: 1px solid #f1f1f4;
  &:last-child{
    border: none;
  }
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  &:after{
    content: '⋮⋮';
    margin-left: 0.5rem;
    color: #6A6E75;
    font-size: 0.875rem;
    align-self: flex-start;
  }
}

.expenses-table td {
  padding: 0.75rem 1rem;

  vertical-align: middle;
  font-size: 0.875rem;
}

.table-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  color: #181818;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.table-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.table-input:disabled {
  background-color: #f9fafb;
  border-color: #f3f4f6;
}

.table-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.delete-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 0.7;
}

.add-expense-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.add-expense-btn {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  background-color: transparent;
  border: 1px dashed #d4d6d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.add-expense-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #111827;
}

.summary-section {
  background-color: #f9f9fa;
  padding: 1.5rem;
  border-radius: 24px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.75rem;
  column-gap: 3rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-indent {
  margin-left: 1rem;
}

.summary-label {
  font-size: 1rem;
  font-weight: 400;
  color: #6a6e75;
}

.summary-value {
  font-size: 1rem;
  font-weight: 400;
  color: #353535;
}

.summary-input {
  width: 120px;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.summary-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.summary-highlight {
  font-weight: 600;
  color: #1e293b;
}

.summary-highlight .summary-label,
.summary-highlight .summary-value {
  font-weight: 600;
  color: #1e293b;
}

.summary-label-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.markup-input-container {
  display: flex;
  justify-content: flex-end;
}

.markup-toggle {
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.markup-toggle-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: #6b7280;
  border-right: 1px solid #e2e8f0;
}

.markup-toggle-btn:last-child {
  border-right: none;
}

.markup-toggle-btn:hover {
  background-color: #f9fafb;
  color: #111827;
}

.markup-toggle-btn.active {
  background-color: #10b981;
  color: #ffffff;
}

.markup-toggle-btn.active:hover {
  background-color: #059669;
}

.total-cost {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-top: 1.5rem;
  background-color: #F1F1F4;
  border-radius: 12px;
}

.total-label {
  font-size: 1rem;
  font-weight: 500;
  color: #353535;
}

.total-value {
  font-size: 1.25rem;
  font-weight: 500;
  color: #353535;
}

@media (max-width: 768px) {
  .calculations-inputs {
    grid-template-columns: 1fr;
  }

  .calculations-display {
    grid-template-columns: 1fr;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}

input[type='number'] {
    -moz-appearance:textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
</style>
