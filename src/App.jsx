import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Filters from './components/Filters';
import PriceTable from './components/PriceTable';
import Loader from './components/Loader';

// Translations
const translations = {
    en: {
        appTitle: 'Mandi Sathi',
        appSubtitle: 'Farmer Crop Price Checker',
        district: 'District',
        commodity: 'Commodity',
        allDistricts: 'All Districts',
        allCommodities: 'All Commodities',
        getPrices: 'Get Prices',
        searching: 'Searching...',
        refresh: 'Refresh',
        clear: 'Clear',
        noData: 'No data available',
        noDataHint: 'Select a district and commodity to view prices',
        searchInResults: 'Search in results...',
        showing: 'Showing',
        of: 'of',
        results: 'results',
        noResultsMatch: 'No results match your search',
        offlineWarning: 'You are offline. Showing cached data.',
        error: 'Failed to fetch prices. Please try again.',
        tryAgain: 'Try again',
        market: 'Market',
        minPrice: 'Min',
        maxPrice: 'Max',
        modalPrice: 'Modal',
        date: 'Date',
        footer: 'Data Source: data.gov.in • Agricultural Marketing Information System',
        footer2: 'Mandi Sathi © 2026 • Empowering Farmers'
    },
    hi: {
        appTitle: 'मंडी साथी',
        appSubtitle: 'किसान फसल मूल्य जांचक',
        district: 'जिला',
        commodity: 'फसल',
        allDistricts: 'सभी जिले',
        allCommodities: 'सभी फसलें',
        getPrices: 'भाव देखें',
        searching: 'खोज रहे हैं...',
        refresh: 'रिफ्रेश',
        clear: 'साफ करें',
        noData: 'कोई डेटा नहीं',
        noDataHint: 'भाव देखने के लिए जिला और फसल चुनें',
        searchInResults: 'परिणाम में खोजें...',
        showing: 'दिखा रहे हैं',
        of: 'में से',
        results: 'परिणाम',
        noResultsMatch: 'आपकी खोज से कोई परिणाम नहीं मिला',
        offlineWarning: 'आप ऑफलाइन हैं। कैश्ड डेटा दिखा रहे हैं।',
        error: 'भाव लाने में विफल। कृपया पुनः प्रयास करें।',
        tryAgain: 'पुनः प्रयास करें',
        market: 'मंडी',
        minPrice: 'न्यूनतम',
        maxPrice: 'अधिकतम',
        modalPrice: 'मॉडल',
        date: 'तारीख',
        footer: 'डेटा स्रोत: data.gov.in • कृषि विपणन सूचना प्रणाली',
        footer2: 'मंडी साथी © 2026 • किसानों को सशक्त बनाना'
    }
};

// Uttar Pradesh Districts with Hindi names
const UP_DISTRICTS = [
    { en: 'Agra', hi: 'आगरा' }, { en: 'Aligarh', hi: 'अलीगढ़' }, { en: 'Allahabad', hi: 'इलाहाबाद' }, { en: 'Ambedkar Nagar', hi: 'अम्बेडकर नगर' }, { en: 'Amethi', hi: 'अमेठी' }, { en: 'Amroha', hi: 'अमरोहा' }, { en: 'Auraiya', hi: 'औरैया' },
    { en: 'Azamgarh', hi: 'आजमगढ़' }, { en: 'Baghpat', hi: 'बागपत' }, { en: 'Bahraich', hi: 'बहराइच' }, { en: 'Ballia', hi: 'बलिया' }, { en: 'Balrampur', hi: 'बलरामपुर' }, { en: 'Banda', hi: 'बांदा' }, { en: 'Barabanki', hi: 'बाराबंकी' },
    { en: 'Bareilly', hi: 'बरेली' }, { en: 'Basti', hi: 'बस्ती' }, { en: 'Bhadohi', hi: 'भदोही' }, { en: 'Bijnor', hi: 'बिजनौर' }, { en: 'Budaun', hi: 'बदायूं' }, { en: 'Bulandshahr', hi: 'बुलंदशहर' }, { en: 'Chandauli', hi: 'चandauli' },
    { en: 'Chitrakoot', hi: 'चित्रकूट' }, { en: 'Deoria', hi: 'देओरिया' }, { en: 'Etah', hi: 'एटा' }, { en: 'Etawah', hi: 'एटावा' }, { en: 'Faizabad', hi: 'फैजाबाद' }, { en: 'Farrukhabad', hi: 'फर्रुखाबाद' }, { en: 'Fatehpur', hi: 'फतेहपुर' },
    { en: 'Firozabad', hi: 'फिरोजाबाद' }, { en: 'Gautam Buddha Nagar', hi: 'गौतम बुद्ध नगर' }, { en: 'Ghaziabad', hi: 'गाज़ियाबाद' }, { en: 'Ghazipur', hi: 'गाजीपुर' }, { en: 'Gonda', hi: 'गोंडा' }, { en: 'Gorakhpur', hi: 'गोरखपुर' },
    { en: 'Hamirpur', hi: 'हमीरपुर' }, { en: 'Hapur', hi: 'हापुड़' }, { en: 'Hardoi', hi: 'हरदोई' }, { en: 'Hathras', hi: 'हाथरस' }, { en: 'Jalaun', hi: 'जालौन' }, { en: 'Jaunpur', hi: 'जौनपुर' }, { en: 'Jhansi', hi: 'झांसी' },
    { en: 'Kannauj', hi: 'कन्नौज' }, { en: 'Kanpur Dehat', hi: 'कानपुर देहात' }, { en: 'Kanpur Nagar', hi: 'कानपुर नगर' }, { en: 'Kasganj', hi: 'कासगंज' }, { en: 'Kaushambi', hi: 'कौशाम्बी' }, { en: 'Kheri', hi: 'खीरी' },
    { en: 'Kushinagar', hi: 'कुशीनगर' }, { en: 'Lalitpur', hi: 'ललितपुर' }, { en: 'Lucknow', hi: 'लखनऊ' }, { en: 'Maharajganj', hi: 'महाराजगंज' }, { en: 'Mahoba', hi: 'महोबा' }, { en: 'Mainpuri', hi: 'मैनपुरी' },
    { en: 'Mathura', hi: 'मथुरा' }, { en: 'Mau', hi: 'मऊ' }, { en: 'Meerut', hi: 'मेरठ' }, { en: 'Mirzapur', hi: 'मिर्ज़ापुर' }, { en: 'Moradabad', hi: 'मुरादाबाद' }, { en: 'Muzaffarnagar', hi: 'मुज़फ़्फ़रनगर' },
    { en: 'Pilibhit', hi: 'पीलीभीत' }, { en: 'Pratapgarh', hi: 'प्रतापगढ़' }, { en: 'Rae Bareli', hi: 'राय बरेली' }, { en: 'Rampur', hi: 'रामपुर' }, { en: 'Saharanpur', hi: 'सहारनपुर' }, { en: 'Sambhal', hi: 'संभल' },
    { en: 'Sant Kabir Nagar', hi: 'संत कबीर नगर' }, { en: 'Sant Ravidas Nagar', hi: 'संत रविदास नगर' }, { en: 'Shahjahanpur', hi: 'शाहजहांपुर' }, { en: 'Shamli', hi: 'शामली' }, { en: 'Siddharthnagar', hi: 'सिद्धार्थनगर' },
    { en: 'Sitapur', hi: 'सीतापुर' }, { en: 'Sonbhadra', hi: 'सोनभद्र' }, { en: 'Sultanpur', hi: 'सुल्तानपुर' }, { en: 'Unnao', hi: 'उन्नाव' }, { en: 'Varanasi', hi: 'वाराणसी' }
];

// Common commodities in UP Mandis with Hindi names
const COMMODITIES = [
    { en: 'Wheat', hi: 'गेहूं' }, { en: 'Rice', hi: 'चावल' }, { en: 'Sugarcane', hi: 'गन्ना' }, { en: 'Potato', hi: 'आलू' }, { en: 'Onion', hi: 'प्याज' }, { en: 'Tomato', hi: 'टमाटर' }, { en: 'Mustard', hi: 'सरसों' },
    { en: 'Gram', hi: 'चना' }, { en: 'Masoor', hi: 'मसूर' }, { en: 'Moong', hi: 'मूंग' }, { en: 'Urad', hi: 'उड़द' }, { en: 'Arhar', hi: 'अरहर' }, { en: 'Maize', hi: 'मक्का' }, { en: 'Bajra', hi: 'बाजरा' }, { en: 'Jowar', hi: 'ज्वार' },
    { en: 'Groundnut', hi: 'मूंगफली' }, { en: 'Sunflower', hi: 'सूरजमुखी' }, { en: 'Soybean', hi: 'सोयाबीन' }, { en: 'Cotton', hi: 'कपास' }, { en: 'Tobacco', hi: 'तंबाकू' }, { en: 'Turmeric', hi: 'हल्दी' },
    { en: 'Ginger', hi: 'अदरक' }, { en: 'Garlic', hi: 'लहसुन' }, { en: 'Green Chilli', hi: 'हरी मिर्च' }, { en: 'Cauliflower', hi: 'फूलगोभी' }, { en: 'Cabbage', hi: 'पत्ता गोभी' }, { en: 'Carrot', hi: 'गाजर' },
    { en: 'Radish', hi: 'मूली' }, { en: 'Spinach', hi: 'पालक' }, { en: 'Brinjal', hi: 'बैंगन' }, { en: 'Okra', hi: 'भिंडी' }, { en: 'Pumpkin', hi: 'कद्दू' }, { en: 'Bottle Gourd', hi: 'लौकी' },
    { en: 'Coriander', hi: 'धनिया' }, { en: 'Fenugreek', hi: 'मेथी' }, { en: 'Mint', hi: 'पुदीना' }, { en: 'Pomegranate', hi: 'अनार' }, { en: 'Banana', hi: 'केला' }, { en: 'Mango', hi: 'आम' },
    { en: 'Guava', hi: 'अमरूद' }, { en: 'Grape', hi: 'अंगूर' }, { en: 'Apple', hi: 'सेब' }, { en: 'Orange', hi: 'संतरा' }, { en: 'Papaya', hi: 'पपीता' }, { en: 'Watermelon', hi: 'तरबूज' }
];

const CACHE_KEY = 'mandi_sathi_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('mandi_dark_mode');
        return saved ? JSON.parse(saved) : false;
    });

    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('mandi_language');
        return saved || 'en';
    });

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommodity, setSelectedCommodity] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Initialize dark mode
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('mandi_dark_mode', JSON.stringify(darkMode));
    }, [darkMode]);

    // Initialize language
    useEffect(() => {
        localStorage.setItem('mandi_language', language);
    }, [language]);

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Load cached data on mount
    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const { data: cachedData, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setData(cachedData);
                }
            } catch (e) {
                console.error('Error loading cached data:', e);
            }
        }
    }, []);

    // Save to cache when data changes
    useEffect(() => {
        if (data.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        }
    }, [data]);

    const fetchPrices = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const apiUrl = import.meta.env.VITE_API_URL;

            if (!apiKey || !apiUrl) {
                throw new Error('API configuration missing');
            }

            // Build query parameters
            const params = new URLSearchParams({
                'api-key': apiKey,
                format: 'json',
                'filters[state.keyword]': 'Uttar Pradesh',
                limit: '1000'
            });

            if (selectedDistrict) {
                params.append('filters[district.keyword]', selectedDistrict);
            }
            if (selectedCommodity) {
                params.append('filters[commodity.keyword]', selectedCommodity);
            }

            const response = await axios.get(`${apiUrl}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.data && response.data.records) {
                setData(response.data.records);
            } else if (response.data && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (err) {
            console.error('API Error:', err);
            setError(err.message || 'Failed to fetch prices. Please try again.');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDistrict, selectedCommodity]);

    const handleSearch = () => {
        fetchPrices();
    };

    const handleRefresh = () => {
        fetchPrices();
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    // Extract unique districts and commodities from data for dropdowns
    const availableDistricts = data.length > 0
        ? [...new Set(data.map(item => item.district).filter(Boolean))].sort()
        : UP_DISTRICTS.map(d => d.en);

    const availableCommodities = data.length > 0
        ? [...new Set(data.map(item => item.commodity).filter(Boolean))].sort()
        : COMMODITIES.map(c => c.en);

    // Get display name based on language
    const getDistrictName = (district) => {
        const found = UP_DISTRICTS.find(d => d.en === district);
        return found ? (language === 'hi' ? found.hi : found.en) : district;
    };

    const getCommodityName = (commodity) => {
        const found = COMMODITIES.find(c => c.en === commodity);
        return found ? (language === 'hi' ? found.hi : found.en) : commodity;
    };

    const t = translations[language];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                language={language}
                setLanguage={setLanguage}
                translations={translations}
            />

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Offline Warning */}
                {isOffline && (
                    <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 rounded-lg flex items-center gap-2">
                        <span className="text-yellow-800 dark:text-yellow-200">
                            ⚠️ {t.offlineWarning}
                        </span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
                        >
                            {t.tryAgain}
                        </button>
                    </div>
                )}

                {/* Filters */}
                <Filters
                    districts={availableDistricts}
                    commodities={availableCommodities}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedCommodity={selectedCommodity}
                    setSelectedCommodity={setSelectedCommodity}
                    onSearch={handleSearch}
                    loading={loading}
                    onRefresh={handleRefresh}
                    language={language}
                    setLanguage={setLanguage}
                    translations={translations}
                    getDistrictName={getDistrictName}
                    getCommodityName={getCommodityName}
                />

                {/* Results */}
                {loading ? (
                    <Loader />
                ) : (
                    <PriceTable data={data} language={language} translations={translations} />
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>{t.footer}</p>
                    <p className="mt-1">{t.footer2}</p>
                </footer>
            </main>
        </div>
    );
}

export default App;