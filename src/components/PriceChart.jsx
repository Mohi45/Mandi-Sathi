// Price Trend Chart Component using Recharts
import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { TrendingUp, X } from 'lucide-react';

const PriceChart = ({ data, language, translations }) => {
    const [showChart, setShowChart] = useState(false);
    const t = translations[language];

    // Process and sort data for chart
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Group by date and commodity, take average of modal prices
        const grouped = {};

        data.forEach(item => {
            if (!item.date || !item.modal_price) return;

            // Parse date
            let parsedDate;
            try {
                const dateStr = item.date;
                if (dateStr.includes('/')) {
                    const parts = dateStr.split('/');
                    if (parts.length === 3) {
                        parsedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                    }
                } else if (dateStr.includes('-')) {
                    const parts = dateStr.split('-');
                    if (parts[0].length === 4) {
                        parsedDate = new Date(dateStr);
                    } else {
                        parsedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                    }
                } else {
                    parsedDate = new Date(dateStr);
                }

                if (isNaN(parsedDate.getTime())) return;

                const dateKey = parsedDate.toISOString().split('T')[0];
                const commodity = item.commodity || 'Unknown';
                const key = `${dateKey}-${commodity}`;

                if (!grouped[key]) {
                    grouped[key] = {
                        date: dateKey,
                        dateDisplay: parsedDate.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }),
                        commodity,
                        prices: [],
                        minPrice: Infinity,
                        maxPrice: 0
                    };
                }

                const price = parseFloat(item.modal_price) || 0;
                if (price > 0) {
                    grouped[key].prices.push(price);
                    grouped[key].minPrice = Math.min(grouped[key].minPrice, price);
                    grouped[key].maxPrice = Math.max(grouped[key].maxPrice, price);
                }
            } catch (e) {
                // Skip invalid dates
            }
        });

        // Convert to array and calculate averages
        const result = Object.values(grouped)
            .filter(item => item.prices.length > 0)
            .map(item => ({
                ...item,
                avgPrice: Math.round(item.prices.reduce((a, b) => a + b, 0) / item.prices.length),
                minPrice: item.minPrice === Infinity ? 0 : item.minPrice,
                maxPrice: item.maxPrice
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return result;
    }, [data]);

    // Get unique commodities for legend
    const commodities = useMemo(() => {
        return [...new Set(chartData.map(d => d.commodity))].slice(0, 5); // Limit to 5
    }, [chartData]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: ₹{entry.value?.toLocaleString('en-IN')}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) return null;

    return (
        <div className="mb-6">
            {/* Toggle Button */}
            <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 font-medium rounded-lg transition-colors"
            >
                <TrendingUp className="w-5 h-5" />
                {showChart ? t.hideTrend : t.showTrend}
            </button>

            {/* Chart */}
            {showChart && chartData.length > 0 && (
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t.priceTrend}
                        </h3>
                        <button
                            onClick={() => setShowChart(false)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                    className="dark:stroke-gray-700"
                                />
                                <XAxis
                                    dataKey="dateDisplay"
                                    tick={{ fontSize: 10 }}
                                    stroke="#9ca3af"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    stroke="#9ca3af"
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="avgPrice"
                                    name={t.modalPrice}
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    dot={{ fill: '#16a34a', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalRecords}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{data.length}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.minPrice}</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₹{Math.min(...data.filter(d => d.modal_price).map(d => parseFloat(d.modal_price) || 0)).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.maxPrice}</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                ₹{Math.max(...data.filter(d => d.modal_price).map(d => parseFloat(d.modal_price) || 0)).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t.avgPrice}</p>
                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                ₹{Math.round(data.filter(d => d.modal_price).reduce((sum, d) => sum + (parseFloat(d.modal_price) || 0), 0) / data.filter(d => d.modal_price).length).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showChart && chartData.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        {t.noTrendData}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PriceChart;