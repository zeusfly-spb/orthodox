<script setup>
import { managerApi } from '@/api/managers';
import UButton from '@/components/ui/UButton.vue';
import UInput from '@/components/ui/UInput.vue';
import UDropdown from '@/components/ui/UDropdown.vue';
import { ref, onMounted, reactive } from 'vue';
import { tourApi } from '@/api/tours';
import UBanner from '@/components/ui/UBanner.vue';
import { useBookingStore } from '@/stores/booking';

const booking = useBookingStore();

const filters = reactive({
  days: 1,
  status: 'Статус заявки',
  manager: 'Менеджер',
  operator: '',
});

const statusList = ['Новая', 'В обработке', 'Подтверждена', 'Отклонена', 'Завершена'];

async function loadAllData() {
  try {
    const [toursResponse, managersResponse] = await Promise.all([
      tourApi.fetchData(),
      managerApi.fetchData(),
    ]);

    booking.managers = managersResponse.data.map((m) => m.name);

    // Загружаем полные данные по каждому туру
    const toursWithDetails = await Promise.all(
      toursResponse.data.map((tour) => tourApi.getData(tour.id).then((res) => res.data)),
    );

    // Объединяем базовую информацию с bookings
    booking.orders = toursResponse.data.map((tour, index) => ({
      ...tour,
      bookings: toursWithDetails[index].bookings || [],
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="main-content">
    <div class="content">
      <div class="white-bg">
        <div class="page-header">
          <h1 class="page-title-g">Мои заявки</h1>
          <div class="actions">
            <UButton
              text="Добавить новую заявку"
              size="medium"
              variant="primary"
              @click="$router.push({ name: 'order-create' })"
            />
          </div>
        </div>
        <UBanner>
          <template #title>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</template>
          <template #description
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus temporibus sit,
            impedit adipisci perferendis incidunt accusantium neque, fuga, molestiae harum quae
            maiores expedita beatae sapiente voluptatibus? Aut distinctio atque facilis!</template
          >
        </UBanner>
        <!-- Фильтры для заявок -->
        <div class="search-filters-container2">
          <div class="search-container">
            <div class="search-input-wrapper">
              <UInput
                svgPath="/svg/search.svg"
                placeholder="Поиск по названию тура, заказчику, номеру заявки..."
                inputHeightPx="36"
              />
            </div>
          </div>

          <div class="filters-scroll-container">
            <div class="filters-grid">
              <UDropdown :list="statusList" v-model="filters.status" />
              <UDropdown :list="booking.managers" v-model="filters.manager" />

              <!-- Фильтр по периоду создания -->
              <div class="filter-item">
                <div class="custom-select">
                  <div class="filter-trigger filter-trigger-period" id="periodTrigger">
                    <span id="periodText">Период создания тура</span>
                    <svg
                      class="calendar-icon"
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.6668 0.966797C6.0534 0.966797 6.3668 1.2802 6.3668 1.6668V4.1668C6.3668 4.5534 6.0534 4.8668 5.6668 4.8668C5.2802 4.8668 4.9668 4.5534 4.9668 4.1668V1.6668C4.9668 1.2802 5.2802 0.966797 5.6668 0.966797Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.3328 0.966797C12.7194 0.966797 13.0328 1.2802 13.0328 1.6668V4.1668C13.0328 4.5534 12.7194 4.8668 12.3328 4.8668C11.9462 4.8668 11.6328 4.5534 11.6328 4.1668V1.6668C11.6328 1.2802 11.9462 0.966797 12.3328 0.966797Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.2168 7.575C1.2168 7.1884 1.5302 6.875 1.9168 6.875H16.0835C16.4701 6.875 16.7835 7.1884 16.7835 7.575C16.7835 7.9616 16.4701 8.275 16.0835 8.275H1.9168C1.5302 8.275 1.2168 7.9616 1.2168 7.575Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.00234 4.53895C2.48558 5.09546 2.1998 5.94077 2.1998 7.08346V14.1668C2.1998 15.3095 2.48558 16.1548 3.00234 16.7113C3.51039 17.2584 4.34156 17.6335 5.66647 17.6335H12.3331C13.6581 17.6335 14.4892 17.2584 14.9973 16.7113C15.514 16.1548 15.7998 15.3095 15.7998 14.1668V7.08346C15.7998 5.94077 15.514 5.09546 14.9973 4.53895C14.4892 3.99182 13.6581 3.6168 12.3331 3.6168H5.66647C4.34156 3.6168 3.51039 3.99182 3.00234 4.53895ZM1.97643 3.58631C2.82256 2.6751 4.07472 2.2168 5.66647 2.2168H12.3331C13.9249 2.2168 15.1771 2.6751 16.0232 3.58631C16.8606 4.48813 17.1998 5.72616 17.1998 7.08346V14.1668C17.1998 15.5241 16.8606 16.7621 16.0232 17.6639C15.1771 18.5752 13.9249 19.0335 12.3331 19.0335H5.66647C4.07472 19.0335 2.82256 18.5752 1.97643 17.6639C1.13903 16.7621 0.799805 15.5241 0.799805 14.1668V7.08346C0.799805 5.72616 1.13903 4.48813 1.97643 3.58631Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.12891 11.4168C9.12891 11.0302 9.44231 10.7168 9.82891 10.7168H9.83639C10.223 10.7168 10.5364 11.0302 10.5364 11.4168C10.5364 11.8034 10.223 12.1168 9.83639 12.1168H9.82891C9.44231 12.1168 9.12891 11.8034 9.12891 11.4168Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.21094 11.4168C5.21094 11.0302 5.52434 10.7168 5.91094 10.7168H5.91842C6.30502 10.7168 6.61842 11.0302 6.61842 11.4168C6.61842 11.8034 6.30502 12.1168 5.91842 12.1168H5.91094C5.52434 12.1168 5.21094 11.8034 5.21094 11.4168Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.21094 14.7498C5.21094 14.3632 5.52434 14.0498 5.91094 14.0498H5.91842C6.30502 14.0498 6.61842 14.3632 6.61842 14.7498C6.61842 15.1364 6.30502 15.4498 5.91842 15.4498H5.91094C5.52434 15.4498 5.21094 15.1364 5.21094 14.7498Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                  <div class="filter-dropdown-period">
                    <input
                      type="text"
                      class="date-range-input"
                      id="dateRangeInput"
                      placeholder="Выберите период"
                      readonly
                    />
                  </div>
                </div>
              </div>

              <div class="filter-item">
                <div class="custom-select">
                  <div class="filter-trigger filter-trigger-period" id="periodTrigger2">
                    <span id="periodText2">Даты туров</span>
                    <svg
                      class="calendar-icon"
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.6668 0.966797C6.0534 0.966797 6.3668 1.2802 6.3668 1.6668V4.1668C6.3668 4.5534 6.0534 4.8668 5.6668 4.8668C5.2802 4.8668 4.9668 4.5534 4.9668 4.1668V1.6668C4.9668 1.2802 5.2802 0.966797 5.6668 0.966797Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.3328 0.966797C12.7194 0.966797 13.0328 1.2802 13.0328 1.6668V4.1668C13.0328 4.5534 12.7194 4.8668 12.3328 4.8668C11.9462 4.8668 11.6328 4.5534 11.6328 4.1668V1.6668C11.6328 1.2802 11.9462 0.966797 12.3328 0.966797Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.2168 7.575C1.2168 7.1884 1.5302 6.875 1.9168 6.875H16.0835C16.4701 6.875 16.7835 7.1884 16.7835 7.575C16.7835 7.9616 16.4701 8.275 16.0835 8.275H1.9168C1.5302 8.275 1.2168 7.9616 1.2168 7.575Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.00234 4.53895C2.48558 5.09546 2.1998 5.94077 2.1998 7.08346V14.1668C2.1998 15.3095 2.48558 16.1548 3.00234 16.7113C3.51039 17.2584 4.34156 17.6335 5.66647 17.6335H12.3331C13.6581 17.6335 14.4892 17.2584 14.9973 16.7113C15.514 16.1548 15.7998 15.3095 15.7998 14.1668V7.08346C15.7998 5.94077 15.514 5.09546 14.9973 4.53895C14.4892 3.99182 13.6581 3.6168 12.3331 3.6168H5.66647C4.34156 3.6168 3.51039 3.99182 3.00234 4.53895ZM1.97643 3.58631C2.82256 2.6751 4.07472 2.2168 5.66647 2.2168H12.3331C13.9249 2.2168 15.1771 2.6751 16.0232 3.58631C16.8606 4.48813 17.1998 5.72616 17.1998 7.08346V14.1668C17.1998 15.5241 16.8606 16.7621 16.0232 17.6639C15.1771 18.5752 13.9249 19.0335 12.3331 19.0335H5.66647C4.07472 19.0335 2.82256 18.5752 1.97643 17.6639C1.13903 16.7621 0.799805 15.5241 0.799805 14.1668V7.08346C0.799805 5.72616 1.13903 4.48813 1.97643 3.58631Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.12891 11.4168C9.12891 11.0302 9.44231 10.7168 9.82891 10.7168H9.83639C10.223 10.7168 10.5364 11.0302 10.5364 11.4168C10.5364 11.8034 10.223 12.1168 9.83639 12.1168H9.82891C9.44231 12.1168 9.12891 11.8034 9.12891 11.4168Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.21094 11.4168C5.21094 11.0302 5.52434 10.7168 5.91094 10.7168H5.91842C6.30502 10.7168 6.61842 11.0302 6.61842 11.4168C6.61842 11.8034 6.30502 12.1168 5.91842 12.1168H5.91094C5.52434 12.1168 5.21094 11.8034 5.21094 11.4168Z"
                        fill="#64748B"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.21094 14.7498C5.21094 14.3632 5.52434 14.0498 5.91094 14.0498H5.91842C6.30502 14.0498 6.61842 14.3632 6.61842 14.7498C6.61842 15.1364 6.30502 15.4498 5.91842 15.4498H5.91094C5.52434 15.4498 5.21094 15.1364 5.21094 14.7498Z"
                        fill="#64748B"
                      />
                    </svg>
                  </div>
                  <div class="filter-dropdown-period">
                    <input
                      type="text"
                      class="date-range-input"
                      id="dateRangeInput2"
                      placeholder="Выберите период"
                      readonly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Теги -->
          <div class="tags-container">
            <div class="tags-list">
              <div class="tag-item active">
                <span>Ter 1</span>
                <svg
                  class="tag-close"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </div>
              <div class="tag-item">
                <span>Ter 1</span>
              </div>
            </div>
            <button class="add-tag-btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Добавить тег
            </button>
          </div>
        </div>

        <div class="filters" v-for="item in booking.orders" :key="item.id">
          <div class="page-header">
            <div class="title-table-n-za">{{ item.title }}</div>
            <div>
              <div class="tags-list">
                <div class="tag-item">
                  <span>Ter 1</span>
                </div>
              </div>
            </div>
          </div>
          <div class="table-wrapper2">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Дата начала тура</th>
                  <th>Дата окончания тура</th>
                  <th>Забронировано</th>
                  <th>Всего</th>
                  <th>Статус</th>
                  <th style="width: 100px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in item.bookings" :key="index">
                  <td>
                    {{ item.date_start }}
                  </td>
                  <td>
                    {{ item.date_end }}
                  </td>
                  <td>
                    {{ item.bookings[index].customers.length }}
                  </td>
                  <td>
                    {{ item.bookings.length }}
                  </td>
                  <td>
                    <div class="status-item">
                      <span class="status-name" v-show="val.status">{{ val.status }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="actions-container">
                      <div class="user-actions">
                        <button class="edit-btn">
                          <img src="/svg/eye.svg" alt="view" />
                        </button>
                        <button class="edit-btn">
                          <router-link
                            :to="{ name: 'order-edit', params: { id: item.bookings[index].id } }"
                          >
                            <img src="/svg/pencil.svg" alt="edit" />
                          </router-link>
                        </button>
                        <button class="more-btn">
                          <img src="/svg/more-horiz.svg" alt="edit" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для добавления тегов -->
    <div class="modal" id="tagsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Добавить тег</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div class="modal-tags-container">
            <div class="tag-input-row">
              <input type="text" class="modal-tag-input" placeholder="Имя тега" />
              <button class="btn btn-primary add-tag-btn-modal">Добавить</button>
            </div>
            <div class="modal-tags-list">
              <div class="modal-tag-item">
                <span>Тет 1</span>
                <svg
                  class="tag-close"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </div>
              <div class="modal-tag-item">
                <span>Тет 1</span>
                <svg
                  class="tag-close"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </div>
              <div class="modal-tag-item">
                <span>Тет 1</span>
                <svg
                  class="tag-close"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </div>
              <div class="modal-tag-item">
                <span>Тет 1</span>
                <svg
                  class="tag-close"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.white-bg {
  background: #fff;
  padding: 20px;
  margin-bottom: 30px;
}

.clear {
  clear: both;
}

.status-name {
  display: inline-block;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-radius: 44px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  margin-bottom: 4px;
}

.users-header {
  margin-bottom: 20px;
}

.users-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.users-title h3 {
  font-size: 16px;
  font-weight: 500;
  color: #353535;
  margin: 0;
}

.search-container {
  display: flex;
  gap: 16px;
  width: 100%;
}

.add-user-btn {
  white-space: nowrap;
}

.view-btn {
  background: 0 0;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.view-btn.active svg path {
  stroke: #10b981;
}

.table-wrapper {
  overflow-x: auto;
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

.user-name {
  font-weight: 500;
  flex: 1;
  color: #353535;
  margin-bottom: 4px;
}

.user-name2 {
  font-weight: 500;
  font-style: Medium;
  font-size: 16px;
  line-height: 24px;
  color: rgba(53, 53, 53, 1);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-radius: 44px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.edit-btn,
.more-btn {
  background: 0 0;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover svg path,
.more-btn:hover svg path {
  fill: #10b981;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.actions-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
  display: none;
}

.actions-dropdown.active {
  display: block;
}

.dropdown-item {
  padding: 8px 16px;
  display: block;
  color: #353535;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.actions-container {
  position: relative;
}

.page-title-g img {
  float: left;
  margin: -3px 15px 0 0;
}

.page-title-g {
  max-width: 800px;
  white-space: normal;
}

:root {
  --primary-color: #4caf50;
  --primary-hover: #3e8e41;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
  --sidebar-width: 250px;
  --collapsed-sidebar: 80px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

body {
  display: flex;
  min-height: 100vh;
  color: var(--text-color);
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  transition: all 0.3s;
  min-width: 0;
}

.custom-select {
  position: relative;
  width: 100%;
  z-index: auto;
}

.filter-select {
  width: 100%;
  padding: 10px 14px;
  padding-right: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.filter-select option[disabled][selected] {
  color: #94a3b8;
}

.search-filters-container {
  display: grid;
  position: relative;
  grid-template-columns: 280px 1fr;
  grid-gap: 24px;
}

.search-container {
  margin-bottom: 16px;
}

.search-container {
  margin-bottom: 16px;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.search-input:focus + .search-icon path {
  fill: #64748b;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.filter-item {
  position: relative;
}

.filter-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  transition: all 0.2s;
}

.filter-input:focus {
  outline: 0;
  border-color: #94a3b8;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

@media (max-width: 640px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
  }

  .filter-input,
  .filter-select,
  .search-input {
    padding: 10px 12px;
    font-size: 13px;
  }
}

.user-name {
  font-weight: 500;
  white-space: nowrap;
}

.dropdown {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
  color: rgba(16, 185, 129, 1);
}

.content {
  padding: 30px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
}

.actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
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
  -webkit-border-radius: 12px;
  -moz-border-radius: 12px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
}

.btn-primary:hover {
  background-color: #0f9166;
}

.filters {
  background: #fff;
  padding: 20px;
  border-radius: 24px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.filter-label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.filter-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.search-input {
  flex: 2;
  padding-left: 40px !important;
  padding: 10px 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 16px;
}

.status-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  font-size: 12px;
}

.status-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  color: rgba(16, 185, 129, 1);
  border-radius: 44px;
  margin: 4px;
  padding: 6px 10px;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  background: rgba(16, 185, 129, 0.12);
}

.status-name2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  color: rgba(209, 67, 67, 1);
  border-radius: 44px;
  margin: 4px;
  padding: 6px 10px;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  background: rgba(209, 67, 67, 0.12);
}

.status-name3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  color: rgba(106, 110, 117, 1);
  border-radius: 44px;
  margin: 4px;
  padding: 6px 10px;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  background: rgba(106, 110, 117, 0.12);
}

.status-type {
  color: #666;
  font-weight: 500;
  background: rgba(255, 149, 0, 0.12);
  margin: 4px;
  padding: 6px 10px;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 149, 0, 1);
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
}

.status-type2 {
  color: #666;
  font-weight: 500;
  background: rgba(61, 126, 255, 0.12);
  margin: 4px;
  padding: 6px 10px;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: rgba(61, 126, 255, 1);
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 20px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
  line-height: 1.5;
}

.tag-item.active {
  background: rgba(53, 53, 53, 1);
  color: #fff;
}

.tag-item.active svg {
  fill: #fff;
}

.tag-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag-close:hover {
  opacity: 1;
}

.tag-item:not(.active) .tag-close {
  display: none;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(241, 241, 244, 1);
  border: none;
  color: rgba(106, 110, 117, 1);
  font-size: 12px;
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
  cursor: pointer;
  border: 1px dashed rgba(159, 166, 175, 1);
  padding: 6px 12px;
}

.add-tag-btn:hover {
  color: #3e8e41;
}

.add-tag-btn svg {
  flex-shrink: 0;
  fill: rgba(106, 110, 117, 1);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-height: 500px;
  overflow-y: auto;
  position: relative;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
  position: relative;
}

td,
th {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
}

td {
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0;
  vertical-align: middle;
  color: rgba(53, 53, 53, 1);
}

.bg-header-table {
  background: rgba(249, 249, 250, 1);
  -webkit-border-top-left-radius: 14px;
  -webkit-border-top-right-radius: 14px;
  -moz-border-radius-topleft: 14px;
  -moz-border-radius-topright: 14px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}

.bg-header-table th {
  background: rgba(249, 249, 250, 1);
}

th {
  font-weight: 500;
  color: #666;
  position: sticky;
  top: 0;
  color: rgba(106, 110, 117, 1);
  text-transform: uppercase;
  font-size: 11px;
  z-index: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

tr:hover {
  background-color: rgba(76, 175, 80, 0.05);
}

.edit-btn {
  background: 0 0;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.edit-btn:hover {
  color: var(--primary-color);
}

.edit-btn svg {
  width: 18px;
  height: 18px;
}

.page-btn:hover {
  background: #fff;
  color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  font-style: Medium;
  font-size: 13px;
  line-height: 24px;
  white-space: nowrap;
}

.page-btn.active {
  background: #fff;
  color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  align-items: center;
  justify-content: center;
}

.modal.active {
  display: flex;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 510px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-weight: 600;
  font-style: Semi Bold;
  font-size: 20px;
  line-height: 100%;
  color: rgba(53, 53, 53, 1);
  margin: 0;
}

.close-modal {
  background: 0 0;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.modal-body p {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  margin-bottom: 20px;
}

.tag-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-tag-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.modal-tag-input:focus {
  outline: 0;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}

.add-tag-btn-modal {
  white-space: nowrap;
  padding: 0 16px;
}

.modal-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
}

.modal-tag-item svg {
  cursor: pointer;
  opacity: 0.7;
  fill: #000;
  transition: opacity 0.2s;
}

.modal-tag-item svg:hover {
  opacity: 1;
}

.filter-trigger {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.filter-trigger:hover {
  border-color: #94a3b8;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 280px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  margin-top: 5px;
}

.content,
.main-content {
  overflow: visible !important;
}

@media (max-width: 768px) {
  .filter-dropdown {
    width: 100%;
    left: 0 !important;
    right: auto !important;
    transform: none !important;
  }

  .filters-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

.filter-dropdown.active {
  max-height: 400px;
  opacity: 1;
  overflow-y: auto;
}

.filter-search-container {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.filter-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
}

.filter-search-input:focus {
  outline: 0;
  border-color: #94a3b8;
}

.filter-options {
  padding: 8px 0;
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  justify-content: space-between;
  flex-direction: row-reverse;
}

.filter-option:hover {
  background-color: rgba(16, 185, 129, 0.05);
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 16px;
  width: 16px;
  min-width: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  margin-left: 12px;
  margin-right: 0;
}

.filter-option input:checked ~ .checkmark {
  background-color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.filter-option input:checked ~ .checkmark:after {
  display: block;
}

.option-text {
  font-size: 14px;
  color: #353535;
  margin-right: auto;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-top: 1px solid #e2e8f0;
}

.filter-apply-btn,
.filter-clear-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.filter-clear-btn {
  background: 0 0;
  border: 1px solid #e2e8f0;
  color: #64748b;
  margin-right: 10px;
}

.filter-clear-btn:hover {
  background: #f8fafc;
}

.filter-apply-btn {
  background-color: rgba(16, 185, 129, 1);
  color: #fff;
  border: none;
}

.filter-apply-btn:hover {
  background-color: #0f9166;
}

.filters-grid {
  display: flex;
  z-index: 1000;
  position: relative;
  gap: 12px;
  position: relative;
  width: max-content;
  min-width: 100%;
  gap: 12px;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
}

.filters-grid::-webkit-scrollbar {
  height: 4px;
}

.filters-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.filters-grid::-webkit-scrollbar-thumb {
  background-color: rgba(16, 185, 129, 0.5);
  border-radius: 2px;
}

.filter-item {
  flex: 0 0 auto;
  min-width: 110px;
}

.filters-scroll-container {
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(16, 185, 129, 0.5) #f1f1f1;
  -webkit-overflow-scrolling: touch;
  margin-bottom: -10px;
  padding-bottom: 10px;
  position: relative;
}

.filters-scroll-container::-webkit-scrollbar {
  height: 4px;
}

.filters-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.filters-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(16, 185, 129, 0.5);
  border-radius: 2px;
}

.filter-dropdown {
  max-width: calc(100vw - 20px);
  left: auto;
  right: 0;
}

.status-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.status-indicator.published {
  background-color: rgba(16, 185, 129, 1);
}

.filter-option input:checked ~ .status-indicator.published {
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px rgba(16, 185, 129, 1);
}

.filter-option {
  display: flex;
  align-items: center;
}

.filter-option .checkmark {
  order: 1;
  margin-left: auto;
}

.filter-option .option-text {
  order: 2;
  margin-left: 8px;
  margin-right: auto;
}

.filter-option .status-indicator {
  order: 3;
}

.option-text {
  font-size: 14px;
  color: #1e293b;
}

.btn {
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.btn-primary {
  background-color: rgba(16, 185, 129, 1);
  color: #fff;
}

.payment-options {
  display: flex;
  gap: 16px;
  margin-top: 16px;
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

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
}

input[type='checkbox']:checked + .checkbox {
  background-color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

input[type='checkbox']:checked + .checkbox:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.date-input {
  position: relative;
}

.date-input:after {
  content: '□';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-filters-container2 {
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  grid-gap: 24px;
}

.title-table-n-za {
  font-weight: 500;
  font-style: Medium;
  font-size: 16px;
  line-height: 20px;
  color: rgba(24, 24, 24, 1);
}

.status-name {
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 149, 0, 1);
  background: rgba(255, 149, 0, 0.12);
}

.status-name-completed {
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #d14343;
  background: rgba(209, 67, 67, 0.12);
}

.status-name-published {
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: rgba(16, 185, 129, 1);
  background: rgba(16, 185, 129, 0.12);
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.paid {
  background-color: #10b981;
}

.status-indicator.partially {
  background-color: #f59e0b;
}

.status-indicator.unpaid {
  background-color: #ef4444;
}

.status-indicator.refunded {
  background-color: #64748b;
}

.flatpickr-calendar {
  transform: none !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.flatpickr-calendar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-family: Inter, sans-serif;
  border: 1px solid #e2e8f0;
}

.flatpickr-calendar {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
}

.flatpickr-calendar {
  font-family: Inter, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.date-range-input {
  display: none;
}

.date-range-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  margin-bottom: 10px;
  cursor: pointer;
  opacity: 0;
  height: 0;
  padding: 0;
  border: none;
}

.filter-dropdown-period {
  position: relative;
  padding: 10px;
  width: 300px;
}

.flatpickr-input {
  display: none !important;
}

.filter-dropdown-period {
  position: absolute;
  width: auto;
  min-width: 300px;
  padding: 0;
  background: 0 0;
  border: none;
  box-shadow: none;
}

.filter-dropdown-period .flatpickr-calendar {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  margin-top: 5px;
}

.date-range-input {
  width: 100%;
  padding: 10px 35px 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  cursor: pointer;
  position: relative;
}

.date-input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.date-range-input {
  padding-right: 40px !important;
  background-image: url(data:image/svg+xml;utf8,SVG_REPLACED);
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px 20px;
}

.date-input:after {
  display: none !important;
}

.filter-trigger {
  position: relative;
  padding-right: 30px;
}

.calendar-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 20px;
}

.date-range-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  opacity: 1 !important;
  height: auto !important;
  position: relative;
}

.filter-dropdown-period {
  position: relative;
}

.flatpickr-calendar {
  position: absolute !important;
  top: 100% !important;
  left: 0 !important;
  margin-top: 5px;
  z-index: 1000;
}

.filter-trigger-period {
  position: relative;
  padding-right: 30px;
  cursor: pointer;
}

.calendar-icon {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 20px;
}

.custom-select {
  position: relative;
  z-index: 100;
}

.filter-dropdown-period {
  position: absolute;
  width: auto;
  min-width: 300px;
  padding: 0;
  background: 0 0;
  border: none;
  box-shadow: none;
  z-index: 1000;
}

.date-range-input {
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  opacity: 1;
  height: auto;
}

.flatpickr-calendar {
  font-family: Inter, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transform: none !important;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 0.6;
  }
}

.status-item {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-name {
  background-color: rgba(16, 185, 129, 0.12);
  color: rgba(16, 185, 129, 1);
}

.status-name-published {
  background-color: rgba(61, 126, 255, 0.12);
  color: rgba(61, 126, 255, 1);
}

.status-name-completed {
  background-color: rgba(209, 67, 67, 0.12);
  color: rgba(209, 67, 67, 1);
}

@media (max-width: 1600px) {
  .table-wrapper2 {
    overflow-x: auto;
  }
}

.table-wrapper2 {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-wrapper2::-webkit-scrollbar {
  height: 8px;
  background-color: #f5f5f5;
}

.table-wrapper2::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

.table-wrapper2::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}

@media (max-width: 768px) {
  .table-wrapper2 {
    border-radius: 0;
  }
}

.table-wrapper2 {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.table-wrapper2::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper2::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.payment-options2 {
  display: block;
  margin-top: 16px;
}

.payment-options2 .payment-option {
  margin-bottom: 15px;
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
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
}

input[type='checkbox']:checked + .checkbox {
  background-color: #10b981;
  border-color: #10b981;
}

input[type='checkbox']:checked + .checkbox:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.btn-primary {
  background-color: #10b981;
  color: #fff;
}

.date-input-wrapper {
  position: relative;
  width: 100%;
}

.date-input {
  width: 100%;
  padding: 10px 14px 10px 35px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8fafc;
  cursor: pointer;
}

.tag-item svg {
  fill: rgba(106, 110, 117, 1);
}

.custom-checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
}

input[type='checkbox'] {
  position: absolute;
  opacity: 0;
}

input[type='checkbox']:checked + .custom-checkbox {
  background-color: rgba(16, 185, 129, 1);
  border-color: rgba(16, 185, 129, 1);
}

input[type='checkbox']:checked + .custom-checkbox:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.select-btn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.payment-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #353535;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-indicator.paid {
  background-color: #10b981;
}

.list-container {
  max-width: 500px;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.checkbox-list {
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.checkbox-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background: #f8fafc;
}

.tag-item4 {
  display: flex;
  align-items: center;
  gap: 4px;
  background: 0 0;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid rgba(212, 214, 217, 1);
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
}
</style>
