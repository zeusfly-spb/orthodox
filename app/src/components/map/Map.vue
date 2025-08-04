<script setup>
import { computed } from 'vue'
import {
  MglMap,
  MglNavigationControl,
  MglMarker
} from '@indoorequal/vue-maplibre-gl';

const props = defineProps({
  mapStyle: {
    type: String,
    default: 'https://api.maptiler.com/maps/streets-v2/style.json?key=NsurAnZJr5X7sGXqkUDS'
  },
  center: {
    type: Array,
    default: () => [37.61763766, 55.75072275],
    validator: (value) => value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
  },
  zoom: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 22
  },
  markerData: {
    type: Object,
    default: null,
    validator: (value) => {
      if (value == null) return true
      return value.type === 'Point' &&
        Array.isArray(value.coordinates) &&
        value.coordinates.length === 2
    }
  },
  markerColor: {
    type: String,
    default: '#10B981'
  },
  height: {
    type: String,
    default: '200px'
  }
});

const swappedCoordinates = computed(() => {
  if (!props.markerData?.coordinates) return null
  return [props.markerData.coordinates[1], props.markerData.coordinates[0]]
});

const mapCenter = computed(() => {
  return swappedCoordinates.value || props.center
});

const mapZoom = computed(() => {
  return swappedCoordinates.value ? props.zoom : 0
});
</script>

<template>
  <MglMap
    :map-style="props.mapStyle"
    :center="mapCenter"
    :zoom="mapZoom"
    :height="props.height"
  >
    <MglNavigationControl />
    <MglMarker
      v-if="swappedCoordinates"
      :coordinates="swappedCoordinates"
      :color="props.markerColor"
    />
  </MglMap>
</template>

<style lang="css">
@import "maplibre-gl/dist/maplibre-gl.css";
</style>
