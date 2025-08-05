<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MglMap, MglNavigationControl, MglMarker, MglPopup } from '@indoorequal/vue-maplibre-gl'

const props = withDefaults(
  defineProps<{
    mapStyle?: string
    center?: number[]
    zoom?: number
    height?: string
    markerData?: { type: string; coordinates: number[] } | null
    markerColor?: string
    draggable?: boolean
  }>(),
  {
    mapStyle: import.meta.env.VITE_MAP_STREETS_URL,
    center: () => [110.32128708, 65.53927338],
    zoom: 2,
    height: '200px',
    markerData: null,
    markerColor: '#10B981',
    draggable: false,
  },
)

const emit = defineEmits<{
  (e: 'update:coordinates', coords: { lat: number; lng: number }): void
}>()

const draggable = ref(props.draggable)

const markerCoordinates = ref(
  props.markerData?.coordinates
    ? [props.markerData.coordinates[1], props.markerData.coordinates[0]]
    : [110.32128708, 65.53927338],
)

const mapCenter = ref(markerCoordinates.value)

const mapZoom = computed(() => {
  return props.markerData ? props.zoom : 2
})

const containerStyle = computed(() => {
  return { height: props.height }
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
  const { lng, lat } = markerCoordinates.value
  emit('update:coordinates', { lat, lng })
}
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
  </div>
</template>

<style lang="css">
@import 'maplibre-gl/dist/maplibre-gl.css';
</style>
