// Custom hook for managing price data with caching
import { useState, useEffect, useCallback } from 'react';
import { fetchPrices } from '../services/api';

const CACHE_KEY = 'mandi_sathi_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Custom hook for fetching and caching price data
 * @returns {Object} - State and functions for price data management
 */
export function usePriceData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

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

    // Monitor online/offline status
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

    // Fetch prices function
    const loadPrices = useCallback(async (district = '', commodity = '') => {
        setLoading(true);
        setError(null);

        try {
            const prices = await fetchPrices(district, commodity);
            setData(prices);
        } catch (err) {
            console.error('Error fetching prices:', err);
            setError(err.message || 'Failed to fetch prices. Please try again.');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh function
    const refresh = useCallback((district = '', commodity = '') => {
        return loadPrices(district, commodity);
    }, [loadPrices]);

    // Clear data
    const clearData = useCallback(() => {
        setData([]);
        setError(null);
    }, []);

    return {
        data,
        loading,
        error,
        isOffline,
        loadPrices,
        refresh,
        clearData
    };
}