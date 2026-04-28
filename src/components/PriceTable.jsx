import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Calendar, MapPin, Wheat, DollarSign } from 'lucide-react';

const PriceTable = ({ data, language, translations }) => {
    const t = translations[language];
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Get unique values for filtering
    const allDistricts = useMemo(() => {
        const districts = [...new Set(data.map(item => item.district).filter(Boolean))];
        return districts.sort();
    }, [data]);

    const allCommodities = useMemo(() => {
        const commodities = [...new Set(data.map(item => item.commodity).filter(Boolean))];
        return commodities.sort();
    }, [data]);

    // Filter and sort data
    const filteredData = useMemo(() => {
        let result = [...data];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.commodity?.toLowerCase().includes(term) ||
                item.district?.toLowerCase().includes(term) ||
                item.market?.toLowerCase().includes(term)
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                // Handle numeric values
                if (['min_price', 'max_price', 'modal_price'].includes(sortConfig.key)) {
                    aVal = parseFloat(aVal) || 0;
                    bVal = parseFloat(bVal) || 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ArrowUpDown className="w-4 h-4 ml-1 inline opacity-50" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-4 h-4 ml-1 inline text-primary-600" />
            : <ArrowDown className="w-4 h-4 ml-1 inline text-primary-600" />;
    };

    const formatPrice = (price) => {
        if (!price || price === '0' || price === '') return '-';
        return `₹${parseFloat(price).toLocaleString('en-IN')}`;
    };

    const formatDate = (date) => {
        if (!date) return '-';
        try {
            // Handle various date formats from API
            let parsedDate;
            if (typeof date === 'string') {
                // Try different date formats
                if (date.includes('/')) {
                    // DD/MM/YYYY format
                    const parts = date.split('/');
                    if (parts.length === 3) {
                        parsedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                    }
                } else if (date.includes('-')) {
                    // YYYY-MM-DD or DD-MM-YYYY format
                    const parts = date.split('-');
                    if (parts[0].length === 4) {
                        parsedDate = new Date(date);
                    } else {
                        parsedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                    }
                } else {
                    parsedDate = new Date(date);
                }
            } else {
                parsedDate = new Date(date);
            }

            if (isNaN(parsedDate.getTime())) return date;

            return parsedDate.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return date;
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Wheat className="w-16 h-16 mx-auto opacity-50" />
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.noData}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    {t.noDataHint}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            {/* Search and Stats Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t.searchInResults}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t.showing} <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> {t.of}{' '}
                        <span className="font-medium text-gray-900 dark:text-white">{data.length}</span> {t.results}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="price-table">
                    <thead>
                        <tr>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('commodity')}
                            >
                                <Wheat className="w-4 h-4 inline mr-1" />
                                {t.commodity} <SortIcon columnKey="commodity" />
                            </th>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('district')}
                            >
                                <MapPin className="w-4 h-4 inline mr-1" />
                                {t.district} <SortIcon columnKey="district" />
                            </th>
                            <th>{t.market}</th>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('min_price')}
                            >
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                {t.minPrice} <SortIcon columnKey="min_price" />
                            </th>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('max_price')}
                            >
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                {t.maxPrice} <SortIcon columnKey="max_price" />
                            </th>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('modal_price')}
                            >
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                {t.modalPrice} <SortIcon columnKey="modal_price" />
                            </th>
                            <th
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleSort('arrival_date')}
                            >
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {t.date} <SortIcon columnKey="arrival_date" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="animate-fadeIn">
                                <td className="font-medium text-gray-900 dark:text-white">
                                    {item.commodity || '-'}
                                </td>
                                <td className="text-gray-600 dark:text-gray-300">
                                    {item.district || '-'}
                                </td>
                                <td className="text-gray-600 dark:text-gray-300">
                                    {item.market || '-'}
                                </td>
                                <td className="text-primary-600 dark:text-primary-400 font-medium">
                                    {formatPrice(item.min_price)}
                                </td>
                                <td className="text-primary-600 dark:text-primary-400 font-medium">
                                    {formatPrice(item.max_price)}
                                </td>
                                <td className="text-primary-700 dark:text-primary-300 font-semibold">
                                    {formatPrice(item.modal_price)}
                                </td>
                                <td className="text-gray-500 dark:text-gray-400 text-sm">
                                    {formatDate(item.date)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredData.length === 0 && searchTerm && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {t.noResultsMatch}
                </div>
            )}
        </div>
    );
};

export default PriceTable;