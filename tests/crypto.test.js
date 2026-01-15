const request = require('supertest');
const app = require('../src/app');
const watchlist = require('../src/data/watchlist');

// Clear watchlist before each test
beforeEach(() => {
    watchlist.clearWatchlist();
});

describe('Crypto API', () => {
    // ==========================================
    // Health Check Tests
    // ==========================================
    describe('GET /', () => {
        it('should return API status', async () => {
            const res = await request(app).get('/');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('version');
        });
    });

    // ==========================================
    // GET /crypto Tests
    // ==========================================
    describe('GET /crypto', () => {
        it('should return a list of popular cryptocurrencies', async () => {
            const res = await request(app).get('/crypto');

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        }, 10000); // Increased timeout for external API

        it('should return coins with required fields', async () => {
            const res = await request(app).get('/crypto');

            if (res.body.length > 0) {
                const coin = res.body[0];
                expect(coin).toHaveProperty('symbol');
                expect(coin).toHaveProperty('name');
                expect(coin).toHaveProperty('price');
                expect(coin).toHaveProperty('change');
            }
        }, 10000);

        it('should respect limit query parameter', async () => {
            const res = await request(app).get('/crypto?limit=5');

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeLessThanOrEqual(5);
        }, 10000);
    });

    // ==========================================
    // GET /crypto/:symbol Tests
    // ==========================================
    describe('GET /crypto/:symbol', () => {
        it('should return Bitcoin data for BTC symbol', async () => {
            const res = await request(app).get('/crypto/BTC');

            expect(res.statusCode).toBe(200);
            expect(res.body.symbol).toBe('BTC');
            expect(res.body.name).toBe('Bitcoin');
            expect(res.body).toHaveProperty('price');
            expect(res.body).toHaveProperty('change');
        }, 10000);

        it('should return Ethereum data for ETH symbol', async () => {
            const res = await request(app).get('/crypto/ETH');

            expect(res.statusCode).toBe(200);
            expect(res.body.symbol).toBe('ETH');
            expect(res.body.name).toBe('Ethereum');
        }, 10000);

        it('should be case-insensitive for symbol', async () => {
            const res = await request(app).get('/crypto/btc');

            expect(res.statusCode).toBe(200);
            expect(res.body.symbol).toBe('BTC');
        }, 10000);

        it('should return 400 for invalid symbol', async () => {
            const res = await request(app).get('/crypto/X');

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 404 for non-existent coin', async () => {
            const res = await request(app).get('/crypto/NOTAREALCOIN123');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        }, 10000);
    });

    // ==========================================
    // Watchlist Tests - POST /crypto
    // ==========================================
    describe('POST /crypto (Watchlist)', () => {
        it('should add a coin to watchlist', async () => {
            const res = await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin', notes: 'My favorite coin' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message');
            expect(res.body.coin.symbol).toBe('BTC');
            expect(res.body.coin.name).toBe('Bitcoin');
            expect(res.body.coin.notes).toBe('My favorite coin');
        });

        it('should return 400 if symbol is missing', async () => {
            const res = await request(app)
                .post('/crypto')
                .send({ name: 'Bitcoin' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toContain('Symbol');
        });

        it('should return 400 if name is missing', async () => {
            const res = await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toContain('Name');
        });

        it('should return 409 if coin already exists in watchlist', async () => {
            await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin' });

            const res = await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin' });

            expect(res.statusCode).toBe(409);
            expect(res.body.error).toContain('already exists');
        });

        it('should normalize symbol to uppercase', async () => {
            const res = await request(app)
                .post('/crypto')
                .send({ symbol: 'eth', name: 'Ethereum' });

            expect(res.statusCode).toBe(201);
            expect(res.body.coin.symbol).toBe('ETH');
        });
    });

    // ==========================================
    // GET /crypto/watchlist Tests
    // ==========================================
    describe('GET /crypto/watchlist', () => {
        it('should return empty array initially', async () => {
            const res = await request(app).get('/crypto/watchlist');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return added coins', async () => {
            await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin' });

            await request(app)
                .post('/crypto')
                .send({ symbol: 'ETH', name: 'Ethereum' });

            const res = await request(app).get('/crypto/watchlist');

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    // ==========================================
    // PUT /crypto/:symbol Tests
    // ==========================================
    describe('PUT /crypto/:symbol', () => {
        beforeEach(async () => {
            await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin', notes: 'Original note' });
        });

        it('should update coin notes in watchlist', async () => {
            const res = await request(app)
                .put('/crypto/BTC')
                .send({ notes: 'Updated note' });

            expect(res.statusCode).toBe(200);
            expect(res.body.coin.notes).toBe('Updated note');
        });

        it('should update coin name in watchlist', async () => {
            const res = await request(app)
                .put('/crypto/BTC')
                .send({ name: 'Bitcoin (BTC)' });

            expect(res.statusCode).toBe(200);
            expect(res.body.coin.name).toBe('Bitcoin (BTC)');
        });

        it('should return 400 if no update fields provided', async () => {
            const res = await request(app)
                .put('/crypto/BTC')
                .send({});

            expect(res.statusCode).toBe(400);
        });

        it('should return 404 for non-existent coin', async () => {
            const res = await request(app)
                .put('/crypto/NOTEXIST')
                .send({ notes: 'New note' });

            expect(res.statusCode).toBe(404);
        });

        it('should be case-insensitive for symbol', async () => {
            const res = await request(app)
                .put('/crypto/btc')
                .send({ notes: 'Case test' });

            expect(res.statusCode).toBe(200);
        });
    });

    // ==========================================
    // DELETE /crypto/:symbol Tests
    // ==========================================
    describe('DELETE /crypto/:symbol', () => {
        beforeEach(async () => {
            await request(app)
                .post('/crypto')
                .send({ symbol: 'BTC', name: 'Bitcoin' });
        });

        it('should remove coin from watchlist', async () => {
            const res = await request(app).delete('/crypto/BTC');

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.coin.symbol).toBe('BTC');

            // Verify it's removed
            const watchlistRes = await request(app).get('/crypto/watchlist');
            expect(watchlistRes.body.length).toBe(0);
        });

        it('should return 404 for non-existent coin', async () => {
            const res = await request(app).delete('/crypto/NOTEXIST');

            expect(res.statusCode).toBe(404);
        });

        it('should be case-insensitive for symbol', async () => {
            const res = await request(app).delete('/crypto/btc');

            expect(res.statusCode).toBe(200);
        });
    });

    // ==========================================
    // 404 Handler Tests
    // ==========================================
    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const res = await request(app).get('/unknown-route');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error');
        });
    });
});
