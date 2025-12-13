<!--
  webdevamin — special repository
  This README is designed to look great on GitHub and still be useful for contributors.
-->

# webdevamin

**A modern, multilingual web studio project built with Next.js (App Router),
Tailwind, and next-intl.**

---

## 🦖 README Dino Run (GitHub mini-game)

GitHub doesn’t allow JavaScript games in README files, so this is a
**click-to-play** dinosaur runner built with pure Markdown.

**How to play**

- **[Start the run](#dino-start)**
- Keep a score on paper: start at **0**
- Each choice tells you how many points to add/subtract
- Try to reach the best ending

### Legend

- **+1**: style
- **+2**: speed
- **+3**: clean landing
- **-2**: bonk
- **-5**: game over energy

---

<a id="dino-start"></a>

### Level 1 — The first cactus

```
      __
     / _)
  .-^^^-/ /
 __/       /
<__.|_|-|_|

   🌵
```

You’re sprinting through the desert. A cactus spawns.

- **[Jump](#dino-jump-1)** (+2)
- **[Slide](#dino-slide-1)** (+1)
- **[Panic and alt+F4](#dino-altf4)** (-5)

<a id="dino-jump-1"></a>

### Level 1A — Jump timing

You jump. Mid-air you spot a shiny coin… but also a low-flying pterodactyl.

- **[Grab the coin](#dino-coin-1)** (+3)
- **[Duck mid-air (somehow)](#dino-duck-midair)** (-2)

<a id="dino-slide-1"></a>

### Level 1B — Slide control

Clean slide. Sand everywhere. You’re fast now.

- **[Keep sliding into the next obstacle](#dino-slide-commit)** (+2)
- **[Pop up and prepare](#dino-pop-up)** (+1)

<a id="dino-coin-1"></a>

### Level 2 — The coin was a trap

You grab the coin and immediately hear the universal sound of: **boss music**.

Three obstacles spawn at once: cactus, rock, and an “urgent client request”.

- **[Use the “Reusable Blocks” power-up](#dino-block-power)** (+3)
- **[Hardcode it… just this once](#dino-hardcode)** (-2)

<a id="dino-duck-midair"></a>

### BONK — Physics disagrees

You tried to duck mid-air. The pterodactyl bonks you.

- **[Respawn at the start](#dino-start)** (-2)

<a id="dino-slide-commit"></a>

### Level 2 — Speed tunnel

You commit to the slide and enter a speed tunnel. Everything is blurry.

- **[Trust your instincts](#dino-instincts)** (+2)
- **[Open DevTools mid-run](#dino-devtools)** (-2)

<a id="dino-pop-up"></a>

### Level 2 — Clean footing

You pop up smoothly. A sign appears: **EN ⇄ NL**.

- **[Switch locale mid-run](#dino-locale-switch)** (+2)
- **[Ignore it and keep running](#dino-ignore-locale)** (+1)

<a id="dino-block-power"></a>

### Ending — The ship-it sprint

You used the reusable blocks power-up. The page assembles itself perfectly.

**Ending unlocked: “Ship It Supreme”**

- If your score is **10+**: you’re a legendary dino.
- If your score is **6–9**: you’re a fast dino.
- If your score is **0–5**: you’re a dino with potential.

Play again:

- **[Run again](#dino-start)**

<a id="dino-hardcode"></a>

### Ending — The spaghetti dunes

You hardcoded it. It works… today.

**Ending unlocked: “It Works On My Machine”**

Play again:

- **[Run again](#dino-start)**

<a id="dino-instincts"></a>

### Ending — Desert flow state

You trust your instincts and glide through obstacles like it’s a rhythm game.

**Ending unlocked: “Flow State Fossil”**

Play again:

- **[Run again](#dino-start)**

<a id="dino-devtools"></a>

### Ending — Console distraction

You opened DevTools mid-run. The desert does not wait.

**Ending unlocked: “Console Cowboy”**

Play again:

- **[Run again](#dino-start)**

<a id="dino-locale-switch"></a>

### Ending — Bilingual boost

You switched locale mid-run. The UI stays consistent. The dino gains confidence.

**Ending unlocked: “International Dino”**

Play again:

- **[Run again](#dino-start)**

<a id="dino-ignore-locale"></a>

### Ending — Monolingual momentum

You ignored the sign and kept running. Fast, but you missed some polish.

**Ending unlocked: “Speed Over Everything”**

Play again:

- **[Run again](#dino-start)**

<a id="dino-altf4"></a>

### GAME OVER — The escape key

You alt+F4’d. The cactus wins by default.

**Ending unlocked: “Extinction (Voluntary)”**

Play again:

- **[Run again](#dino-start)**

This repository is the “special” one where the project name matches the repo
name—so the README doubles as a front door:

- **What it is**: a production-grade Next.js 14 site with reusable page blocks,
  localized routes, and a clean UI system.
- **How it works**: content + translations drive pages, while components provide
  layout consistency.
- **Why it exists**: a fast, scalable foundation for building client-ready pages
  and industry/landing pages.

---

## The vibe

Ship pages like LEGO.

- **Blocks** snap together.
- **Locales** stay consistent.
- **Design** stays sharp.

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **i18n**: next-intl (locales: `en`, `nl`)
- **Styling**: Tailwind CSS + Sass
- **State**: Zustand
- **UI**: custom component library + Flowbite React
- **Icons**: Lucide React

---

## What you’ll find inside

- **Localized routes** under `src/app/[locale]/...`
- **Reusable sections** via layout/blocks components (e.g. `BlockLayoutOne`)
- **Translation files** in `messages/{locale}/*.json`
- **Industry pages** like `src/app/[locale]/industry/[slug]/page.jsx`

---

## Quickstart

```bash
# install
npm install

# dev
npm run dev

# build
npm run build

# start
npm start
```

Then open:

- `http://localhost:3000/en`
- `http://localhost:3000/nl`

---

## Project structure (high level)

```text
src/
  app/
    [locale]/
      ...routes
components/
  ...reusable UI + blocks
messages/
  en/
  nl/
```

---

## Localization notes

- Routes are locale-prefixed (`/en`, `/nl`).
- Text content is sourced from `messages/{locale}`.
- When adding new UI strings:
  1. Add keys to both `messages/en/*.json` and `messages/nl/*.json`
  2. Use `next-intl` helpers in components/pages

---

## Design system (practical rules)

- Prefer existing **Block** components for new sections to keep
  spacing/typography consistent.
- Keep headings consistent (use the existing `Heading` component where
  applicable).
- Use theme utilities (`bg-theme`, `text-theme`, etc.) for cohesive styling.

---

## Scripts

Your `package.json` is the source of truth, but typically:

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run lint`

---

## Roadmap (short + real)

- **More block presets** for landing pages
- **Content tooling** (optional) to make non-dev editing easier
- **Performance polish**: images, caching, and bundle trimming

---

## Contributing

If you’re editing UI:

- Keep changes small and consistent with existing blocks.
- Don’t introduce new styling patterns if Tailwind utilities already cover it.
- If you add a component that displays text, make it i18n-ready.

---

## Contact / Maatwerk

Want something custom (“**Maatwerk**”)?

- Open an issue with a short spec
- Or add a discussion with goals, deadlines, and examples

---

## Credits

Built and maintained by **Amin**.

---

## License

Add your preferred license (MIT/Proprietary/etc.) when ready.
