const express = require('express');
const router = express.Router();
const coingecko = require('../services/coingecko');
const watchlist = require('../data/watchlist');

/**
 * GET /crypto
 * Get list of popular cryptocurrencies
 */
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const coins = await coingecko.getPopularCoins(limit);
        res.json(coins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /crypto/watchlist
 * Get user's watchlist
 */
router.get('/watchlist', (req, res) => {
    const list = watchlist.getWatchlist();
    res.json(list);
});

/**
 * GET /crypto/:symbol
 * Get specific coin by symbol
 */
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;

        if (!symbol || symbol.length < 2) {
            return res.status(400).json({ error: 'Invalid symbol' });
        }

        const coin = await coingecko.getCoinBySymbol(symbol);

        if (!coin) {
            return res.status(404).json({ error: `Coin with symbol '${symbol}' not found` });
        }

        res.json(coin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /crypto
 * Add a coin to the watchlist
 */
router.post('/', (req, res) => {
    const { symbol, name, notes } = req.body;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
    }

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const coin = watchlist.addToWatchlist({ symbol, name, notes });

    if (!coin) {
        return res.status(409).json({ error: `Coin '${symbol}' already exists in watchlist` });
    }

    res.status(201).json({
        message: 'Coin added to watchlist',
        coin
    });
});

/**
 * PUT /crypto/:symbol
 * Update a coin in the watchlist
 */
router.put('/:symbol', (req, res) => {
    const { symbol } = req.params;
    const { name, notes } = req.body;

    if (!name && notes === undefined) {
        return res.status(400).json({ error: 'At least one field (name or notes) is required' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (notes !== undefined) updates.notes = notes;

    const coin = watchlist.updateInWatchlist(symbol, updates);

    if (!coin) {
        return res.status(404).json({ error: `Coin '${symbol}' not found in watchlist` });
    }

    res.json({
        message: 'Coin updated in watchlist',
        coin
    });
});

/**
 * DELETE /crypto/:symbol
 * Remove a coin from the watchlist
 */
router.delete('/:symbol', (req, res) => {
    const { symbol } = req.params;

    const removed = watchlist.removeFromWatchlist(symbol);

    if (!removed) {
        return res.status(404).json({ error: `Coin '${symbol}' not found in watchlist` });
    }

    res.json({
        message: 'Coin removed from watchlist',
        coin: removed
    });
});

module.exports = router;
