<template>
  <div class="flex shrink-0 items-center justify-between gap-2">
    <div class="flex items-center gap-4 pl-4">
      <h1 class="text-lg font-bold text-muted-foreground">Паломнические туры</h1>
    </div>
    <div class="flex items-center gap-4 pr-4">
      <Button
        variant="outline"
        class="bg-white text-emerald-500 border-emerald-500 shadow hover:bg-emerald-500/90 hover:text-white px-8 py-6 touchable"
        type="button"
        @click="emit('downloadReport')"
      >
        <ArrowDownToLine />
        Скачать отчет
      </Button>
      <Button
        class="bg-emerald-500 text-white shadow hover:bg-white hover:text-emerald-500 px-8 py-6 touchable"
        type="button"
        @click="emit('addTour')"
      >
        Создать новый тур
      </Button>
    </div>
  </div>
  <div
    v-if="showHint"
    class="hide-banner"
  >
    <div><img src="/svg/hide-b.svg" /></div>
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

<script setup lang="ts">
import { ArrowDownToLine } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'addTour'): void;
  (e: 'downloadReport'): void;
}>();

const showHint = ref(true);
</script>

<style scoped>
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

.absl-cancel {
  position: absolute;
  right: 24px;
  top: 24px;
}
</style>
