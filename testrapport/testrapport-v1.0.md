# Testrapport - Crypto REST API

**Versie:** 1.0
**Datum:** 2026-01-15
**Tester:** [Naam]

---

## 1. Samenvatting

Dit testrapport documenteert de testresultaten van de Crypto REST API versie 1.0. De API is getest met behulp van Jest (automatische tests) en cURL/Postman (handmatige tests).

### Test Statistieken

| Categorie | Totaal | Geslaagd | Gefaald | Overgeslagen |
|-----------|--------|----------|---------|--------------|
| Unit Tests | 22 | - | - | - |
| Integratie Tests | 22 | - | - | - |
| **Totaal** | **22** | **-** | **-** | **-** |

> Voer `npm test` uit om de actuele resultaten te zien.

---

## 2. Geteste Endpoints

### 2.1 GET /crypto

**Doel:** Lijst van populaire cryptocurrencies ophalen

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-001 | Ophalen zonder parameters | 200 + array van coins | [ ] |
| TC-002 | Coins hebben verplichte velden (symbol, name, price, change) | Alle velden aanwezig | [ ] |
| TC-003 | Limit parameter respecteren | Max aantal coins = limit | [ ] |

**cURL Test:**
```bash
curl http://localhost:3000/crypto
```

---

### 2.2 GET /crypto/:symbol

**Doel:** Specifieke cryptocurrency ophalen

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-004 | BTC ophalen | 200 + Bitcoin data | [ ] |
| TC-005 | ETH ophalen | 200 + Ethereum data | [ ] |
| TC-006 | Case-insensitive (btc vs BTC) | 200 + correct data | [ ] |
| TC-007 | Ongeldige symbol (1 karakter) | 400 error | [ ] |
| TC-008 | Niet-bestaande coin | 404 error | [ ] |

**cURL Test:**
```bash
curl http://localhost:3000/crypto/BTC
curl http://localhost:3000/crypto/btc
curl http://localhost:3000/crypto/NOTAREALCOIN
```

---

### 2.3 POST /crypto (Watchlist)

**Doel:** Coin toevoegen aan watchlist

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-009 | Coin toevoegen met alle velden | 201 + coin object | [ ] |
| TC-010 | Symbol ontbreekt | 400 error | [ ] |
| TC-011 | Name ontbreekt | 400 error | [ ] |
| TC-012 | Duplicate coin toevoegen | 409 conflict | [ ] |
| TC-013 | Symbol wordt uppercase | Symbol in uppercase | [ ] |

**cURL Test:**
```bash
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "name": "Bitcoin", "notes": "Test"}'
```

---

### 2.4 GET /crypto/watchlist

**Doel:** Watchlist ophalen

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-014 | Lege watchlist | 200 + lege array | [ ] |
| TC-015 | Watchlist met coins | 200 + array met coins | [ ] |

**cURL Test:**
```bash
curl http://localhost:3000/crypto/watchlist
```

---

### 2.5 PUT /crypto/:symbol

**Doel:** Coin in watchlist updaten

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-016 | Notes updaten | 200 + updated coin | [ ] |
| TC-017 | Name updaten | 200 + updated coin | [ ] |
| TC-018 | Geen update velden | 400 error | [ ] |
| TC-019 | Niet-bestaande coin | 404 error | [ ] |
| TC-020 | Case-insensitive symbol | 200 + updated coin | [ ] |

**cURL Test:**
```bash
# Eerst coin toevoegen
curl -X POST http://localhost:3000/crypto \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "name": "Bitcoin"}'

# Dan updaten
curl -X PUT http://localhost:3000/crypto/BTC \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated note"}'
```

---

### 2.6 DELETE /crypto/:symbol

**Doel:** Coin uit watchlist verwijderen

| Test Case | Beschrijving | Verwacht | Resultaat |
|-----------|--------------|----------|-----------|
| TC-021 | Coin verwijderen | 200 + removed coin | [ ] |
| TC-022 | Niet-bestaande coin | 404 error | [ ] |
| TC-023 | Case-insensitive symbol | 200 + removed coin | [ ] |

**cURL Test:**
```bash
curl -X DELETE http://localhost:3000/crypto/BTC
```

---

## 3. Automatische Test Resultaten

Voer het volgende commando uit om de tests te draaien:

```bash
npm test
```

### Test Output

```
[Plak hier de output van npm test]
```

### Code Coverage

```
[Plak hier de coverage output]
```

---

## 4. Handmatige Test Checklist

### 4.1 Postman/cURL Tests

- [ ] Alle GET endpoints getest
- [ ] Alle POST endpoints getest
- [ ] Alle PUT endpoints getest
- [ ] Alle DELETE endpoints getest
- [ ] Error responses getest
- [ ] Edge cases getest

### 4.2 Browser Tests

- [ ] API root endpoint werkt (`http://localhost:3000`)
- [ ] JSON responses correct geformatteerd

---

## 5. Bekende Issues

| Issue | Beschrijving | Prioriteit | Status |
|-------|--------------|------------|--------|
| - | Geen bekende issues | - | - |

---

## 6. Aanbevelingen

1. **Database integratie** - Momenteel wordt een in-memory watchlist gebruikt. Voor productie wordt een database aanbevolen.
2. **Rate limiting** - CoinGecko API heeft rate limits. Overweeg caching toe te voegen.
3. **Authenticatie** - Voeg user authenticatie toe voor persoonlijke watchlists.

---

## 7. Conclusie

De Crypto REST API v1.0 is [GESLAAGD/GEFAALD] voor release.

**Handtekening Tester:** ____________________
**Datum:** ____________________
