<template>
  <div
    v-if="showHint"
    class="hide-banner"
  >
    <div><img src="../../../public/svg/hide-b.svg" /></div>
    <div>
      <div class="title-banners">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</div>
      <div class="desc-banners">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus temporibus sit,
        impedit adipisci perferendis incidunt accusantium neque, fuga, molestiae harum quae
        maiores expedita beatae sapiente voluptatibus? Aut distinctio atque facilis!
      </div>
    </div>
    <img src="/svg/cancel.svg" class="absl-cancel" @click="showHint = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showHint = ref(true)
</script>
<style scoped>
.hide-banner {
  background: rgba(249, 249, 250, 1);
  border-radius: 16px;
  padding: 24px;
  display: grid;
  position: relative;
  grid-template-columns: 50px 1fr;
  grid-gap: 24px;
  margin-bottom: 24px;
}
.title-banners {
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: rgba(53, 53, 53, 1);
}

.desc-banners {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: rgba(106, 110, 117, 1);
}
.absl-cancel {
  position: absolute;
  right: 24px;
  top: 24px;
}
</style>