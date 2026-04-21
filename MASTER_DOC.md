# MASTER_DOC

## Project Overzicht

Deze website is gebouwd als een meertalige Next.js-omgeving met content-gedreven pagina's via JSON-bestanden in `messages/`. Industry-pagina's zoals de kapper-pagina halen hun content op via `src/app/[locale]/industry/[slug]/page.jsx`, waarna blokken conditioneel worden gerenderd met herbruikbare componenten.

## Architectuur

- Routing voor industry-pagina's loopt via `src/app/[locale]/industry/[slug]/page.jsx`.
- De inhoud van elke industry-pagina leeft centraal in `messages/{locale}/industries/*.json`.
- Generieke secties zoals hero, content, pricing, FAQ en CTA worden data-driven opgebouwd vanuit `blocks`.
- De pricing cards worden gerenderd via `components/Cards/PricingCard.jsx`.

## Content Flow Van Een Industry Pagina

1. De slug wordt gemapt naar een JSON-bestand.
2. De JSON levert SEO-data, structured data en page blocks.
3. `page.jsx` koppelt elk block aan een UI-component.
4. Pricing gebruikt een centrale datastructuur per pakket en rendert conditioneel badges, features en CTA's.

## Feature Notities

### Pricing Voor Kapper Pagina

- De kapper pricing is opgewaardeerd naar een duidelijk 4-laags aanbod: `Standaard`, `Premium`, `Pro` en `Op Maat`.
- `Premium` is nu het hoofdproduct en wordt visueel benadrukt als meest gekozen pakket.
- Pricing verkoopt nu sterker op resultaat:
  - online zichtbaar worden
  - automatisch afspraken ontvangen
  - zonder technische zorgen
  - meegroeien met het salon
- Afsprakenlimieten zijn positief geframed als groeilogica:
  - Premium: 150 afspraken per maand inbegrepen (meer is mogelijk)
  - Pro: 250 afspraken per maand inbegrepen (meer is mogelijk)
  - Het woord "Tot" is bewust verwijderd uit de limitLabel badges omdat het als een plafond/maximum gelezen werd
  - Beide cards tonen nu "(meer is mogelijk)" in de featurelijst om aan te geven dat het geen harde limieten zijn
- De `microcopy` velden worden nu ook gerenderd in `PricingCard.jsx` (direct onder de limitLabel badge):
  - Premium en Pro hebben microcopy: "Meer afspraken? Klein bedrag per extra afspraak erbij."
  - Dit plaatst de meegroeien-boodschap direct op de card zelf, op de meest relevante plek
- De pricing-sectie ondersteunt nu extra data-velden:
  - `tagline`
  - `microcopy`
  - `badge`
  - `limitLabel`
  - `description`
  - `popular`
- Onder de pricing cards staat nu een extra groeiblok dat meegroeien positief kadert. De tekst legt uit dat klanten niet gebonden zijn aan een maximum en dat ze op hetzelfde pakket kunnen blijven terwijl ze een klein bedrag extra betalen per afspraak boven hun inbegrepen limiet.
- Er is een nieuw FAQ-item toegevoegd: "Wat gebeurt er als ik meer afspraken krijg dan mijn limiet?" Dit item is ook toegevoegd aan de JSON-LD FAQ schema voor SEO.
- Het exacte tarief per extra afspraak wordt bewust niet op de pagina vermeld. Dit bewaar je voor het salesgesprek.
- De growthNote badge onder de cards toont nu "Geen opstartkosten. Groeit mee met je salon." in plaats van "Alles inbegrepen." om de meegroeien-boodschap nogmaals te versterken op een visueel prominente plek.
- De omliggende kapper-copy is afgestemd op de pricing-logica:
  - `Standaard` = online zichtbaarheid en professioneel visitekaartje
  - `Premium` = automatisch afspraken ontvangen
  - `Pro` = groeien en opschalen
- Copy buiten de pricing-sectie mag afspraken, herinneringen en e-mailmarketing niet meer formuleren alsof die standaard in elk pakket zitten.

## Belangrijke Gotcha's

- Oude prijzen en positioning kunnen op meerdere plekken zitten:
  - SEO descriptions
  - JSON-LD / FAQ schema
  - hero-copy
  - pricing intro
  - bottom CTA
- Als pricing wijzigt, controleer altijd zowel zichtbare content als structured data mee.
- `PricingCard.jsx` wordt mogelijk ook op andere pagina's hergebruikt, dus nieuwe velden moeten optioneel blijven.
- Controleer op industry-pagina's altijd of featureblokken, FAQ en video-copy dezelfde pakketlogica volgen als de pricing cards. Daar sluipen snel contradicties in.

## Chronologische Flow Van De Kapper Pricing

1. Bezoeker ziet eerst online zichtbaarheid en afspraken als kernbelofte.
2. In de pricing-sectie wordt `Premium` als beste keuze gepositioneerd.
3. `Standaard` blijft de laagdrempelige instap voor online aanwezigheid.
4. `Pro` wordt gepresenteerd als groeipakket voor salons met meer volume.
5. Onder de kaarten wordt meegroeien uitgelegd: klanten kunnen op hetzelfde pakket blijven en betalen een klein bedrag per extra afspraak boven hun limiet.

## Mogelijke Toekomstige Aandachtspunten

- Als er later automatische facturatie of usage-tracking komt, houd de copy positief en vermijd strafgerichte taal.
- Als meer industry-pagina's vergelijkbare pricing-logica krijgen, is het zinvol om een gedeeld pricing-schema of helper te introduceren.
- Controleer bij toekomstige design updates dat de pricing cards op mobiel visueel in balans blijven, zeker met langere taglines of microcopy.
