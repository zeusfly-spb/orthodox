<script setup>
import { RouterLink } from 'vue-router';
import { defineProps, shallowRef } from 'vue';

const props = defineProps({
  managers: Array,
});

const dropdownList = [
  { title: 'Редактировать', link: 'edit' },
  { title: 'Скрыть', link: 'hide' },
  { title: 'Удалить', link: 'delete' },
];
const isOpenedDropdownList = shallowRef(false);
</script>

<template>
  <div class="users-view blocks-view">
    <div class="profile-cards-container users-grid">
      <div class="profile-card user-card" v-for="manager in props.managers">
        <div class="profile-gradient partial-blur"></div>
        <div class="content-profile-f">
          <div class="profile-card-header">
            <div class="profile-info">
              <div class="profile-avatar">
                <img :src="manager.avatar || '/svg/unknown-user.svg'" />
              </div>
              <div class="profile-meta">
                <h3 class="profile-name">{{ manager.name }}</h3>
                <span class="profile-role" v-for="role in manager.roles">{{ role.name }}</span>
              </div>
            </div>
            <div class="profile-controls">
              <button class="profile-edit-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M11.333 2a1 1 0 0 1 1.414 0l1.253 1.253a1 1 0 0 1 0 1.414L5.44 13.414 2 14l.586-3.44 8.56-8.56z"
                    stroke="#6A6E75"
                    stroke-width="1.5"
                  />
                </svg>
              </button>
              <div class="profile-actions">
                <button
                  class="profile-more-btn"
                  @click="isOpenedDropdownList = !isOpenedDropdownList"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="4" r="1.5" fill="#6A6E75" />
                    <circle cx="8" cy="8" r="1.5" fill="#6A6E75" />
                    <circle cx="8" cy="12" r="1.5" fill="#6A6E75" />
                  </svg>
                </button>
                <div class="profile-dropdown actions-dropdown" v-show="isOpenedDropdownList">
                  <router-link :to="item.link" class="dropdown-item" v-for="item in dropdownList">{{
                    item.title
                  }}</router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="profile-stats">
            <div class="tags-container">
              <span class="tag">Lorem ipsum dolor</span>
              <span class="tag-gr">Lorem ipsum dolor</span>
            </div>

            <div class="stats-row">
              <div class="stacked-avatars">
                <div class="avatar" style="z-index: 3"></div>
                <div class="avatar" style="z-index: 2"></div>
                <div class="avatar-count">+3</div>
              </div>
              <span class="stats-value">5 заявок в процессе обработки</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.profile-gradient {
  background: url(/temp/slk.jpg) no-repeat center;
  background-size: cover;
  -webkit-border-top-left-radius: 16px;
  -webkit-border-top-right-radius: 16px;
  -moz-border-radius-topleft: 16px;
  -moz-border-radius-topright: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  min-height: 64px;
  width: 100%;
}

.partial-blur {
  position: relative;
  overflow: hidden;
}

.partial-blur::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(29, 29, 38, 0) 0%, #1d1d26 100%);
  backdrop-filter: blur(8px);
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.content-profile-f {
  background: rgba(249, 249, 250, 1);
  padding: 16px;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-avatar {
  width: 58px;
  height: 58px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f1f4;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-meta {
  flex: 1;
}

.profile-name {
  font-size: 15px;
  font-weight: 500;
  color: #353535;
  margin: 0 0 4px 0;
}

.profile-role {
  font-size: 12px;
  color: #6a6e75;
  display: block;
}

.profile-controls {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.page-title-g img {
  float: left;
  margin: -3px 15px 0px 0px;
}

.page-title-g {
  max-width: 800px;
  white-space: normal;
}

.profile-edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.profile-card:hover .profile-edit-btn {
  opacity: 1;
}

.profile-edit-btn:hover svg path {
  stroke: #10b981;
}

.profile-actions {
  position: relative;
}

.profile-more-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.profile-more-btn:hover svg circle {
  fill: #10b981;
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 160px;
  display: none;
}

.profile-actions:hover .profile-dropdown {
  display: block;
}

.profile-stats {
  padding-top: 12px;
  border-top: 1px solid #f1f1f4;
}

.stats-title {
  font-size: 12px;
  color: #6a6e75;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stats-value {
  color: #353535;
  margin: 0;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0%;
  color: rgba(113, 113, 115, 1);
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
}

.stacked-avatars {
  position: relative;
  display: inline-flex;
  height: 32px;
  margin-right: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-left: -10px;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-count {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  background: #10b981;
  color: white;
  font-weight: 500;
  position: relative;
  margin-left: -10px;
  z-index: 0;
}
/* Блочное представление */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.user-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.user-card .user-info2 {
  margin-bottom: 12px;
}

.user-card .edit-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* Стили для выпадающего меню */
.actions-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
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
</style>
