import { defineStore } from 'pinia';
import {ref, computed, watch} from 'vue';
import api from '@/api/httpClient';
import deepEqual from 'deep-equal';

const blankFilters = {
    searchString: {param: 'filter[title]', value: ''},
    dayCount: {param: '', value: ''},
    pilCount: {param: '', value: ''},
    tourTypeId: {param: 'filter[tourType.id]', value: 0},
    tourCategoryId: {param: 'filter[tourCategory.id]', value: 0},
    tourTransportId: {param: 'filter[tourTransport.id]', value: 0},
    tourStatusId: {param: 'filter[tourStatus.id]', value: 0},
    priceMin: {param: 'filter[price][min]', value: 0},
    priceMax: {param: 'filter[price][max]', value: 0},
};

export const useToursStore = defineStore('toursStore', () =>{
    
    const tourParams = ref({});
    const tourTypes = ref([]);
    const tourCategories = ref([]);
    const tourTransports = ref([]);
    const tourStatuses = ref([]);
    const queryFilters = ref({});

    const filtered = computed(() => !deepEqual(queryFilters.value, blankFilters));

    async function getTourParams() {
        const {data} = await api.get('/manage/tours/parameters');
        tourTypes.value = data.data.find(item => item.slug === 'tour-types').children;
        tourCategories.value = data.data.find(item => item.slug === 'tour-categories').children;
        tourTransports.value = data.data.find(item => item.slug === 'tour-transports').children;
        tourStatuses.value = data.data.find(item => item.slug === 'tour-statuses').children;
        tourParams.value = data.data;
    }

    function resetQueryFilters() {
        queryFilters.value = structuredClone(blankFilters);
    }

    async function init() {
        try {
            resetQueryFilters();
            await getTourParams();
        } catch (e) {
            console.error(e.toString());
        }
    }

    init();

    return {
        tourTypes,
        tourCategories,
        tourTransports,
        tourStatuses,
        queryFilters,
        filtered,
        resetQueryFilters,
    };
});


