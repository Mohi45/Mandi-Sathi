// API Service for Mandi Sathi
// Uses data.gov.in API for agricultural market prices

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch prices from the data.gov.in API
 * @param {string} district - District name filter
 * @param {string} commodity - Commodity name filter
 * @returns {Promise<Array>} - Array of price records
 */
export async function fetchPrices(district = '', commodity = '') {
    if (!API_KEY || !API_URL) {
        throw new Error('API configuration missing. Please check .env file.');
    }

    // Build query parameters according to data.gov.in API format
    const params = new URLSearchParams({
        'api-key': API_KEY,
        format: 'json',
        'filters[state.keyword]': 'Uttar Pradesh',
        limit: '1000'
    });

    // Add optional filters
    if (district && district.trim()) {
        params.append('filters[district.keyword]', district.trim());
    }
    if (commodity && commodity.trim()) {
        params.append('filters[commodity.keyword]', commodity.trim());
    }

    const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.records || !Array.isArray(result.records)) {
        return [];
    }

    // Transform and clean the data
    return result.records.map(record => ({
        // Normalize field names
        state: record.state || '',
        district: record.district || '',
        market: record.market || '',
        commodity: record.commodity || '',
        variety: record.variety || '',
        min_price: record.min_price || record.min_price === 0 ? String(record.min_price) : '',
        max_price: record.max_price || record.max_price === 0 ? String(record.max_price) : '',
        modal_price: record.modal_price || record.modal_price === 0 ? String(record.modal_price) : '',
        date: record.arrival_date || record.date || '',
        unit: record.unit || 'Quintal'
    }));
}

/**
 * Get unique districts from the data
 * @param {Array} data - Array of price records
 * @returns {Array} - Sorted array of unique districts
 */
export function extractDistricts(data) {
    const districts = [...new Set(data.map(item => item.district).filter(Boolean))];
    return districts.sort();
}

/**
 * Get unique commodities from the data
 * @param {Array} data - Array of price records
 * @returns {Array} - Sorted array of unique commodities
 */
export function extractCommodities(data) {
    const commodities = [...new Set(data.map(item => item.commodity).filter(Boolean))];
    return commodities.sort();
}