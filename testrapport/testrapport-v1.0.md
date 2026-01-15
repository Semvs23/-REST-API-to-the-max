# Testrapport - Crypto REST API

**Versie:** 1.0
**Datum:** 2026-01-15
**Tester:** Geautomatiseerd (Jest + Supertest)

---

## 1. Samenvatting

Dit testrapport documenteert de testresultaten van de Crypto REST API versie 1.0. De API is getest met behulp van Jest (geautomatiseerde tests) en Supertest (HTTP assertions).

### Test Statistieken

| Categorie | Totaal | Geslaagd | Gefaald | Overgeslagen |
|-----------|--------|----------|---------|--------------|
| Unit Tests | 0 | 0 | 0 | 0 |
| Integratie Tests | 25 | 25 | 0 | 0 |
| **Totaal** | **25** | **25** | **0** | **0** |

### Code Dekking

| Bestand | Statements | Branches | Functies | Regels |
|---------|------------|----------|----------|--------|
| **Totaal** | **86.01%** | **78.18%** | **84%** | **85.82%** |
| src/app.js | 86.66% | 100% | 66.66% | 86.66% |
| src/data/watchlist.js | 93.54% | 100% | 80% | 96.29% |
| src/routes/crypto.js | 96.29% | 100% | 100% | 96.15% |
| src/services/coingecko.js | 67.44% | 42.85% | 83.33% | 65% |

---

## 2. Geteste Endpoints

### 2.1 GET / (Gezondheidscontrole)

**Doel:** API status controleren

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-000 | API status ophalen | 200 + statusbericht | GESLAAGD |

---

### 2.2 GET /crypto

**Doel:** Lijst van populaire cryptocurrencies ophalen

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-001 | Ophalen zonder parameters | 200 + array van coins | GESLAAGD |
| TC-002 | Coins hebben verplichte velden (symbol, name, price, change) | Alle velden aanwezig | GESLAAGD |
| TC-003 | Limit parameter respecteren | Max aantal coins = limit | GESLAAGD |

**cURL Test:**
```bash
curl http://localhost:3000/crypto
```

---

### 2.3 GET /crypto/:symbol

**Doel:** Specifieke cryptocurrency ophalen

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-004 | BTC ophalen | 200 + Bitcoin data | GESLAAGD |
| TC-005 | ETH ophalen | 200 + Ethereum data | GESLAAGD |
| TC-006 | Hoofdletterongevoelig (btc vs BTC) | 200 + correcte data | GESLAAGD |
| TC-007 | Ongeldige symbol (1 karakter) | 400 foutmelding | GESLAAGD |
| TC-008 | Niet-bestaande coin | 404 foutmelding | GESLAAGD |

**cURL Test:**
```bash
curl http://localhost:3000/crypto/BTC
curl http://localhost:3000/crypto/btc
curl http://localhost:3000/crypto/BESTAATNIETKEFANSEN
```

---

### 2.4 POST /crypto (Watchlist)

**Doel:** Coin toevoegen aan watchlist

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-009 | Coin toevoegen met alle velden | 201 + coin object | GESLAAGD |
| TC-010 | Symbol ontbreekt | 400 foutmelding | GESLAAGD |
| TC-011 | Name ontbreekt | 400 foutmelding | GESLAAGD |
| TC-012 | Dubbele coin toevoegen | 409 conflict | GESLAAGD |
| TC-013 | Symbol wordt hoofdletters | Symbol in hoofdletters | GESLAAGD |

**cURL Test:**
```bash
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "name": "Bitcoin", "notes": "Test"}'
```

---

### 2.5 GET /crypto/watchlist

**Doel:** Watchlist ophalen

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-014 | Lege watchlist | 200 + lege array | GESLAAGD |
| TC-015 | Watchlist met coins | 200 + array met coins | GESLAAGD |

**cURL Test:**
```bash
curl http://localhost:3000/crypto/watchlist
```

---

### 2.6 PUT /crypto/:symbol

**Doel:** Coin in watchlist bijwerken

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-016 | Notities bijwerken | 200 + bijgewerkte coin | GESLAAGD |
| TC-017 | Naam bijwerken | 200 + bijgewerkte coin | GESLAAGD |
| TC-018 | Geen update velden | 400 foutmelding | GESLAAGD |
| TC-019 | Niet-bestaande coin | 404 foutmelding | GESLAAGD |
| TC-020 | Hoofdletterongevoelig symbol | 200 + bijgewerkte coin | GESLAAGD |

**cURL Test:**
```bash
# Eerst coin toevoegen
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "name": "Bitcoin"}'

# Dan bijwerken
curl -X PUT http://localhost:3000/crypto/BTC \
  -H "Content-Type: application/json" \
  -d '{"notes": "Bijgewerkte notitie"}'
```

---

### 2.7 DELETE /crypto/:symbol

**Doel:** Coin uit watchlist verwijderen

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-021 | Coin verwijderen | 200 + verwijderde coin | GESLAAGD |
| TC-022 | Niet-bestaande coin | 404 foutmelding | GESLAAGD |
| TC-023 | Hoofdletterongevoelig symbol | 200 + verwijderde coin | GESLAAGD |

**cURL Test:**
```bash
curl -X DELETE http://localhost:3000/crypto/BTC
```

---

### 2.8 404 Afhandeling

**Doel:** Onbekende routes afhandelen

| Test Case | Beschrijving | Verwacht Resultaat | Resultaat |
|-----------|--------------|-------------------|-----------|
| TC-024 | Onbekende route | 404 foutmelding | GESLAAGD |

---

## 3. Geautomatiseerde Test Resultaten

### Test Uitvoer

```
> crypto-rest-api@1.0.0 test
> jest --coverage

GESLAAGD tests/crypto.test.js
  Crypto API
    GET /
      √ retourneert API status (28 ms)
    GET /crypto
      √ retourneert een lijst van populaire cryptocurrencies (248 ms)
      √ retourneert coins met verplichte velden (28 ms)
      √ respecteert limit query parameter (203 ms)
    GET /crypto/:symbol
      √ retourneert Bitcoin data voor BTC symbol (133 ms)
      √ retourneert Ethereum data voor ETH symbol (197 ms)
      √ is hoofdletterongevoelig voor symbol (92 ms)
      √ retourneert 400 voor ongeldig symbol (4 ms)
      √ retourneert 404 voor niet-bestaande coin (220 ms)
    POST /crypto (Watchlist)
      √ voegt een coin toe aan watchlist (22 ms)
      √ retourneert 400 als symbol ontbreekt (6 ms)
      √ retourneert 400 als name ontbreekt (3 ms)
      √ retourneert 409 als coin al bestaat in watchlist (5 ms)
      √ normaliseert symbol naar hoofdletters (4 ms)
    GET /crypto/watchlist
      √ retourneert lege array initieel (3 ms)
      √ retourneert toegevoegde coins (7 ms)
    PUT /crypto/:symbol
      √ werkt coin notities bij in watchlist (8 ms)
      √ werkt coin naam bij in watchlist (6 ms)
      √ retourneert 400 als geen update velden aanwezig (5 ms)
      √ retourneert 404 voor niet-bestaande coin (6 ms)
      √ is hoofdletterongevoelig voor symbol (4 ms)
    DELETE /crypto/:symbol
      √ verwijdert coin uit watchlist (7 ms)
      √ retourneert 404 voor niet-bestaande coin (6 ms)
      √ is hoofdletterongevoelig voor symbol (5 ms)
    404 Afhandeling
      √ retourneert 404 voor onbekende routes (3 ms)

Test Suites: 1 geslaagd, 1 totaal
Tests:       25 geslaagd, 25 totaal
Snapshots:   0 totaal
Tijd:        2.182 s
```

### Code Dekking Rapport

```
---------------|---------|----------|---------|---------|------------------------
Bestand        | % Stmt  | % Branch | % Func  | % Regels| Niet-gedekte regels
---------------|---------|----------|---------|---------|------------------------
Alle bestanden |   86.01 |    78.18 |      84 |   85.82 |
 src           |   86.66 |      100 |   66.66 |   86.66 |
  app.js       |   86.66 |      100 |   66.66 |   86.66 | 26-27
 src/data      |   93.54 |      100 |      80 |   96.29 |
  watchlist.js |   93.54 |      100 |      80 |   96.29 | 49
 src/routes    |   96.29 |      100 |     100 |   96.15 |
  crypto.js    |   96.29 |      100 |     100 |   96.15 | 16,49
 src/services  |   67.44 |    42.85 |   83.33 |      65 |
  coingecko.js |   67.44 |    42.85 |   83.33 |      65 | 63-69,93,102-125,153
---------------|---------|----------|---------|---------|------------------------
```

---

## 4. Handmatige Test Checklist

### 4.1 Postman/cURL Tests

- [x] Alle GET endpoints getest
- [x] Alle POST endpoints getest
- [x] Alle PUT endpoints getest
- [x] Alle DELETE endpoints getest
- [x] Foutmeldingen getest
- [x] Randgevallen getest

### 4.2 Browser Tests

- [x] API root endpoint werkt (`http://localhost:3000`)
- [x] JSON responses correct geformatteerd

---

## 5. Bekende Problemen

| Probleem | Beschrijving | Prioriteit | Status |
|----------|--------------|------------|--------|
| PROBLEEM-001 | CoinGecko API rate limiting (429) activeert terugval naar mock data | Laag | Werkt zoals verwacht |
| PROBLEEM-002 | Lagere dekking op coingecko.js (65%) door externe API afhankelijkheid | Medium | Acceptabel |

---

## 6. Aanbevelingen

1. **Database integratie** - Momenteel wordt een in-memory watchlist gebruikt. Voor productie wordt een database aanbevolen.
2. **Rate limiting** - CoinGecko API heeft rate limits. Overweeg caching toe te voegen.
3. **Authenticatie** - Voeg gebruikersauthenticatie toe voor persoonlijke watchlists.
4. **Dekking verbetering** - Verhoog de dekking van `coingecko.js` door meer randgevallen te mocken.

---

## 7. Conclusie

De Crypto REST API v1.0 is **GESLAAGD** voor release.

| Criterium | Vereist | Behaald | Status |
|-----------|---------|---------|--------|
| Alle tests slagen | 100% | 100% (25/25) | GESLAAGD |
| Statement dekking | >80% | 86.01% | GESLAAGD |
| Regel dekking | >80% | 85.82% | GESLAAGD |
| Kritieke bugs | 0 | 0 | GESLAAGD |

**Goedgekeurd voor release:** Ja

**Handtekening Tester:** _Geautomatiseerd Test Systeem_
**Datum:** 2026-01-15
