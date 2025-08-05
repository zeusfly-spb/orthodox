<script setup>
import { ref, computed, watch } from 'vue'
import { MglMap, MglNavigationControl, MglMarker, MglPopup } from '@indoorequal/vue-maplibre-gl'

const props = defineProps({
  mapStyle: {
    type: String,
    default: import.meta.env.VITE_MAP_STREETS_URL,
  },
  center: {
    type: Array,
    default: () => [110.32128708, 65.53927338],
    validator: (value) =>
      value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number',
  },
  zoom: {
    type: Number,
    default: 2,
    validator: (value) => value >= 0 && value <= 22,
  },
  height: {
    type: String,
    default: '200px',
  },
  markerData: {
    type: Object,
    default: null,
    validator: (value) => {
      if (value == null) return true
      return value.type === 'Point' && Array.isArray(value.coordinates)
    },
  },
  markerColor: {
    type: String,
    default: '#10B981',
  },
})

const draggable = ref(true)

const markerCoordinates = ref(
  props.markerData?.coordinates
    ? [props.markerData.coordinates[1], props.markerData.coordinates[0]]
    : [110.32128708, 65.53927338],
)

const mapCenter = ref(markerCoordinates.value)

const mapZoom = computed(() => {
  return props.markerData ? props.zoom : 2
})

watch(
  () => props.markerData,
  (newVal) => {
    markerCoordinates.value = newVal?.coordinates
      ? [newVal.coordinates[1], newVal.coordinates[0]]
      : [110.32128708, 65.53927338]
  },
  { immediate: true },
)

const onDragEnd = () => {
  // console.log('Новые координаты маркера:', markerCoordinates.value)
}

const containerStyle = computed(() => {
  if (typeof props.height === 'number') {
    return { height: `${props.height}px` }
  }
  return { height: props.height }
})
</script>

<template>
  <div
    class="flex flex-col size-full rounded-md z-2 relative overflow-hidden"
    :style="containerStyle"
  >
    <div class="flex flex-col size-full z-1 absolute h-full inset-0">
      <MglMap
        :map-style="props.mapStyle"
        :center="mapCenter"
        :zoom="mapZoom"
        :height="props.height"
      >
        <MglNavigationControl />
        <MglMarker
          v-if="markerCoordinates"
          v-model:coordinates="markerCoordinates"
          :color="props.markerColor"
          :draggable="draggable"
          @dragend="onDragEnd"
        />
      </MglMap>
    </div>
  </div>

  <div class="map-controls">
    <label>
      <input type="checkbox" v-model="draggable" />
      Переместить маркер
    </label>
    <div class="coordinates">Координаты маркера: {{ markerCoordinates }}</div>
  </div>
</template>

<style lang="css">
@import 'maplibre-gl/dist/maplibre-gl.css';
</style>
