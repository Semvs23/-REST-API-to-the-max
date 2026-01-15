# Crypto REST API

Een REST API voor cryptocurrency data met CoinGecko integratie en een persoonlijke watchlist functionaliteit.

## Functionaliteiten

- **GET /crypto** - Lijst van populaire cryptocurrencies met naam, symbool, prijs en 24h verandering
- **GET /crypto/:symbol** - Prijs van één specifieke coin ophalen
- **GET /crypto/watchlist** - Bekijk je persoonlijke watchlist
- **POST /crypto** - Voeg een coin toe aan je watchlist
- **PUT /crypto/:symbol** - Update een coin in je watchlist
- **DELETE /crypto/:symbol** - Verwijder een coin uit je watchlist

## Installatie

```bash
# Clone de repository
git clone <repository-url>
cd crypto-rest-api

# Installeer dependencies
npm install

# Start de server
npm start

# Of in development mode met auto-reload
npm run dev
```

## API Endpoints

### GET /crypto

Haalt een lijst op van populaire cryptocurrencies.

**Query Parameters:**
- `limit` (optioneel): Aantal coins om terug te geven (default: 10)

**Response:**
```json
[
  {"symbol": "BTC", "name": "Bitcoin", "price": 27000, "change": 2.3},
  {"symbol": "ETH", "name": "Ethereum", "price": 1800, "change": -1.2}
]
```

### GET /crypto/:symbol

Haalt data op van een specifieke cryptocurrency.

**Voorbeeld:** `GET /crypto/BTC`

**Response:**
```json
{
  "symbol": "BTC",
  "name": "Bitcoin",
  "price": 27000,
  "change": 2.3
}
```

### GET /crypto/watchlist

Bekijk alle coins in je persoonlijke watchlist.

**Response:**
```json
[
  {
    "id": "1234567890",
    "symbol": "BTC",
    "name": "Bitcoin",
    "notes": "Mijn favoriete coin",
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### POST /crypto

Voeg een coin toe aan je watchlist.

**Request Body:**
```json
{
  "symbol": "BTC",
  "name": "Bitcoin",
  "notes": "Mijn favoriete coin"
}
```

**Response (201 Created):**
```json
{
  "message": "Coin added to watchlist",
  "coin": {
    "id": "1234567890",
    "symbol": "BTC",
    "name": "Bitcoin",
    "notes": "Mijn favoriete coin",
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /crypto/:symbol

Update een coin in je watchlist.

**Request Body:**
```json
{
  "name": "Bitcoin (BTC)",
  "notes": "Updated notitie"
}
```

**Response:**
```json
{
  "message": "Coin updated in watchlist",
  "coin": {
    "id": "1234567890",
    "symbol": "BTC",
    "name": "Bitcoin (BTC)",
    "notes": "Updated notitie",
    "addedAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### DELETE /crypto/:symbol

Verwijder een coin uit je watchlist.

**Response:**
```json
{
  "message": "Coin removed from watchlist",
  "coin": {
    "id": "1234567890",
    "symbol": "BTC",
    "name": "Bitcoin",
    "notes": "Mijn favoriete coin"
  }
}
```

## Testen

### Automatische Tests

```bash
# Run alle tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Handmatige Tests met cURL

```bash
# GET alle populaire coins
curl http://localhost:3000/crypto

# GET specifieke coin
curl http://localhost:3000/crypto/BTC

# POST - Voeg coin toe aan watchlist
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "name": "Bitcoin", "notes": "Mijn favoriet"}'

# GET watchlist
curl http://localhost:3000/crypto/watchlist

# PUT - Update coin in watchlist
curl -X PUT http://localhost:3000/crypto/BTC \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated notitie"}'

# DELETE - Verwijder coin uit watchlist
curl -X DELETE http://localhost:3000/crypto/BTC
```

### Testen met Postman

1. Importeer de volgende requests in Postman
2. Stel de base URL in op `http://localhost:3000`
3. Test elke endpoint

## Projectstructuur

```
crypto-rest-api/
├── src/
│   ├── app.js              # Express app configuratie
│   ├── server.js           # Server entry point
│   ├── routes/
│   │   └── crypto.js       # Crypto routes
│   ├── services/
│   │   └── coingecko.js    # CoinGecko API service
│   └── data/
│       └── watchlist.js    # In-memory watchlist storage
├── tests/
│   └── crypto.test.js      # API tests
├── testrapport/
│   └── testrapport-v1.0.md # Test rapport
├── package.json
├── jest.config.js
└── README.md
```

## Technologieën

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Axios** - HTTP client voor CoinGecko API
- **Jest** - Testing framework
- **Supertest** - HTTP assertions voor tests
- **CoinGecko API** - Cryptocurrency data

## Data Bron

Deze API gebruikt de [CoinGecko API](https://www.coingecko.com/en/api) voor real-time cryptocurrency data.

## Licentie

MIT
