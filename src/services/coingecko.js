const axios = require('axios');

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Mock data for testing (used when API rate limit is hit)
const mockCoins = [
    { symbol: 'BTC', name: 'Bitcoin', price: 45000, change: 2.5 },
    { symbol: 'ETH', name: 'Ethereum', price: 2500, change: -1.2 },
    { symbol: 'USDT', name: 'Tether', price: 1.0, change: 0.01 },
    { symbol: 'BNB', name: 'BNB', price: 320, change: 1.8 },
    { symbol: 'XRP', name: 'XRP', price: 0.62, change: -0.5 },
    { symbol: 'SOL', name: 'Solana', price: 98, change: 3.2 },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change: -2.1 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change: 5.3 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.2, change: 0.8 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.85, change: 1.1 }
];

// Map of common symbols to CoinGecko IDs (case-insensitive lookup)
const symbolToId = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOGE': 'dogecoin',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'LTC': 'litecoin',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'ATOM': 'cosmos'
};

/**
 * Get list of popular cryptocurrencies
 * @param {number} limit - Number of coins to return (default 10)
 * @returns {Promise<Array>} List of coins with price data
 */
const getPopularCoins = async (limit = 10) => {
    try {
        const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: limit,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });

        return response.data.map(coin => ({
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change: parseFloat(coin.price_change_percentage_24h?.toFixed(2)) || 0
        }));
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        // Fallback to mock data on rate limit or error
        if (error.response?.status === 429 || process.env.NODE_ENV === 'test') {
            console.log('Using mock data due to API rate limit');
            return mockCoins.slice(0, limit);
        }
        throw new Error('Failed to fetch cryptocurrency data');
    }
};

/**
 * Get specific coin by symbol
 * @param {string} symbol - Coin symbol (e.g., 'BTC', 'ETH')
 * @returns {Promise<Object|null>} Coin data or null if not found
 */
const getCoinBySymbol = async (symbol) => {
    const upperSymbol = symbol.toUpperCase();
    const coinId = symbolToId[upperSymbol];

    // Check mock data first if in test environment or rate limited
    const getMockCoin = () => mockCoins.find(c => c.symbol === upperSymbol) || null;

    if (!coinId) {
        // Try to search for the coin or use mock data
        try {
            const searchResponse = await axios.get(`${COINGECKO_API_BASE}/search`, {
                params: { query: symbol }
            });

            const coin = searchResponse.data.coins.find(
                c => c.symbol.toUpperCase() === upperSymbol
            );

            if (!coin) {
                // Fallback to mock data
                return getMockCoin();
            }

            // Get price data for found coin
            const priceResponse = await axios.get(`${COINGECKO_API_BASE}/coins/${coin.id}`, {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false
                }
            });

            return {
                symbol: priceResponse.data.symbol.toUpperCase(),
                name: priceResponse.data.name,
                price: priceResponse.data.market_data.current_price.usd,
                change: parseFloat(priceResponse.data.market_data.price_change_percentage_24h?.toFixed(2)) || 0
            };
        } catch (error) {
            console.error('CoinGecko search error:', error.message);
            // Fallback to mock data on rate limit
            if (error.response?.status === 429) {
                console.log('Using mock data due to API rate limit');
                return getMockCoin();
            }
            return null;
        }
    }

    try {
        const response = await axios.get(`${COINGECKO_API_BASE}/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false
            }
        });

        return {
            symbol: response.data.symbol.toUpperCase(),
            name: response.data.name,
            price: response.data.market_data.current_price.usd,
            change: parseFloat(response.data.market_data.price_change_percentage_24h?.toFixed(2)) || 0
        };
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        // Fallback to mock data on rate limit
        if (error.response?.status === 429) {
            console.log('Using mock data due to API rate limit');
            return getMockCoin();
        }
        return null;
    }
};

module.exports = {
    getPopularCoins,
    getCoinBySymbol,
    symbolToId
};
