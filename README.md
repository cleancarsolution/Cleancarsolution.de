# Clean Car Solution – Website

Monorepo für die neue Website von **Clean Car Solution** – _Professional Car Care_ aus Düsseldorf.
Frontend und Backend sind strikt getrennt und teilen sich nur einen typisierten Vertrag (`@ccs/shared`).

```
.
├── apps/
│   ├── web/        Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · motion · Lenis
│   └── api/        Fastify 5 · Zod · Nodemailer – Terminanfragen & Leistungs-API
├── packages/
│   ├── shared/     @ccs/shared – Firmendaten, Leistungskatalog, Zod-Schemas, API-Typen
│   └── tsconfig/   @ccs/tsconfig – gemeinsame TypeScript-Konfigurationen
├── docs/
│   └── DESIGN.md   Design-System & Gestaltungsregeln (verbindlich)
├── turbo.json      Turborepo-Pipeline
└── package.json    npm-Workspaces
```

## Voraussetzungen

- Node.js **≥ 22.12** (empfohlen: 24, siehe `.nvmrc`)
- npm 11 (kommt mit Node 24)

## Schnellstart

```bash
npm install

# Umgebungsvariablen anlegen
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Web (http://localhost:3000) + API (http://localhost:4000) gleichzeitig
npm run dev
```

> Ist Port 3000 belegt, weicht Next.js automatisch auf den nächsten freien Port aus. Die API erlaubt im
> Entwicklungsmodus Anfragen von jedem `localhost`-Port.

## Skripte (im Root ausführen)

| Befehl              | Beschreibung                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Web + API im Watch-Modus (Turborepo)                 |
| `npm run dev:web`   | nur Frontend                                         |
| `npm run dev:api`   | nur Backend                                          |
| `npm run build`     | Produktions-Build aller Workspaces                   |
| `npm run start`     | Produktionsserver (nach `build`)                     |
| `npm run typecheck` | TypeScript-Prüfung aller Workspaces                  |
| `npm run lint`      | ESLint                                               |
| `npm run test`      | Tests (API: Vitest)                                  |
| `npm run format`    | Prettier (inkl. Tailwind-Klassen-Sortierung)         |

## Architektur

```
Browser ──(Formular, JSON)──▶ apps/web  POST /api/inquiries (Vercel Function) ──▶ Resend ──▶ info@… (Strato)
   ▲                               ▲
   │ statisch gerendert            │ gleiche Validierung
apps/web ◀──────── @ccs/shared (site · services · inquirySchema · E-Mail-Vorlage · API-Typen)
```

- **Single Source of Truth:** Firmendaten (`packages/shared/src/site.ts`) und Leistungen
  (`packages/shared/src/services.ts`) speisen Header-Dropdown, Leistungs-Sektion, Footer, Formular,
  JSON-LD (Local SEO) und die API.
- **Ein Schema, zwei Seiten:** `inquirySchema` (Zod) validiert die Terminanfrage identisch im Browser und
  auf dem Server – Fehlermeldungen sind deutschsprachig.
- **Frontend:** Server Components als Standard, Client Components nur für Interaktion (Menüs, Video,
  Scroll-Effekte, Formular). Smooth Scrolling via Lenis, Animationen via motion, respektiert
  „Bewegung reduzieren“.
- **Formular-Versand:** Route Handler `apps/web/src/app/api/inquiries` – Honeypot, Rate-Limit, gleiche
  Validierung, E-Mail per [Resend](https://resend.com) an `MAIL_TO` (Reply-To = Kunde). Gespeichert wird nichts.
- **Backend (optional):** Die Fastify-API (`apps/api`, SMTP + JSONL) wird von der Website nicht mehr genutzt.
  Details: [`apps/api/README.md`](apps/api/README.md).

## Inhalte pflegen

| Was                          | Wo                                                     |
| ---------------------------- | ------------------------------------------------------ |
| Adresse, Telefon, Social     | `packages/shared/src/site.ts`                          |
| Leistungen (Texte, Bilder)   | `packages/shared/src/services.ts`                      |
| Texte der Startseite         | `apps/web/src/content/*.ts` (eine Datei pro Sektion)   |
| Eigene Produkte (Banner)     | `apps/web/src/components/sections/offer/ProductBanner.tsx` (Preis-Sektion, Anker `#produkte`) |
| Inhouse-Partner PKW-Schmiede | `apps/web/src/content/partner.ts` (Logo: `apps/web/public/partner/`) |
| Videos (Pfade, Poster, Alt)  | `apps/web/src/content/media.ts`                        |
| Instagram-Reels (Einblick)   | `apps/web/src/content/gallery.ts` → `feed.posts`       |
| Logos (Header, Footer)       | `apps/web/public/brand/logo-*.png` (Liste: `apps/web/src/components/brand/logo-files.ts`) |
| Bilder & Video               | `apps/web/public/` (Bildnachweise: `public/images/CREDITS.md`) |
| Farben, Typo, Abstände       | `apps/web/src/app/globals.css` + `docs/DESIGN.md`      |

Alle noch zu bestätigenden Inhalte sind im Code mit `TODO(Kunde)` markiert.

## Medien

Das Studio-Video (Filmband „Über uns“, Bühne des Mega-Dropdowns) stammt aus eigenem Material des Kunden
(`Inhouse-Partner-Startseite.mp4`, 10-Bit-Original) und wurde neu encodiert: Farbton +15° Richtung Marken-Blau
(Sky `#26ABF6`), H.264, `faststart`, ohne Ton.

| Datei                       | Format              | Größe   |
| --------------------------- | ------------------- | ------- |
| `media/banner-1080.mp4`     | 1920 × 1080         | 5,7 MB  |
| `media/banner-720.mp4`      | 1280 × 720          | 2,6 MB  |
| `media/banner-portrait.mp4` | 608 × 1080 (Mobile) | 1,8 MB  |
| `media/hero-1080.mp4`       | 1920 × 1080         | 2,1 MB  |
| `media/hero-720.mp4`        | 1280 × 720          | 1,0 MB  |
| `media/hero-portrait.mp4`   | 608 × 1080 (Mobile) | 0,8 MB  |
| `media/hygiene-720.mp4`     | 1280 × 720          | 0,6 MB  |
| `media/hygiene-portrait.mp4`| 720 × 900 (Mobile)  | 0,4 MB  |
| `media/lackpolitur-720.mp4` | 1280 × 720          | 1,0 MB  |
| `media/lackpolitur-portrait.mp4` | 720 × 1080 (Bühne) | 1,0 MB |
| `media/innenraum-720.mp4`   | 1280 × 720          | 1,2 MB  |
| `media/innenraum-portrait.mp4` | 720 × 1080 (Bühne) | 1,0 MB |
| `media/leder-720.mp4`       | 1280 × 720          | 0,8 MB  |
| `media/leder-portrait.mp4`  | 720 × 1080 (Bühne)  | 0,9 MB  |
| `media/lackreparatur-720.mp4` | 1280 × 720        | 0,7 MB  |
| `media/lackreparatur-portrait.mp4` | 720 × 1080 (Bühne) | 0,6 MB |
| `media/verdeck-720.mp4`     | 1280 × 720          | 1,3 MB  |
| `media/verdeck-portrait.mp4` | 720 × 1080 (Bühne) | 1,1 MB |
| `media/handwaesche-1080.mp4` | 1920 × 1080 (unbearbeitet, beide Formate) | 10,0 MB |

Die Standbilder in `public/images/frames/` sind mit identischem Grading aus dem Original extrahiert.

**Hygiene-Video:** Zeitlupe aus derselben Aufnahme – Einstellung „Handwäsche im Sprühnebel“ (Frames 69–106),
per Bewegungsinterpolation auf ⅓ Tempo gebracht und mit 0,8 s Überblendung zur nahtlosen 4-s-Schleife gemacht
(gleiches Grading +15°, leicht aufgehellt). Poster = erster Frame, Standbild für „Bewegung reduzieren“ = Frame 44.
Liegt später eine eigene Trockendampf-Aufnahme vor, einfach die Dateien `hygiene-*` gleichnamig ersetzen.

**Leistungsfilme:** eigenes Material aus demselben Dreh (10-Bit-HEVC-Originale im Projekt-Root) – H.264,
`faststart`, ohne Ton; jeweils mit 1 s Überblendung (Frames 0–23 über das Ende) zur nahtlosen Schleife.
Der Hochformat-Schnitt (720 × 1080) schwenkt weich mit dem Motiv mit (beim Verdeck getrennt je Einstellung).
Poster = erster Frame der Schleife (Frame 24). Sie laufen im Mega-Dropdown und in der Leistungs-Sektion
(Zuordnung und Bildausschnitt: `serviceFilms` in `apps/web/src/content/media.ts`).

| Film            | Original                                                   | Leistung             | Grading | Standbild |
| --------------- | ---------------------------------------------------------- | -------------------- | ------- | --------- |
| `lackpolitur-*` | `Lackpolitur.mp4` (10 s → 9-s-Schleife)                    | Fahrzeugaufbereitung | +15°    | Frame 60  |
| `innenraum-*`   | `Innenraumsaugen&Reinigen.mp4` (8 s → 7 s)                 | Innen & Außen        | –       | Frame 36  |
| `leder-*`       | `LederPolishing.mp4` (8 s → 7 s)                           | Polster & Leder      | –       | Frame 108 |
| `lackreparatur-*` | `PunktuelleReparaturkleinerLackschäden.mp4` (7 s → 6 s)  | Smart Repair         | –       | Frame 78  |
| `verdeck-*`     | `SchonendeVerdeckreinigung&ProfessionelleImprägnierung.mp4` (8 s → 7 s) | Cabrioverdeck | +15° | Frame 48 |
| `handwaesche-*` | `CleanInnen.mp4` (H.264, 15,5 s, unbearbeitet)              | Handwäsche           | –       | 7 s       |

Der Handwäsche-Film ist noch nicht wie die übrigen aufbereitet (ffmpeg stand nicht zur Verfügung): Die Datei läuft
unverändert in 1080p für Quer- und Hochformat (die Bühne schneidet mittig zu), ohne Überblendung zur Schleife.
Poster (erster Frame) und Standbilder (Schaumpinsel am Scheinwerfer) sind per Chrome und `sharp` extrahiert.

Innenraum, Leder und Lackreparatur bleiben im Farbton unverändert: +15° färbte das Cognac-Leder olivgrün, ließ
die Hauttöne bei der Lederpflege gelblich kippen und kippte den blauen Metallic-Lack (der schon dem Marken-Blau
entspricht) ins Violett.

**Hero-Banner:** `NewBanner_Longer.mp4` (KI-generiert, 18 s, 10-Bit-HEVC). Die 9 Frames lange Totale am Anfang
entfällt (blitzte in der Schleife nur auf) – übrig bleibt eine 17,6-s-Schleife mit harten Schnitten. Die Kennzeichnung
„AI generated“ unten rechts (Kasten ab Zeile 976) liegt außerhalb des Ausschnitts: 1728 × 972 (16 : 9, ≈ 11 % Zoom),
je Einstellung horizontal versetzt – Heck rechtsbündig (Mitarbeiter rechts), Grill mittig, Front linksbündig
(Strahlrohr links). Der Hochformat-Schnitt (546 × 972 → 608 × 1080) schwenkt mit dem Motiv. Farbton unverändert
(+15° färbte Haut und Rücklichter), H.264 `veryslow`, CRF 23 (720p: 24). Poster = erster Frame der Schleife,
Standbild = Front im Gegenlicht (Frame 393), im Hochformat der Mitarbeiter mit dem Strahlrohr (Frame 9).

**Reels (Einblick):** Die Kacheln zeigen eine Vorschau aus der offiziellen Instagram-Einbettung – erst nach Klick
auf „Instagram-Inhalte laden“. Die Einbettung wird dreifach so groß gerendert und verkleinert auf 4 : 5
zugeschnitten (`ReelTile`): Kopfzeile, Leiste darunter und die schwarzen Ränder des Hochformat-Videos liegen
außerhalb, Instagrams Play-Zeichen unter dem der Kachel. Ein Klick führt zum Reel auf Instagram.

**Logos (Header, Footer):** die Dateien des Kunden (`Color-horiz.png`, `mobile-CleanCar.png`, `Color-vert.png` im
Projekt-Root), leere Ränder abgeschnitten, als `public/brand/logo-horizontal-light.png` (Header ab sm),
`logo-mark-light.png` (Header auf dem Smartphone) und `logo-vertical-light.png` (Footer) – transparent und frei
auf dem dunklen Grund, in der Hell-Fassung (`LOGO_PALETTE.light`): Navy `#010D61` → `#F3F6FB`, Royal `#0048CE` →
`#2A68E0` (Welle) bzw. `#84D0FA` („SOLUTION“), Sky bleibt. Die Dateien enthalten nur diese drei Farben (Kanten
über Alpha) – das Umfärben per `sharp` ist verlustfrei. `apps/web/src/components/brand/logo-paths.ts`
(vektorisiertes Logo, `<Logo>`) bleibt für die Platzhalter der Leistungen.

## Vor dem Livegang (offene Punkte)

- [ ] **Adresse bestätigen** – die bisherige Website nennt „Hermannstraße 7, 40233 Düsseldorf, im Autofit Ehreke“.
- [ ] Öffnungszeiten ergänzen (`site.openingHours`), aktuell „Termine nach Vereinbarung“.
- [ ] Leistungsumfang „Handwäsche innen & außen ab 89 €“ bestätigen (`apps/web/src/content/offer.ts`).
- [ ] Die Reel-Vorschauen in „Einblick“ laden nach Klick von Instagram (Zwei-Klick-Lösung) – die Einbindung von Instagram (Meta) in der Datenschutzerklärung aufführen. Weitere Beiträge: `apps/web/src/content/gallery.ts` → `feed.posts`.
- [ ] Handwäsche-Film (`CleanInnen.mp4`) wie die übrigen Leistungsfilme mit ffmpeg aufbereiten: 720p, Hochformat-Schnitt, Überblendung zur Schleife – spart rund 9 MB.
- [ ] Impressum & Datenschutz einfügen – die Seiten sind bewusst leer (`apps/web/src/app/impressum`, `…/datenschutz`).
- [ ] Eigene Produkte in `ProductBanner` einfügen – der Platz unter der Markenzeile der Preis-Sektion ist vorbereitet und leer.
- [ ] Resend: Domain `cleancarsolution.de` verifizieren (DNS bei Strato), `RESEND_API_KEY` und `MAIL_FROM` auf Vercel setzen.
- [ ] Optional: eigene Fotos (Innenraum, Leder, Cabrio, Trockendampf) statt lizenzfreier Stockfotos.

## Deployment

- **Web (Vercel):** Root Directory `apps/web` (im Dashboard), alles Weitere steht in `apps/web/vercel.json`
  (Turborepo-Build, Region Frankfurt). Variablen: `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO`
  (siehe `apps/web/.env.example`). Alte WordPress-Adressen leiten per `redirects()` in `apps/web/next.config.ts` weiter.
- **API (optional, für die Website nicht nötig):** Docker (`apps/api/Dockerfile`) oder Node – `npm run build -w @ccs/api` und
  `npm run start -w @ccs/api`. Variablen siehe `apps/api/.env.example`; `DATA_DIR` auf ein persistentes
  Volume legen.
