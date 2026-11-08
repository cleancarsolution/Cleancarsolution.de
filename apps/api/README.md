# @ccs/api – Backend

Fastify-5-API für die Website von Clean Car Solution: nimmt Terminanfragen entgegen, validiert sie mit
demselben Zod-Schema wie das Frontend (`@ccs/shared`), speichert sie und benachrichtigt den Betrieb per E-Mail.

## Start

```bash
# im Repo-Root
cp apps/api/.env.example apps/api/.env
npm run dev:api          # http://localhost:4000 (tsx watch, Logs via pino-pretty)

npm run build -w @ccs/api   # Bundle nach apps/api/dist/server.js (tsup, @ccs/shared eingebettet)
npm run start -w @ccs/api   # Produktionsstart (lädt .env, falls vorhanden)
npm run test -w @ccs/api    # Vitest (11 Tests: Validierung, Honeypot, CORS, Rate-Limit, Fehlerfälle)
```

## Endpunkte

| Methode | Pfad             | Beschreibung                                      |
| ------- | ---------------- | ------------------------------------------------- |
| GET     | `/health`        | Status, Uptime, Version                           |
| GET     | `/v1/services`   | Leistungskatalog (`Cache-Control: max-age=300`)   |
| POST    | `/v1/inquiries`  | Terminanfrage anlegen                             |

```bash
curl -X POST http://localhost:4000/v1/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Max Mustermann","email":"max@example.com","service":"handwaesche","preferredDate":"2026-12-01","message":"Gern vormittags.","consent":true}'
# 201 → {"ok":true,"id":"…","receivedAt":"…"}
```

| Status | Bedeutung                                                                    |
| ------ | ---------------------------------------------------------------------------- |
| 201    | gespeichert (`{ ok: true, id, receivedAt }`)                                 |
| 400    | Body nicht lesbar (z. B. kaputtes JSON) – `bad_request`                      |
| 413    | Body größer als 32 KB                                                        |
| 422    | Validierung fehlgeschlagen – `fieldErrors` je Feld (deutsche Meldungen)      |
| 429    | Rate-Limit (Standard: 5 Anfragen / 10 Min. pro IP) – `rate_limited`          |

Felder: `name`*, `email`*, `phone`, `vehicle`, `service` (Slug aus `@ccs/shared` oder `beratung`),
`preferredDate` (`YYYY-MM-DD`), `message`, `consent`* (`true`), `website` (Honeypot – muss leer bleiben).

## Sicherheit & Datenschutz

- **Helmet**-Header, **CORS** nur für konfigurierte Origins (in der Entwicklung zusätzlich `localhost:*`).
- **Rate-Limiting** global und strenger für Anfragen; hinter einem Proxy `TRUST_PROXY=true` setzen.
- **Honeypot**: gefüllte Anfragen erhalten 201, werden aber weder gespeichert noch versendet.
- Es wird **keine rohe IP** gespeichert, nur ein gesalzener SHA-256-Hash (`IP_HASH_SALT`).
- Logs enthalten nur Anfrage-ID und Leistung, keine personenbezogenen Daten.

## Speicherung & E-Mail

- Anfragen landen zeilenweise in `<DATA_DIR>/inquiries.jsonl` (Standard `apps/api/data/`, git-ignoriert).
  Austauschbar über das Interface `InquiryStore` (z. B. später Postgres).
- Mit `SMTP_HOST` wird eine HTML- und Text-Mail an `MAIL_TO` gesendet (Reply-To = Kunde). Ohne SMTP wird
  der Eingang nur protokolliert. Der Versand blockiert die Antwort nicht.

## Docker

```bash
docker build -f apps/api/Dockerfile -t ccs-api .
docker run -p 4000:4000 --env-file apps/api/.env -v ccs-data:/app/data ccs-api
```

Multi-Stage-Build auf `node:24-alpine`, läuft als Nicht-Root-User, mit Healthcheck auf `/health`.
