import { Search, MapPin, Wheat, RefreshCw, X } from 'lucide-react';

const Filters = ({
    districts,
    commodities,
    selectedDistrict,
    setSelectedDistrict,
    selectedCommodity,
    setSelectedCommodity,
    onSearch,
    loading,
    onRefresh,
    language,
    setLanguage,
    translations,
    getDistrictName,
    getCommodityName
}) => {
    const t = translations[language];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Language Toggle */}
                <div className="flex items-end">
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        {language === 'en' ? '🇮🇳 हिंदी' : '🇮🇳 English'}
                    </button>
                </div>

                {/* District Select */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {t.district}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full px-3 py-2.5 pr-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">{t.allDistricts}</option>
                            {districts.map((district) => (
                                <option key={district} value={district}>
                                    {getDistrictName ? getDistrictName(district) : district}
                                </option>
                            ))}
                        </select>
                        {selectedDistrict && (
                            <button
                                onClick={() => setSelectedDistrict('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                title={t.clear}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Commodity Select */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Wheat className="w-4 h-4 inline mr-1" />
                        {t.commodity}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCommodity}
                            onChange={(e) => setSelectedCommodity(e.target.value)}
                            className="w-full px-3 py-2.5 pr-8 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="">{t.allCommodities}</option>
                            {commodities.map((commodity) => (
                                <option key={commodity} value={commodity}>
                                    {getCommodityName ? getCommodityName(commodity) : commodity}
                                </option>
                            ))}
                        </select>
                        {selectedCommodity && (
                            <button
                                onClick={() => setSelectedCommodity('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                title={t.clear}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <button
                        onClick={onSearch}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        {loading ? t.searching : t.getPrices}
                    </button>
                </div>

                {/* Refresh Button */}
                <div className="flex items-end">
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {t.refresh}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Filters;