<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
      'line-opacity': 0.9,
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
  return props.points.map((point) => ({
    ...point,
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

const popup = ref<any>(null)
const popupCoordinates = ref<[number, number] | null>(null)
const popupContent = ref('')

// Bounding box
const calculateViewport = () => {
  if (!normalizedPoints.value.length) return { center: [110.32128708, 65.53927338], zoom: 2 }

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

  return { center, zoom }
}

const mapParams = computed(calculateViewport)

// GeoJSON points
const routeData = computed(() => {
  const features = normalizedPoints.value.map((point, index) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: point.entity.location.coordinates, // Уже в правильном формате
    },
    properties: {
      id: point.entity.id,
      title: point.entity.title,
      description: point.entity.description,
      index: index + 1,
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

const handleMapClick = async (e: any) => {
  const map = mapRef.value?.map
  if (!map) return

  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points', 'point-labels'],
  })

  if (features.length > 0) {
    const pointFeature = features[0]
    const clickedId = pointFeature.properties?.id

    emit('marker-click', clickedId)

    const rawDescription = pointFeature.properties?.description || ''
    const truncatedDescription = truncateText(rawDescription, 100)

    activePopup.value = {
      coordinates: [...pointFeature.geometry.coordinates],
      content: `
        <div class="map-popup">
          <h4><strong>${pointFeature.properties?.title || 'Неизвестно'}</strong></h4>
          ${truncatedDescription ? `<p>${truncatedDescription}</p>` : ''}
          <p>Пункт: ${pointFeature.properties?.index || '—'}</p>
        </div>
      `,
      id: clickedId,
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
}
.maplibregl-popup-close-button {
  padding: 2px 8px;
}
.map-popup {
  padding: 8px;
  min-width: 120px;
  max-width: 240px;
}
</style>
