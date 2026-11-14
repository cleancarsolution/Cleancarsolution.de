# Clean Car Solution – Design-System & Gestaltungsregeln

> Verbindliche Leitlinie für alle, die an der Website arbeiten. Tokens leben in
> `apps/web/src/app/globals.css`, Bausteine in `apps/web/src/components/ui/`.

## 1. Markenkern

**Clean Car Solution – Professional Car Care, Düsseldorf.** Claim: _„Erfahrung. Vertrauen. Exzellenz.“_
Positionierung: Handarbeit statt Waschstraße, „Klasse statt Masse“, Premium-Produkte (SONAX, 3M, Meguiar's),
hygienische Innenraumreinigung mit Trockendampf. Zielgruppe: Besitzer hochwertiger Fahrzeuge.

**Gestaltungsidee:** _Nachtstudio._ Das eigene Video zeigt eine schwarze Limousine im dunklen, nebligen Studio,
nur von kaltem Licht modelliert. Diese Stimmung trägt die ganze Seite: tiefe, navy-getönte Dunkelheit, aus der
Licht (Sky-Blau) Formen herausarbeitet – wie Glanz auf frisch gewaschenem Lack. Helle Sektionen („weißes Schild“)
setzen bewusst Kontrapunkte für Hygiene & Klarheit.

**Tonalität (Texte):** Sie-Form. Selbstbewusst, präzise, ruhig. Kurze Sätze. Keine Superlative-Kaskaden, keine
Floskeln („Willkommen auf unserer Website“), **keine erfundenen Zahlen, Bewertungen oder Testimonials.**
Alle Fakten stammen aus Banner/Website des Kunden; Unbestätigtes ist im Code mit `TODO(Kunde)` markiert.

## 2. Farben

Exakt aus den drei Logo-Ebenen gemessen:

| Token    | Hex       | Rolle                                                                 |
| -------- | --------- | --------------------------------------------------------------------- |
| `navy`   | `#010D61` | Markenfläche (Hygiene-Karte, Verläufe), Text auf hellen Flächen       |
| `royal`  | `#0048CE` | Primär-Aktion (Buttons), Verlaufsmitte, aktive Zustände               |
| `sky`    | `#26ABF6` | Licht/Akzent: Eyebrows, Hervorhebungen, Fokus, feine Linien           |
| `signal` | `#E4202B` | **Nur** das Preis-/Angebots-Badge („ab 89 €“) – max. 1–2× pro Seite   |
| `star`   | `#FBBC04` | **Nur** Bewertungssterne (Kundenstimmen) – Gelb wie bei Google        |
| `ink-*`  | `#03050F`… | Seitenhintergründe & Flächen, navy-getönt, nie reines Schwarz        |
| `paper`  | `#F3F5F9` | Helle Sektionen (Hygiene, FAQ) mit `navy`/`paper-ink` Text            |

**Verteilung:** ~75 % Ink (dunkel) · ~12 % Paper (hell) · ~8 % Navy-Flächen · ~5 % Royal/Sky-Akzente · <0,5 % Signal.

Regeln:
- Text auf Dunkel: `text-fg` (Headlines), `text-fg-muted` (Fließtext), `text-fg-subtle` (Meta). Sky nur für
  kurze Labels/Akzente, nie für Fließtext.
- Der **Wellen-Verlauf** (`bg-wave`: Navy → Royal → Sky) ist die Signatur aus dem Logo. Einsatz: feine Linien,
  Lichtkanten, eine Fläche pro Seite – nicht als Allzweck-Hintergrund.
- **Das Logo steht immer frei auf transparentem Grund** – nie auf einem weißen Schild oder Kasten. Form und
  Schrift bleiben wie beim Kunden: auf hellen Flächen in Originalfarben, auf dunklen in der Hell-Fassung
  (`LOGO_PALETTE.light`, wie auf dem Roll-up) – Navy wird Weiß, „SOLUTION“ hellblau, die Wellen bleiben blau
  (Original-Navy wäre auf Ink unsichtbar). Die Logo-Wellen nie als angeschnittene Flächen oder Deko-Schwünge.
- `text-wave` (Verlaufstext) höchstens ein Wort pro Sektion.
- Licht: radiale Royal/Sky-Lichter nur als motivierte Lichtquelle im Raum (hinter Bild oder Preis), niedrige
  Deckkraft (≤ 0,35) – keine zufälligen Blobs. **Bedienelemente leuchten nie:** Buttons, Badges und Links tragen
  keine farbigen Schatten, keinen Schein und kein Glas.
- Bilder: alle Video-Standbilder sind um +15° Farbton Richtung Marken-Sky gegradet. Stockfotos werden auf
  denselben Look gegradet (dunkel, kühl, entsättigt), damit alles nach einem Shooting aussieht.

## 3. Typografie

**Mona Sans** (variabel, Breite 75–125, Gewicht 200–900) für alles · **Geist Mono** für Nummern & Technik-Labels.

| Verwendung              | Klasse(n)                                                      |
| ----------------------- | -------------------------------------------------------------- |
| Hero-Headline           | `text-display-xl`/`2xl`, `font-medium`, Breite 100–108 %        |
| Sektions-Headline (h2)  | `text-display-lg` oder `md`, `font-medium`, `text-balance`      |
| Untertitel (h3)         | `text-display-sm`, `font-medium`                                |
| Lead                    | `text-lead text-fg-muted`, max. ~56ch                           |
| Fließtext               | `text-base`/`text-[1.0625rem]`, `leading-relaxed`               |
| Eyebrow / Labels        | `<Eyebrow>` → `text-eyebrow uppercase font-expanded`            |
| Banner-Zweizeiler       | `<TwoTone top="Polster & Leder" bottom="Reinigung" />`          |
| Indizes, Preise, Zähler | `font-mono tabular`                                             |

- Headlines eng gesetzt (Tracking in den Tokens), Gewicht 500 – **nicht** fett. Größe statt Gewicht.
- Die **Banner-Signatur** (obere Zeile Sky/leicht, untere Zeile Weiß/kräftig, Versalien, breit) ist das
  wichtigste Wiedererkennungsmerkmal – für Leistungsnamen konsequent über `<TwoTone>`.
- Breiten-Achse: `font-expanded` (125 %) für Labels, `font-wide` (112 %) für Banner-Zeilen.

## 4. Raster & Abstände

- `<Container>`: max. 1440 px, Gutter 20 / 32 / 48 / 64 px (sm / lg / 2xl).
- 12-Spalten-Raster (`grid-cols-12`), asymmetrische Layouts bevorzugt (z. B. 5/7, 4/8) – nicht alles zentrieren.
- Sektionsabstand: `py-24 sm:py-32 lg:py-40`. Zwischen Eyebrow → Headline `mt-6`, Headline → Lead `mt-6/8`,
  Kopf → Inhalt `mt-16 lg:mt-24`.
- Haarlinien (`border-line`, 1 px) gliedern statt Boxen. Karten nur, wo Inhalte wirklich gruppiert sind.
  **Keine Radien an Containern:** Sektions-Container, Karten, Panels, Menüs und Bildrahmen sind eckig. Rund
  bleiben nur Bedienelemente (Buttons, Badges, Icon-Kreise, Formularfelder). Bilder dürfen randlos/vollflächig sein.
- Mobile first. Jede Sektion muss bei 360 px Breite ohne horizontales Scrollen funktionieren.

## 5. Bausteine (`components/ui`)

| Baustein       | Zweck                                                                   |
| -------------- | ----------------------------------------------------------------------- |
| `Container`    | Seitenraster                                                            |
| `ButtonLink` / `Button` | Flach und präzise: `rounded-sm` (wie Formularfelder), keine Schatten, kein Schein, kein Glas; Zustände nur über Farbe. Varianten `primary` (Royal), `white` (auf Video/Bild/Schwarz), `secondary` (Haarlinie), `navy` (auf paper), `ghost`; `arrow` für Pfeil-Animation |
| `SmartLink`    | Anker (`/#id`) → weiches Scrollen, interne Seiten → next/link, extern → neuer Tab |
| `Eyebrow`      | Label mit optionaler Nummer `index="02"` oder `sparkle`                |
| `TwoTone`      | Banner-Zweizeiler für Leistungsnamen                                   |
| `Reveal`       | Block blendet beim Hineinscrollen ein (einmalig)                       |
| `RevealText`   | Headline Wort für Wort aus Masken (`immediate` für Hero)               |
| `Sparkle`      | Vierzackiger Funkel-Stern aus dem Logo – Mikro-Ornament                |
| `icons`        | Linien-Icons 1,5 px (inkl. Instagram/TikTok/WhatsApp)                  |
| `MarqueeTrack` | Laufband-Spur, bremst beim Überfahren weich ab (Leistungs-Laufband) |
| `SnapSlider`   | `useSnapSlider` + `SliderControls`: waagrechter Slider mit Einrasten, Fortschrittslinie (Sky → Royal) und Pfeil-Knöpfen – Einblick und Kundenstimmen |
| `brand/Logo`   | `variant="color"` (Originalfarben wie beim Kunden – nur auf Hell) / `"light"` (weißes Auto, auf Navy) / `"blue"` (blaues Auto auf Dunkel), `showWordmark`. `data-part` je Pfad für CSS-Animationen |
| `brand/logo-files` | Die Logo-Dateien des Kunden in der Hell-Fassung, transparent und frei auf dem dunklen Grund: Header auf dem Smartphone nur Auto und Wellen, ab sm Auto und Schriftzug nebeneinander, Footer untereinander |
| `media/*`      | Schleifen-Videos im Seitenfluss: `useLoopVideo` (lädt kurz vor Sichtbarkeit, spielt nur sichtbar, respektiert „Bewegung reduzieren“/Datensparmodus), `LoopVideoMedia` (Poster + Video), `VideoPoster` (Art Direction, Standbild bei reduzierter Bewegung), `VideoToggle` (Pause/Play mit Fortschrittsring) |
| `partner/*`    | Inhouse-Partner PKW-Schmiede als ruhige Empfehlung, nie als Werbefläche: schwarze Karten mit Haarlinie, ohne Schein. `PartnerEndorsement` (Footer: Logo · Nutzen + Leistungen · Weg zur Website, ganze Karte klickbar), `PartnerPromo` (Mega-Dropdown, kompakt im Mobile-Menü), `PartnerLogoAnimated` (Zahnrad dreht sich ein; `spin={false}` = steht still und rückt beim Überfahren der Karte einen Zahn weiter); Texte in `content/partner.ts` |
| `reviews/*`    | Kundenstimmen: `RatingLights` (Sterne der Gesamtnote, schalten sich beim Hineinscrollen nacheinander ein; Bruchteile leuchten anteilig), `ReviewSlider` (Rezensionen im `SnapSlider`) |
| `offer/*`      | Preis-Sektion „Studiolicht“: `LacquerPanel` (Lackpaneel, Licht an beim Hineinscrollen, Zeiger-Parallaxe), `StudioPrice` (Chrom-Ziffern im Scheinwerferkegel mit Bodenspiegelung), `QuoteList` (Preisliste der individuell kalkulierten Leistungen), `ServiceRequestLink`, `ProductSlider` (Produkte im Slider wie im Einblick: Kacheln 4 : 5 zwischen Haarlinien, Studiolicht von oben, das Produkt steht auf der Bodenlinie und spiegelt sich), `ProductBanner` (leerer Platz für eigene Produkte – Inhalt vom Kunden) |

Hilfen: `lib/scroll.ts` (Lenis, `scrollToId`, `lockScroll`), `lib/events.ts` (`requestService(slug)` wählt im
Kontaktformular die Leistung vor und scrollt hin), `lib/motion.ts` (Easing/Dauern), `lib/cn.ts`.

## 6. Bewegung

- Easing: `EASE_OUT_EXPO` für Reveals, `EASE_OUT_QUINT` für UI, `EASE_IN_OUT_QUART` für Schleifen.
- Dauern: UI 0,25 s · Menüs 0,5 s · Blöcke 0,9 s · Headlines/Bilder 1,2 s. Staffelung 0,07 s.
- Nur `transform`/`opacity`/`clip-path`/`filter` animieren – nie Layout-Eigenschaften.
- Bewegung erzählt etwas: Licht gleitet über Flächen (Glanz), Masken öffnen sich wie ein Rolltor, Bilder ziehen
  bei Scroll leicht nach (Parallax ≤ 12 %). Keine verspielten Bounces, keine Dauer-Animationen ohne Anlass.
- `prefers-reduced-motion`: Lenis aus, Reveals nur Fade, Video pausiert (Standbild), Marquee steht.
- Smooth Scrolling über Lenis ist global aktiv; `useScroll` von motion funktioniert normal (natives Scrollen).

## 7. Bildsprache

- **Eigenes Material zuerst**: Standbilder aus dem Studio-Video (`/images/frames/*`, gegradet).
- Video (Pfade zentral in `content/media.ts`). Alles unter `/media/` wird ein Jahr lang als unveränderlich gecacht
  (`next.config.ts`) – neues Material immer unter neuem Dateinamen ablegen (z. B. `banner3-*`), nie eine Datei
  überschreiben, sonst zeigen Browser und Bildoptimierung weiter die alte:
  - Banner-Film `/media/banner3-1080.mp4`, `banner3-720.mp4`, `banner3-portrait.mp4` (Hochformat-Schnitt, schwenkt
    mit dem Motiv), Poster `banner3-poster(-portrait).jpg` (= erster Frame), Standbild `banner3-still(-portrait).jpg`
    (für reduzierte Bewegung) – Porsche-Dreh mit eingeblendeten Produkten (Quelle `New_Edited_Product_Banner.mp4`).
    Solange die Produkte im Bild sind (`bannerFilm.productScene`, 1,2–6,2 s der Schleife = Sekunde 3–8 im
    Original), ersetzt `hero/HeroCopy.tsx` Eyebrow, Headline, Lead und CTAs durch die Produktzeile
    (`hero.productLine`, „… professionellen Produkten von:“), ab 3 s mit den Herstellerlogos darunter
    (`productLine.logos`), gekoppelt an die Filmzeit. Läuft im Hero ab Tablet; auf dem Smartphone (< 640 px) läuft dort der Handwäsche-Film als eigener
    Hochformat-Schnitt `handwaesche-hero.mp4` (+ `-poster`/`-still.jpg`). Die früheren Banner-Filme `banner2-*` und
    `banner-*` liegen weiter in `/media/`, sind aber nicht eingebunden.
  - Studiofilm `/media/pflege2-1080.mp4`, `pflege2-720.mp4`, `pflege2-portrait.mp4` (Hochformat-Schnitt, schwenkt
    mit dem Motiv), Poster `pflege2-poster(-portrait).jpg` (= erster Frame), Standbild `pflege2-still(-portrait).jpg`
    (für reduzierte Bewegung) – Quelle `remaked_video.mp4` (ohne sichtbaren Mitarbeiter). Läuft im Filmband von
    „Über uns“ und auf der Bühne des Mega-Dropdowns. Die vorige Fassung `pflege-*` (Quelle `newOne.mp4`) und der
    frühere Studiofilm `hero-*` liegen weiter in `/media/`, sind aber nicht eingebunden – nur `hero-poster.jpg` bleibt
    Vorschaubild (Open Graph, JSON-LD).
  - Trockendampf-Film `/media/dampf-hygiene-720.mp4`, `dampf-hygiene-portrait.mp4` (4 : 5), Poster
    `dampf-hygiene-poster(-portrait).jpg`, Standbild `dampf-hygiene-still(-portrait).jpg` – Hygiene-Sektion auf allen
    Breiten. Die frühere Sprühnebel-Zeitlupe `hygiene-*` liegt weiter in `/media/`, ist aber nicht eingebunden.
  - Leistungsfilme (`serviceFilms`) je `/media/<film>-720.mp4` + `<film>-portrait.mp4` (2 : 3, schwenkt mit
    dem Motiv): Lackpolitur (`lackpolitur2`) → Fahrzeugaufbereitung, Handwäsche (`handwaesche2`, Quelle
    `new_one_Remaked.mp4`, schon im Original nahtlose Schleife) → Handwäsche, Innenraum → Innen & Außen, Leder (`leder2`) → Polster & Leder,
    Lackreparatur → Smart Repair, Verdeck → Cabrioverdeck. Im Mega-Dropdown ersetzt der Film den Studiofilm – als Breitband (3 : 1) in voller
    Breite oben auf der Bühne, damit man ihn über dem Text erkennt; `position` (object-position) legt je Film
    fest, welcher Streifen zu sehen ist (y) bzw. welcher Ausschnitt auf der Mobile-Karte (x). In der
    Leistungs-Sektion ersetzt der Film das Foto (Desktop-Bühne: Hochformat-Schnitt, Mobile-Karte: Querformat).
    Die früheren `lackpolitur-*`, `leder-*` und `handwaesche-1080.mp4` (+ `handwaesche-poster/-still*.jpg`) liegen
    weiter in `/media/`, sind aber nicht eingebunden.
  - Reels (Einblick, `content/gallery.ts` → `feed.posts`): Kachel (4 : 5) mit Vorschau aus der Instagram-Einbettung
    (lädt von selbst kurz vor dem Slider, auf das Bild zugeschnitten, mit Instagrams eigenem Play-Zeichen, darunter
    auf jeder Kachel „Auf Instagram ansehen“ in Instagrams weißer Schrift; bei Reels, die Instagram eingebettet nicht
    abspielt, schreibt Instagram ihn selbst – `instagramLabel: true`) – abgespielt wird auf Instagram, ein Klick
    führt dorthin.
- Jedes Video: stumm, Schleife, lädt erst kurz vor Sichtbarkeit, pausiert außerhalb des Viewports, Pause/Play sichtbar.
- Overlays: Verläufe aus `ink-950` für Lesbarkeit, feines Korn (`bg-grain`, Deckkraft 0,05–0,1).
- Immer `next/image` mit korrektem `sizes`; Hero-Medien mit Priorität, alles andere lazy.
- Produktfotos (`/images/produkte/`, Liste in `content/offer.ts` → `products`): freigestellt, auf die deckende Fläche
  zugeschnitten und gleich hoch auf 880 × 1000 px gebracht, unten bündig – so stehen alle gleich groß auf derselben
  Bodenlinie. Neue Produkte genauso aufbereiten.
- Herstellerlogos (`/images/marken/`, Liste in `content/hero.ts` → `productLine.logos`): weiß auf transparent, eng auf
  das Logo beschnitten – sie stehen über dem dunklen Banner-Film. `servfaces.png` ist aus dem Etikettfoto `SF.png`
  freigestellt (Helligkeit als Deckkraft). Neue Logos genauso aufbereiten und anhängen; sie erscheinen nacheinander.

## 8. Startseite – Sektionen

| # | Sektion        | Anker        | Fläche          | Inhalt (Datei)                         |
| - | -------------- | ------------ | --------------- | -------------------------------------- |
| 1 | Hero           | `#top`       | Video           | `content/hero.ts`                      |
| 2 | Marquee        | –            | ink-950         | Leistungen als Laufband                |
| 3 | Über uns       | `#ueber-uns` | ink-950         | `content/about.ts`                     |
| 4 | Leistungen     | `#leistungen` (+ `#<slug>`) | ink-900 | `@ccs/shared` + `content/services-section.ts` |
| 5 | Hygiene        | `#hygiene`   | **paper (hell)**| `content/hygiene.ts`                   |
| 6 | Preise         | `#preise` (+ `#produkte`) | **schwarz (ink-950)** | `content/offer.ts` · `offer/ProductBanner` (eigene Produkte, Inhalt vom Kunden) |
| 7 | Einblick       | `#einblick`  | ink-950         | `content/gallery.ts` (`feed.posts`: Reels im Slider – Vorschau von Instagram lädt von selbst, ein Klick auf die Kachel führt zu Instagram) |
| 8 | Ablauf         | `#ablauf`    | ink-900         | `content/process.ts`                   |
| 9 | Kundenstimmen  | `#kundenstimmen` | ink-950     | `content/reviews.ts` · Google-Rezensionen aus `lib/google-reviews.ts` (Business Profile API, alle 6 h neu), Links in `site.reviews` |
| 10| FAQ            | `#faq`       | **paper (hell)**| `content/faq.ts`                       |
| 11| Kontakt        | `#kontakt`   | ink-950         | `content/contact.ts` + `site`          |

Header (fixiert, Logo, Mega-Dropdown „Leistungen“ mit Video-Bühne) und Footer kommen aus
`components/layout/`. Beide bewerben den Inhouse-Partner PKW-Schmiede (Logo für dunkle Flächen:
`public/partner/pkw-schmiede-light.svg`).

Die eine Idee je Sektion (Auswahl):
- **Über uns:** Filmband – das Studio-Video öffnet sich beim Scrollen wie eine Blende.
- **Hygiene:** „Klarsicht“ – Trockendampf-Video, links Milchglas („Sauber“), rechts klar („Hygienisch“); die
  Trennlinie wischt sich einmal frei und lässt sich ziehen (Maus, Touch, Pfeiltasten).
- **Einblick:** Kontaktabzug als Slider – Reels (4 : 5) zwischen Haarlinien, Vorschau von Instagram, ein Klick
  führt dorthin; Wischen mit Einrasten, Fortschrittslinie und Pfeile; die Profil-Karte schließt ab.
- **Preise:** „Studiolicht“ – das Angebot ist ein Paneel aus schwarzem Lack. Beim Hineinscrollen flackert ein
  Scheinwerfer auf: Sein Lichtkegel mit feinem Nebel fällt schräg auf die Chrom-Ziffern und schwenkt mit dem
  Zeiger, am Boden liegt ein Lichtfleck; die Ziffern fangen ein Glanzlicht und spiegeln sich im Boden. Darunter
  die übrigen Leistungen als ruhige Preisliste, dann die Produkte im Slider („Wir arbeiten mit hochqualitativen
  Produkten“) und der Platz für die eigenen Produkte.
- **Kundenstimmen:** Die Gesamtnote aus dem Google-Profil als Lichtleiste – beim Hineinscrollen schalten sich die
  fünf Sterne nacheinander ein (kurzer Einschalt-Glanz, dann Sterngelb wie bei Google).
  Darunter bis zu zehn der neuesten Rezensionen mit Text im Slider zwischen Haarlinien (wie im Einblick), Name
  gekürzt („Max M.“), Originalwortlaut; am Ende der Hinweis nach § 5b Abs. 3 UWG und die Wege zu Google.
  Ohne Daten nur Überschrift und Links.
- **Footer:** „Unter einem Dach“ – Marke mit direkten Wegen (Termin, Anrufen, Schreiben; auf dem Smartphone
  WhatsApp statt Schreiben), der Inhouse-Partner als Empfehlungs-Karte, Linkspalten (Social nur Instagram, ohne
  TikTok); Finale: das Logo in voller Breite auf der Bodenlinie (ab sm nebeneinander,
  auf dem Smartphone gestapelt), gespiegelt im glänzenden Boden – die Teile kommen nacheinander, dann gleitet
  einmal Studiolicht darüber. Ganz unten Rechtliches und „Erstellt mit Next.js & Turbopack von Palmer Digital“
  (Link auf www.palmer-digital.de, neuer Tab).

## 9. Kein „AI-Slop“ – harte Regeln

- Keine generischen Farbverlauf-Blobs, kein Glassmorphism-Overkill, keine Emoji, keine Clip-Art-Icons als Deko.
- Keine austauschbaren 3-Spalten-Karten mit Icon-Kreis + Überschrift + Text als Standardlösung.
- Keine erfundenen Kundenstimmen, Sterne, „1000+ zufriedene Kunden“ o. Ä.
- Keine Lorem-Ipsum-Reste, keine englischen Platzhalter, keine Füllwörter.
- Nicht alles zentrieren; mit Asymmetrie, Raster und Weißraum arbeiten.
- Jede Sektion braucht **eine** klare Idee (Layout oder Interaktion), die sie unverwechselbar macht.

## 10. Barrierefreiheit & Qualität

- Kontrast mind. WCAG AA; Fokus immer sichtbar (`:focus-visible` = Sky-Outline).
- Semantik: eine `h1` (Hero), Sektionen mit `aria-labelledby`, Landmarks, echte Buttons/Links.
- Menüs & Accordions voll tastaturbedienbar (Esc schließt, `aria-expanded`, `aria-controls`).
- Hintergrundvideo: stumm, `playsInline`, pausierbar (sichtbarer Pause-Button, WCAG 2.2.2).
- Bilder mit aussagekräftigem `alt` (Deutsch); dekorative Elemente `aria-hidden`.
- Performance: Server Components standardmäßig, `'use client'` nur wo Interaktion nötig ist.
