<script setup>
import { catalog, paragraph } from '@/composables/sidebar.js';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const selectedItem = ref(5);
const route = useRoute();

function matchRouteName() {
  selectedItem.value =
    paragraph.find((item) => item.linkName === route.name)?.id || selectedItem.value; //TODO: исправить соответствие
}

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
const logo = ref("/logo.png")

const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value
	localStorage.setItem("is_expanded", is_expanded.value)
  switch(is_expanded.value) {
    case true:
      return logo.value = "/logo-icon.png"
    default:
      return logo.value = "/logo.png"
  }
}

onMounted(() => matchRouteName());
</script>

<template>
  <aside class="sidebar" :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="sidebar-header">
      <div class="logo">
        <router-link to="/" class="active-block">
          <img :src="logo" />
        </router-link>
      </div>
    </div>

    <div class="sidebar-menu">

      <div class="menu-toggle-wrap">
        <button class="menu-toggle" @click="ToggleMenu">
          <span class="material-icons">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 -960 960 960">
              <path d="M411-481 213-679l42-42 240 240-240 240-42-42 198-198Zm253 0L466-679l42-42 240 240-240 240-42-42 198-198Z"/>
            </svg>
          </span>
        </button>
      </div>

      <div class="left-title-s">Раздел</div>
      <router-link
        v-for="item in paragraph"
        :key="item.id"
        :to="{ name: item.linkName }"
        :class="['menu-item', selectedItem === item.id ? 'active' : '']"
        @click="selectedItem = item.id"
      >
        <img :src="item.image" alt="image" />
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </div>

    <div class="sidebar-submenu">
      <div style="display: flex; align-items: center">
        <span class="left-title-s">Справочники</span>
      </div>
    </div>

    <div v-if="false" class="submenu">
      <router-link
        v-for="(item, index) in catalog"
        :key="index"
        :to="item.link"
        class="submenu-item"
      >
        {{ item.name }}
      </router-link>
    </div>
    <router-link :to="{ name: 'entities-view' }" class="submenu-item">Объекты</router-link>
  </aside>
</template>
<style lang="scss" scoped>
.menu-toggle {
  transform: rotate(-180deg);
  cursor: pointer;
}
.sidebar {
  font-family: 'Inter', sans-serif;
  width: 255px;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 10;
  overflow-y: auto;
  &.is-expanded {
    width: 70px;
      
      .menu-toggle {
        transform: rotate(0deg);
      }

      .menu-text{
        display: none;
      }

      .menu-item {
        padding: 12px 10px;
      }

      .submenu-item,
      .left-title-s { 
        display: none;
      }
  }
}

.sidebar-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  position: relative;
  & img {
    margin: 25px 0;
    height: 50px;
    cursor: pointer;
  }
}

.left-title-s {
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-transform: uppercase;
  color: rgba(159, 166, 175, 1);
  margin-bottom: 10px;
}

.title-left-spravoch {
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  text-transform: uppercase;
}

.sidebar-menu {
  padding: 20px 16px;
  padding-top: 0;
}
.sidebar-submenu {
  padding: 0 16px;
  padding-top: 0;
}

.menu-item {
  font-weight: 400;
  font-size: 14px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  -webkit-border-radius: 12px;
  -moz-border-radius: 12px;
  border-radius: 12px;
  color: rgba(106, 110, 117, 1);
  transition: all 0.2s;
}

.menu-item:hover,
.menu-item.active {
  color: rgba(16, 185, 129, 1);
  background-color: rgba(76, 175, 80, 0.1);
}

.menu-item:hover svg,
.menu-item.active svg {
  fill: rgba(16, 185, 129, 1);
}

.menu-item svg {
  width: 20px;
  height: 20px;
  fill: #666;
  transition: all 0.2s;
}

.menu-text {
  margin-top: 3px;
  white-space: nowrap;
}

/* Submenu styles */
.submenu {
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background-color: rgba(245, 245, 245, 0.5);

  & .active {
    max-height: 500px;
  }

  &-item {
    font-weight: 400;
    font-size: 14px;
    padding: 10px 20px 10px 26px;
    display: block;
    text-decoration: none;
    color: rgba(106, 110, 117, 1);
    line-height: 20px;
    transition: all 0.2s;
  }
}

.submenu-item:hover {
  color: var(--primary-color);
  background-color: rgba(76, 175, 80, 0.1);
}

.menu-item.with-submenu {
  justify-content: space-between;
}
</style>
