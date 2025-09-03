<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { MglMap, MglNavigationControl, MglMarker, MglPopup } from '@indoorequal/vue-maplibre-gl'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

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
    height: '300px',
    markerData: null,
    markerColor: '#10B981',
    draggable: false,
  },
)

const emit = defineEmits<{
  (e: 'update:coordinates', coords: { lat: number; lng: number }): void
}>()

const draggable = ref(props.draggable)

const mapKey = ref(0)

const markerCoordinates = ref(
  props.markerData?.coordinates
    ? [props.markerData.coordinates[1], props.markerData.coordinates[0]]
    : props.center,
)

const mapCenter = ref(markerCoordinates.value)

const mapZoom = ref(props.markerData ? props.zoom : 2)

const containerStyle = computed(() => {
  return { height: props.height }
})

const updateMapView = () => {
  mapKey.value++
  nextTick(() => {
    mapCenter.value = [...markerCoordinates.value]
    mapZoom.value = 14
  })
}

watch(
  () => props.markerData,
  (newVal) => {
    if (newVal?.coordinates) {
      markerCoordinates.value = [newVal.coordinates[1], newVal.coordinates[0]]
      updateMapView()
    }
  },
  { immediate: true, deep: true },
)

const onDragEnd = () => {
  const { lat, lng } = markerCoordinates.value

  emit('update:coordinates', {
    lat: lat.toFixed(8),
    lng: lng.toFixed(8),
  })
}
</script>

<template>
  <div
    class="flex flex-col size-full z-2 relative overflow-hidden rounded-md bg-neutral-100"
    :style="containerStyle"
  >
    <div class="flex flex-col size-full z-1 absolute h-full inset-0">
      <MglMap
        :key="mapKey"
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

  <div class="flex">
    <div class="pt-3">
      <Label for="switch">
        <Switch id="switch" v-model="draggable" @update:model-value="!draggable" />
        Изменить положение
      </Label>
    </div>
  </div>
</template>

<style lang="css">
@import 'maplibre-gl/dist/maplibre-gl.css';
</style>
