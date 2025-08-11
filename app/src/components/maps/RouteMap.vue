<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  MglMap,
  MglNavigationControl,
  MglGeoJsonSource,
  MglLineLayer,
  MglCircleLayer,
  MglSymbolLayer,
  MglMarker,
  MglPopup,
} from '@indoorequal/vue-maplibre-gl'

const props = withDefaults(
  defineProps<{
    mapStyle?: string
    height?: string
    points?: Array<{
      entity: {
        location: {
          type: 'Point'
          coordinates: [number, number]
        }
        [key: string]: any
      }
      [key: string]: any
    }>
    linePaint?: {
      'line-color': string
      'line-width': number
    }
    lineLayout?: {
      'line-join': string
      'line-cap': string
    }
    circlePaint?: {
      'circle-color': string
      'circle-radius': number
      'circle-stroke-width': number
    }
  }>(),
  {
    mapStyle: import.meta.env.VITE_MAP_STREETS_URL,
    height: '300px',
    points: () => [],
    linePaint: {
      'line-color': '#fff',
      'line-width': 3,
      'line-dasharray': [3, 2],
      'line-opacity': 0.95,
      'line-translate': [0, 0],
    },
    lineLayout: {
      'line-join': 'round',
      'line-cap': 'round',
      'line-sort-key': 1,
    },
    circlePaint: {
      'circle-color': '#10B981',
      'circle-radius': 12,
      'circle-stroke-color': '#fff',
      'circle-stroke-width': 2,
    },
  },
)

const emit = defineEmits<{
  (e: 'marker-click', id: string | undefined): void
}>()

const mapRef = ref(null)
const mapContainer = ref<HTMLElement | null>(null)
const containerStyle = computed(() => ({ height: props.height }))

const normalizedPoints = computed(() => {
  return props.points.map((point, index) => ({
    ...point,
    index: index + 1,
    entity: {
      ...point.entity,
      location: {
        ...point.entity.location,
        coordinates: [
          point.entity.location.coordinates[1], // Lng
          point.entity.location.coordinates[0], // Lat
        ],
      },
    },
  }))
})

const coordinates = computed(() =>
  normalizedPoints.value.map((point) => point.entity.location.coordinates),
)

// Словарь для быстрого доступа к данным точек по ID
const pointsDictionary = ref<
  Record<
    string,
    {
      coordinates: [number, number]
      title: string
      description: string
      index: number
    }
  >
>({})

// Обновляем словарь при изменении данных
watch(
  normalizedPoints,
  (points) => {
    pointsDictionary.value = {}
    points.forEach((point) => {
      pointsDictionary.value[point.entity.id] = {
        coordinates: point.entity.location.coordinates,
        title: point.entity.title || 'Неизвестно',
        description: point.entity.description || '',
        index: point.index,
      }
    })
  },
  { immediate: true },
)

const startMapParams = ref({
  center: [110.32128708, 65.53927338] as [number, number],
  zoom: 2,
})

// Bounding box
const calculateViewport = () => {
  if (!normalizedPoints.value.length) {
    return startMapParams.value
  }

  const coords = coordinates.value
  const lngs = coords.map((c) => c[0])
  const lats = coords.map((c) => c[1])

  const bbox = {
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  }

  const center = [(bbox.minLng + bbox.maxLng) / 2, (bbox.minLat + bbox.maxLat) / 2]

  const latDiff = bbox.maxLat - bbox.minLat
  const lngDiff = bbox.maxLng - bbox.minLng
  const maxDiff = Math.max(latDiff, lngDiff)

  let zoom = 5
  if (maxDiff > 20) zoom = 3
  else if (maxDiff > 10) zoom = 4
  else if (maxDiff > 5) zoom = 5
  else if (maxDiff > 2) zoom = 6
  else if (maxDiff > 1) zoom = 7
  else if (maxDiff > 0.5) zoom = 8
  else zoom = 9

  startMapParams.value = { center, zoom }
  return { center, zoom }
}

const mapParams = computed(calculateViewport)

const resetView = () => {
  const map = mapRef.value?.map
  if (map) {
    map.flyTo({
      center: startMapParams.value.center,
      zoom: startMapParams.value.zoom,
      essential: true,
      duration: 1000,
    })
  }
}

// GeoJSON points
const routeData = computed(() => {
  const features = normalizedPoints.value.map((point) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: point.entity.location.coordinates,
    },
    properties: {
      id: point.entity.id,
      title: point.entity.title,
      description: point.entity.description,
      index: point.index,
    },
  }))

  // Add lines
  if (normalizedPoints.value.length >= 2) {
    features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: normalizedPoints.value.map((p) => p.entity.location.coordinates),
      },
    })
  }

  return {
    type: 'FeatureCollection',
    features,
  }
})

const pointFilter = ['==', ['geometry-type'], 'Point']
const lineFilter = ['==', ['geometry-type'], 'LineString']

const activePopup = ref<{
  coordinates: [number, number]
  content: string
  id: string
} | null>(null)

const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

const openPopupById = (id: string, fly?: boolean) => {
  const pointData = pointsDictionary.value[id]
  if (!pointData) return

  const truncatedDescription = truncateText(pointData.description, 100)

  activePopup.value = {
    coordinates: [...pointData.coordinates],
    content: `
      <div class="map-popup">
        <h4><strong>${pointData.title}</strong></h4>
        ${truncatedDescription ? `<p>${truncatedDescription}</p>` : ''}
      </div>
    `,
    id: id,
  }

  if (!fly) return
  flyToPointById(id)
}

const flyToPointById = (id: string) => {
  const pointData = pointsDictionary.value[id]
  if (!pointData) return

  const map = mapRef.value?.map
  if (map) {
    map.flyTo({
      center: pointData.coordinates,
      zoom: 14,
      essential: true,
      duration: 1000,
    })
  }
}

// Map click handler
const handleMapClick = async (e: any) => {
  const map = mapRef.value?.map
  if (!map) return

  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points', 'point-labels'],
  })

  if (features.length > 0) {
    const pointFeature = features[0]
    const clickedId = pointFeature.properties?.id

    if (clickedId) {
      emit('marker-click', clickedId)
      openPopupById(clickedId)
    }
  } else {
    activePopup.value = null
  }
}

const closePopup = () => {
  activePopup.value = null
}

onMounted(() => {
  const map = mapRef.value?.map
  if (!map) return

  try {
    map.on('click', handleMapClick)

    map.on('mouseenter', ['points', 'point-labels'], () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', ['points', 'point-labels'], () => {
      map.getCanvas().style.cursor = ''
    })
  } catch (error) {
    console.error('Ошибка подписки на события карты:', error)
  }
})

onUnmounted(() => {
  if (mapRef.value?.map) {
    mapRef.value.map.off('click', handleMapClick)
  }
})

defineExpose({
  openPopupById,
  flyToPointById,
  resetView,
})
</script>

<template>
  <div
    ref="mapContainer"
    class="flex flex-col size-full z-2 relative overflow-hidden rounded-md bg-neutral-100"
    :style="containerStyle"
  >
    <div class="flex flex-col size-full z-1 absolute h-full inset-0">
      <MglMap ref="mapRef" :map-style="mapStyle" :center="mapParams.center" :zoom="mapParams.zoom">
        <MglNavigationControl />
        <MglGeoJsonSource source-id="route" :data="routeData">
          <MglLineLayer
            v-if="props.points.length >= 2"
            layer-id="line"
            source="route"
            :filter="lineFilter"
            :paint="props.linePaint"
            :layout="props.lineLayout"
          />
          <MglCircleLayer
            layer-id="points"
            source="route"
            :filter="pointFilter"
            :paint="props.circlePaint"
          />
          <MglSymbolLayer
            layer-id="point-labels"
            source="route"
            :filter="pointFilter"
            :layout="{
              'text-field': ['get', 'index'],
              'text-size': 12,
              'text-font': ['Open Sans Bold'],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            }"
            :paint="{
              'text-color': '#fff',
              'text-halo-color': '#000',
              'text-halo-width': 0,
            }"
          />
        </MglGeoJsonSource>

        <MglPopup
          v-if="activePopup"
          :coordinates="activePopup.coordinates"
          :close-button="true"
          :close-on-click="false"
          @close="closePopup"
        >
          <div v-html="activePopup.content"></div>
        </MglPopup>
      </MglMap>
    </div>
  </div>
</template>

<style lang="css">
@import 'maplibre-gl/dist/maplibre-gl.css';

.maplibregl-popup-content {
  border-radius: 12px;
  padding: 16px;
}
.maplibregl-popup-close-button {
  padding: 4px 8px;
  font-size: 16px;
}
.map-popup {
  margin: 8px 0 0 0;
  min-width: 120px;
  max-width: 240px;
}
.map-popup h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}
.map-popup p {
  margin: 4px 0;
  font-size: 14px;
}
</style>
