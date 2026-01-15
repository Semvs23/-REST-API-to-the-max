const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Crypto API server running on http://localhost:${PORT}`);
    console.log(`Endpoints available:`);
    console.log(`  GET    /crypto          - List popular cryptocurrencies`);
    console.log(`  GET    /crypto/:symbol  - Get specific coin by symbol`);
    console.log(`  POST   /crypto          - Add coin to watchlist`);
    console.log(`  PUT    /crypto/:symbol  - Update coin in watchlist`);
    console.log(`  DELETE /crypto/:symbol  - Remove coin from watchlist`);
    console.log(`  GET    /crypto/watchlist - Get your watchlist`);
});
