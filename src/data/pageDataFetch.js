/**
 * Pages Data Fetch Module
 *
 * Provides shared state management for WordPress pages data.
 * Fetches pages from the REST API and caches them for reuse across components.
 *
 * @module data/pageDataFetch
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import { ref } from 'vue';
import { pagesService } from '@/api/services/pagesService';

/**
 * Reactive reference holding the list of pages
 * @type {import('vue').Ref<Array<{label: string, value: number}>>}
 */
export const pagesData = ref([]);

/**
 * Reactive reference indicating loading state
 * @type {import('vue').Ref<boolean>}
 */
export const isLoadingPagesData = ref(false);

/**
 * Reactive reference holding any error that occurred during fetch
 * @type {import('vue').Ref<Error|null>}
 */
export const pagesDataError = ref(null);

/**
 * Loads WordPress pages from the REST API
 *
 * Fetches all published pages and transforms them into a format
 * suitable for select dropdowns. Updates the shared reactive state
 * with the results.
 *
 * @async
 * @function loadPagesData
 * @returns {Promise<void>}
 * @throws {Error} If the API request fails
 *
 * @example
 * // In a Vue component
 * import { loadPagesData, pagesData } from '@/data/pageDataFetch'
 *
 * onMounted(() => {
 *   loadPagesData()
 * })
 */
export const loadPagesData = async () => {
  isLoadingPagesData.value = true;
  pagesDataError.value = null;

  try {
    const pages = await pagesService();

    pagesData.value = (pages || []).map((p) => ({
      label: p.label,
      value: p.value,
    }));
  } catch (error) {
    console.error('Failed to load pages data:', error);
    pagesDataError.value = error;
    pagesData.value = [];
  } finally {
    isLoadingPagesData.value = false;
  }
};
