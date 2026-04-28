/**
 * Mandi Sathi - Static JavaScript
 * Farmer Crop Price Checker for Uttar Pradesh
 * Data Source: data.gov.in (Agricultural Marketing Information System)
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    API_URL: 'https://api.data.gov.in/cb0d6b11f40f4a73b4f5c3c8a4e3d9e0',
    API_BASE: 'https://api.data.gov.in',
    STATE: 'Uttar Pradesh',
    STATE_CODE: 'UP',
    PAGE_SIZE: 1000,
    CACHE_KEY: 'mandi_sathi_cache',
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
};

// ============================================
// Translations
// ============================================
const translations = {
    en: {
        appTitle: 'Mandi Sathi',
        appSubtitle: 'Farmer Crop Price Checker',
        district: 'District',
        commodity: 'Commodity',
        search: 'Get Prices',
        refresh: 'Refresh',
        clear: 'Clear',
        loading: 'Loading prices...',
        noData: 'No data available',
        noDataHint: 'Select a district and commodity to view prices',
        noResults: 'No results match your search',
        showing: 'Showing',
        of: 'of',
        results: 'results',
        error: 'Failed to fetch prices. Please try again.',
        tryAgain: 'Try again',
        offline: 'You are offline. Showing cached data.',
        footer: 'Data Source: data.gov.in • Agricultural Marketing Information System',
        footerCredit: 'Mandi Sathi © 2026 • Empowering Farmers By Safachatt Group',
        minPrice: 'Min',
        maxPrice: 'Max',
        modalPrice: 'Modal',
        market: 'Market',
        date: 'Date',
        allDistricts: 'All Districts',
        allCommodities: 'All Commodities',
        searchInResults: 'Search in results...',
    },
    hi: {
        appTitle: 'मंडी साथी',
        appSubtitle: 'किसान फसल मूल्य जांचकर्ता',
        district: 'जिला',
        commodity: 'फसल',
        search: 'भाव देखें',
        refresh: 'रिफ्रेश',
        clear: 'साफ करें',
        loading: 'भाव लोड हो रहे हैं...',
        noData: 'कोई डेटा उपलब्ध नहीं',
        noDataHint: 'भाव देखने के लिए जिला और फसल चुनें',
        noResults: 'आपकी खोज से कोई परिणाम नहीं मिला',
        showing: 'दिखा रहे हैं',
        of: 'में से',
        results: 'परिणाम',
        error: 'भाव लाने में विफल। कृपया पुनः प्रयास करें।',
        tryAgain: 'पुनः प्रयास करें',
        offline: 'आप ऑफलाइन हैं। कैश्ड डेटा दिखा रहे हैं।',
        footer: 'डेटा स्रोत: data.gov.in • कृषि विपणन सूचना प्रणाली',
        footerCredit: 'मंडी साथी © 2026 • सफाचट ग्रुप द्वारा किसानों को सशक्त बनाना',
        minPrice: 'न्यूनतम',
        maxPrice: 'अधिकतम',
        modalPrice: 'मॉडल',
        market: 'मंडी',
        date: 'तारीख',
        allDistricts: 'सभी जिले',
        allCommodities: 'सभी फसलें',
        searchInResults: 'परिणाम में खोजें...',
    }
};

// ============================================
// State
// ============================================
const state = {
    prices: [],
    filteredPrices: [],
    districts: [],
    commodities: [],
    selectedDistrict: '',
    selectedCommodity: '',
    searchQuery: '',
    sortColumn: 'date',
    sortDirection: 'desc',
    isLoading: false,
    error: null,
    isDarkMode: false,
    language: 'en',
    isOnline: navigator.onLine,
};

// ============================================
// DOM Elements
// ============================================
const elements = {
    // Header
    appTitle: document.getElementById('appTitle'),
    appSubtitle: document.getElementById('appSubtitle'),
    langToggle: document.getElementById('langToggle'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    sunIcon: document.getElementById('sunIcon'),
    moonIcon: document.getElementById('moonIcon'),

    // Filters
    districtSelect: document.getElementById('districtSelect'),
    commoditySelect: document.getElementById('commoditySelect'),
    clearDistrict: document.getElementById('clearDistrict'),
    clearCommodity: document.getElementById('clearCommodity'),
    searchBtn: document.getElementById('searchBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    clearBtn: document.getElementById('clearBtn'),

    // Labels
    districtLabel: document.getElementById('districtLabel'),
    commodityLabel: document.getElementById('commodityLabel'),
    searchBtnText: document.getElementById('searchBtnText'),
    refreshBtnText: document.getElementById('refreshBtnText'),
    clearBtnText: document.getElementById('clearBtnText'),

    // Status
    offlineWarning: document.getElementById('offlineWarning'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    loadingText: document.getElementById('loadingText'),

    // Results
    resultsInfo: document.getElementById('resultsInfo'),
    resultsCount: document.getElementById('resultsCount'),
    totalCount: document.getElementById('totalCount'),
    searchInResults: document.getElementById('searchInResults'),
    searchInput: document.getElementById('searchInput'),

    // Table
    priceTableContainer: document.getElementById('priceTableContainer'),
    priceTableBody: document.getElementById('priceTableBody'),

    // Headers
    commodityHeader: document.getElementById('commodityHeader'),
    districtHeader: document.getElementById('districtHeader'),
    marketHeader: document.getElementById('marketHeader'),
    minPriceHeader: document.getElementById('minPriceHeader'),
    maxPriceHeader: document.getElementById('maxPriceHeader'),
    modalPriceHeader: document.getElementById('modalPriceHeader'),
    dateHeader: document.getElementById('dateHeader'),

    // Messages
    noDataMessage: document.getElementById('noDataMessage'),
    noDataText: document.getElementById('noDataText'),
    noDataHint: document.getElementById('noDataHint'),
    noResultsMessage: document.getElementById('noResultsMessage'),

    // Footer
    footerText: document.getElementById('footerText'),
    footerText2: document.getElementById('footerText2'),
};

// ============================================
// Utility Functions
// ============================================
function formatPrice(price) {
    if (price === null || price === undefined || price === '') return '-';
    const num = parseFloat(price);
    if (isNaN(num)) return '-';
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Cache Functions
// ============================================
function getCache() {
    try {
        const cached = localStorage.getItem(CONFIG.CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > CONFIG.CACHE_DURATION) {
            localStorage.removeItem(CONFIG.CACHE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function setCache(data) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Failed to cache data:', e);
    }
}

// ============================================
// API Functions
// ============================================
async function fetchPrices() {
    const cache = getCache();
    if (cache) {
        console.log('Using cached data');
        return cache;
    }

    // Using the actual data.gov.in API
    const url = `${CONFIG.API_BASE}/cb0d6b11f40f4a73b4f5c3c8a4e3d9e0/api/market-data?state=${encodeURIComponent(CONFIG.STATE)}&format=json&fields=district,market,commodity,min_price,max_price,modal_price,arrival_date&size=${CONFIG.PAGE_SIZE}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.records) {
            const processedData = data.records.map(record => ({
                ...record,
                date: record.arrival_date || record.date
            }));
            setCache(processedData);
            return processedData;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch prices:', error);
        throw error;
    }
}

// ============================================
// Data Processing
// ============================================
function processData(prices) {
    // Extract unique districts
    const districtSet = new Set();
    const commoditySet = new Set();

    prices.forEach(price => {
        if (price.district) districtSet.add(price.district.trim());
        if (price.commodity) commoditySet.add(price.commodity.trim());
    });

    state.districts = Array.from(districtSet).sort();
    state.commodities = Array.from(commoditySet).sort();

    return prices;
}

function filterPrices() {
    let filtered = [...state.prices];

    // Filter by district
    if (state.selectedDistrict) {
        filtered = filtered.filter(p =>
            p.district && p.district.toLowerCase() === state.selectedDistrict.toLowerCase()
        );
    }

    // Filter by commodity
    if (state.selectedCommodity) {
        filtered = filtered.filter(p =>
            p.commodity && p.commodity.toLowerCase() === state.selectedCommodity.toLowerCase()
        );
    }

    // Filter by search query
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            (p.commodity && p.commodity.toLowerCase().includes(query)) ||
            (p.district && p.district.toLowerCase().includes(query)) ||
            (p.market && p.market.toLowerCase().includes(query))
        );
    }

    // Sort
    filtered.sort((a, b) => {
        let aVal = a[state.sortColumn];
        let bVal = b[state.sortColumn];

        // Handle numeric sorting
        if (['min_price', 'max_price', 'modal_price'].includes(state.sortColumn)) {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        } else if (state.sortColumn === 'date') {
            aVal = new Date(aVal) || new Date(0);
            bVal = new Date(bVal) || new Date(0);
        } else {
            aVal = (aVal || '').toString().toLowerCase();
            bVal = (bVal || '').toString().toLowerCase();
        }

        if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    state.filteredPrices = filtered;
}

// ============================================
// UI Rendering
// ============================================
function renderFilters() {
    const t = translations[state.language];

    // Clear and populate district select
    elements.districtSelect.innerHTML = `<option value="">${t.allDistricts}</option>`;
    state.districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        if (district === state.selectedDistrict) option.selected = true;
        elements.districtSelect.appendChild(option);
    });

    // Clear and populate commodity select
    elements.commoditySelect.innerHTML = `<option value="">${t.allCommodities}</option>`;
    state.commodities.forEach(commodity => {
        const option = document.createElement('option');
        option.value = commodity;
        option.textContent = commodity;
        if (commodity === state.selectedCommodity) option.selected = true;
        elements.commoditySelect.appendChild(option);
    });

    // Update clear buttons visibility
    elements.clearDistrict.classList.toggle('hidden', !state.selectedDistrict);
    elements.clearCommodity.classList.toggle('hidden', !state.selectedCommodity);
}

function renderTable() {
    const t = translations[state.language];
    const tbody = elements.priceTableBody;
    tbody.innerHTML = '';

    if (state.filteredPrices.length === 0) {
        elements.noDataMessage.classList.remove('hidden');
        elements.priceTableContainer.classList.add('hidden');
        elements.resultsInfo.classList.add('hidden');
        elements.searchInResults.classList.add('hidden');
        return;
    }

    elements.noDataMessage.classList.add('hidden');
    elements.priceTableContainer.classList.remove('hidden');
    elements.resultsInfo.classList.remove('hidden');
    elements.searchInResults.classList.remove('hidden');

    // Update results count
    elements.resultsCount.textContent = state.filteredPrices.length;
    elements.totalCount.textContent = state.prices.length;

    // Render rows
    state.filteredPrices.forEach((price, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="font-medium text-gray-900 dark:text-white">${price.commodity || '-'}</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">${price.district || '-'}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">${price.market || '-'}</td>
            <td class="px-4 py-3 whitespace-nowrap price-cell price-min">${formatPrice(price.min_price)}</td>
            <td class="px-4 py-3 whitespace-nowrap price-cell price-max">${formatPrice(price.max_price)}</td>
            <td class="px-4 py-3 whitespace-nowrap price-cell price-modal">${formatPrice(price.modal_price)}</td>
            <td class="px-4 py-3 whitespace-nowrap date-cell">${formatDate(price.date)}</td>
        `;
        tbody.appendChild(row);
    });
}

function updateLanguage() {
    const t = translations[state.language];

    // Update header
    elements.appTitle.textContent = t.appTitle;
    elements.appSubtitle.textContent = t.appSubtitle;
    elements.langToggle.textContent = state.language === 'en' ? 'हिंदी' : 'English';

    // Update labels
    elements.districtLabel.innerHTML = `
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        ${t.district}
    `;
    elements.commodityLabel.innerHTML = `
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        ${t.commodity}
    `;

    // Update buttons
    elements.searchBtnText.textContent = t.search;
    elements.refreshBtnText.textContent = t.refresh;
    elements.clearBtnText.textContent = t.clear;

    // Update table headers
    elements.commodityHeader.textContent = t.commodity;
    elements.districtHeader.textContent = t.district;
    elements.marketHeader.textContent = t.market;
    elements.minPriceHeader.textContent = t.minPrice;
    elements.maxPriceHeader.textContent = t.maxPrice;
    elements.modalPriceHeader.textContent = t.modalPrice;
    elements.dateHeader.textContent = t.date;

    // Update messages
    elements.loadingText.textContent = t.loading;
    elements.noDataText.textContent = t.noData;
    elements.noDataHint.textContent = t.noDataHint;
    elements.noResultsMessage.textContent = t.noResults;
    elements.errorText.textContent = t.error;
    elements.footerText.textContent = t.footer;
    elements.footerText2.textContent = t.footerCredit;
    elements.searchInput.placeholder = t.searchInResults;

    // Update selects
    renderFilters();
}

function updateDarkMode() {
    if (state.isDarkMode) {
        document.body.classList.add('dark');
        elements.sunIcon.classList.remove('hidden');
        elements.moonIcon.classList.add('hidden');
    } else {
        document.body.classList.remove('dark');
        elements.sunIcon.classList.add('hidden');
        elements.moonIcon.classList.remove('hidden');
    }

    // Save preference
    localStorage.setItem('mandi_sathi_dark_mode', state.isDarkMode);
}

function showLoading() {
    state.isLoading = true;
    elements.loadingSpinner.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
    elements.noDataMessage.classList.add('hidden');
    elements.priceTableContainer.classList.add('hidden');
    elements.resultsInfo.classList.add('hidden');
    elements.searchInResults.classList.add('hidden');
    elements.searchBtn.disabled = true;
    elements.refreshBtn.disabled = true;
}

function hideLoading() {
    state.isLoading = false;
    elements.loadingSpinner.classList.add('hidden');
    elements.searchBtn.disabled = false;
    elements.refreshBtn.disabled = false;
}

function showError(message) {
    state.error = message;
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.loadingSpinner.classList.add('hidden');
}

function hideError() {
    state.error = null;
    elements.errorMessage.classList.add('hidden');
}

// ============================================
// Event Handlers
// ============================================
async function handleSearch() {
    showLoading();
    hideError();

    try {
        state.prices = await fetchPrices();
        processData(state.prices);
        filterPrices();
        renderFilters();
        renderTable();
    } catch (error) {
        showError(translations[state.language].error);
    } finally {
        hideLoading();
    }
}

function handleRefresh() {
    localStorage.removeItem(CONFIG.CACHE_KEY);
    handleSearch();
}

function handleClear() {
    state.selectedDistrict = '';
    state.selectedCommodity = '';
    state.searchQuery = '';
    state.filteredPrices = [];

    elements.districtSelect.value = '';
    elements.commoditySelect.value = '';
    elements.searchInput.value = '';

    elements.clearDistrict.classList.add('hidden');
    elements.clearCommodity.classList.add('hidden');

    renderTable();
}

function handleDistrictChange(e) {
    state.selectedDistrict = e.target.value;
    elements.clearDistrict.classList.toggle('hidden', !state.selectedDistrict);
    filterPrices();
    renderTable();
}

function handleCommodityChange(e) {
    state.selectedCommodity = e.target.value;
    elements.clearCommodity.classList.toggle('hidden', !state.selectedCommodity);
    filterPrices();
    renderTable();
}

function handleSearchInput(e) {
    state.searchQuery = e.target.value;
    filterPrices();
    renderTable();
}

function handleSort(column) {
    if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        state.sortColumn = column;
        state.sortDirection = 'asc';
    }
    filterPrices();
    renderTable();
}

function handleLanguageToggle() {
    state.language = state.language === 'en' ? 'hi' : 'en';
    localStorage.setItem('mandi_sathi_language', state.language);
    updateLanguage();
    renderTable();
}

function handleDarkModeToggle() {
    state.isDarkMode = !state.isDarkMode;
    updateDarkMode();
}

function handleOnlineStatus() {
    state.isOnline = navigator.onLine;
    elements.offlineWarning.classList.toggle('hidden', state.isOnline);

    if (!state.isOnline && state.prices.length === 0) {
        // Try to load from cache when going offline
        const cache = getCache();
        if (cache) {
            state.prices = cache;
            processData(state.prices);
            filterPrices();
            renderFilters();
            renderTable();
        }
    }
}

// ============================================
// Initialization
// ============================================
function init() {
    // Load saved preferences
    const savedDarkMode = localStorage.getItem('mandi_sathi_dark_mode');
    if (savedDarkMode === 'true') {
        state.isDarkMode = true;
    }

    const savedLanguage = localStorage.getItem('mandi_sathi_language');
    if (savedLanguage) {
        state.language = savedLanguage;
    }

    // Apply initial theme
    updateDarkMode();
    updateLanguage();

    // Set up event listeners
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.refreshBtn.addEventListener('click', handleRefresh);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.tryAgainBtn.addEventListener('click', handleSearch);

    elements.districtSelect.addEventListener('change', handleDistrictChange);
    elements.commoditySelect.addEventListener('change', handleCommodityChange);

    elements.searchInput.addEventListener('input', debounce(handleSearchInput, 300));

    elements.clearDistrict.addEventListener('click', () => {
        state.selectedDistrict = '';
        elements.districtSelect.value = '';
        elements.clearDistrict.classList.add('hidden');
        filterPrices();
        renderTable();
    });

    elements.clearCommodity.addEventListener('click', () => {
        state.selectedCommodity = '';
        elements.commoditySelect.value = '';
        elements.clearCommodity.classList.add('hidden');
        filterPrices();
        renderTable();
    });

    // Sort handlers
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            handleSort(th.dataset.sort);
        });
    });

    elements.langToggle.addEventListener('click', handleLanguageToggle);
    elements.darkModeToggle.addEventListener('click', handleDarkModeToggle);

    // Online/offline detection
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    handleOnlineStatus();

    // Initial data load
    handleSearch();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);