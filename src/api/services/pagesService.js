/**
 * Pages Service Module
 *
 * Handles API requests related to WordPress pages.
 *
 * @module api/services/pagesService
 * @since 1.0.0
 * @package Quick Cart Shopping
 */

import apiClient from '@/api/apiClient';

/**
 * Fetches all published WordPress pages
 *
 * Makes a GET request to the pages endpoint to retrieve
 * all published pages with their ID and title.
 *
 * @async
 * @function pagesService
 * @returns {Promise<Array<{label: string, value: number}>>} Array of page objects
 * @throws {Error} If the API request fails
 *
 * @example
 * const pages = await pagesService()
 * // Returns: [{ label: 'About', value: 42 }, { label: 'Contact', value: 43 }]
 */
export const pagesService = () => apiClient.get('/pages');
