// In-memory watchlist storage
// In production, this would be a database
let watchlist = [];

const getWatchlist = () => {
    return [...watchlist];
};

const addToWatchlist = (coin) => {
    const existing = watchlist.find(c => c.symbol.toUpperCase() === coin.symbol.toUpperCase());
    if (existing) {
        return null; // Already exists
    }
    const newCoin = {
        id: Date.now().toString(),
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        notes: coin.notes || '',
        addedAt: new Date().toISOString()
    };
    watchlist.push(newCoin);
    return newCoin;
};

const updateInWatchlist = (symbol, updates) => {
    const index = watchlist.findIndex(c => c.symbol.toUpperCase() === symbol.toUpperCase());
    if (index === -1) {
        return null;
    }
    watchlist[index] = {
        ...watchlist[index],
        ...updates,
        symbol: watchlist[index].symbol, // Don't allow symbol change
        updatedAt: new Date().toISOString()
    };
    return watchlist[index];
};

const removeFromWatchlist = (symbol) => {
    const index = watchlist.findIndex(c => c.symbol.toUpperCase() === symbol.toUpperCase());
    if (index === -1) {
        return null;
    }
    const removed = watchlist.splice(index, 1)[0];
    return removed;
};

const findInWatchlist = (symbol) => {
    return watchlist.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
};

const clearWatchlist = () => {
    watchlist = [];
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    updateInWatchlist,
    removeFromWatchlist,
    findInWatchlist,
    clearWatchlist
};
