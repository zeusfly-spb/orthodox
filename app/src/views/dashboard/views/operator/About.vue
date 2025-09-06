<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  operator: [Object, String],
});
</script>
<template>
  <div class="tab-content active" id="data-tab">
    <div class="grid-palom-v profile-section">
      <div>
        <h3 class="title-palom-tabes">О ПАЛОМНИЧЕСКОЙ СЛУЖБЕ</h3>
        <div class="content-palomss">
          <div class="desc-pla" v-show="props.operator.name">{{ props.operator.name }}</div>
          <div class="desc-pla2" v-show="props.operator.description">
            {{ props.operator.description }}
          </div>

          <div class="contact-info">
            <div class="contact-item mail-p" v-show="props.operator.email">
              <router-link :to="`'mailto:'${props.operator.email}`">
                {{ props.operator.email }}
              </router-link>
            </div>
            <div class="contact-item phone-p" v-show="props.operator.phone">
              <router-link :to="`tel:${props.operator.phone}`">{{
                props.operator.phone
              }}</router-link>
            </div>
            <div class="contact-item sait-p" v-show="props.operator.site">
              <!-- <router-link :to="props.operator.site" target="_blank">https://poklonnik.ru</router-link> -->
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="line-eparh">
          <div><img src="/svg/c1.svg" /></div>
          <div>
            <div class="t-ep">Тамбовская Епархия Русской Православной Церкви</div>
            <div class="t-ep2">Епархия</div>
          </div>
        </div>

        <div class="line-eparh" v-show="props.operator.legal_address">
          <div><img src="/svg/c2.svg" /></div>
          <div>
            <div class="t-ep">{{ props.operator.legal_address }}</div>
            <div class="t-ep2">Адрес</div>
          </div>
        </div>

        <div class="line-eparh" v-show="props.operator.number_date">
          <div><img src="/svg/c3.svg" /></div>
          <div>
            <div class="t-ep">{{ props.operator.number_date }}</div>
            <div class="t-ep2">Номер в Реестре паломнических служб</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:root {
  --primary-color: #4caf50;
  --primary-hover: #3e8e41;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
  --sidebar-width: 250px;
  --collapsed-sidebar: 80px;
}

.grid-palom-v {
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
}

.title-palom-tabes {
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  color: rgba(159, 166, 175, 1);
  line-height: 18px;
  text-transform: uppercase;
}

.content-palomss {
  margin-top: 60px;
}

.desc-pla {
  font-weight: 500;
  font-style: Medium;
  font-size: 26px;
  line-height: 34px;
  color: rgba(53, 53, 53, 1);
}

.desc-pla2 {
  font-weight: 400;
  margin-top: 15px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(106, 110, 117, 1);
}

.t-ep {
  font-weight: 500;
  font-style: Medium;
  font-size: 20px;
  max-width: 400px;
  line-height: 26px;
  color: rgba(53, 53, 53, 1);
}

.t-ep2 {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: 10px;
  color: rgba(159, 166, 175, 1);
}

.line-eparh {
  background: rgba(249, 249, 250, 1);
  border-radius: 16px;
  display: grid;
  margin-bottom: 16px;
  padding: 16px;
  position: relative;
  grid-template-columns: 60px 1fr;
  grid-gap: 24px;
}

.profile-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
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
  margin-bottom: 0px;
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

.mail-p::before {
  background: url('/temp/mail-p.svg');
  background-repeat: no-repeat;
}

.phone-p::before {
  background: url('/temp/call-p.svg');
  background-repeat: no-repeat;
}

.sait-p::before {
  background: url('/temp/sait-p.svg');
  background-repeat: no-repeat;
}

.contact-item::before {
  content: '';
  position: absolute;
  top: 3px;
  left: -3px;
  margin-left: 0px;
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  line-height: 20px;
  background-repeat: no-repeat;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.info-label {
  font-weight: 500;
  color: #6a6e75;
  width: 250px;
  flex-shrink: 0;
}

.info-value {
  color: #353535;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

.breadcrumbs {
  display: flex;
  border-top: 1px solid rgba(212, 214, 217, 1);
  margin-top: 20px;
  padding-top: 20px !important;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  font-size: 14px;
  color: #6a6e75;
  background: transparent;
}

.breadcrumb-item {
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: #6a6e75;
}

.breadcrumb-item.active {
  background: transparent;
  color: #10b981;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #d1d5db;
  margin: 0 4px;
}
</style>
