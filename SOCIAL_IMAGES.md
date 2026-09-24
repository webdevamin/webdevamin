# Social images

Every public page has a 1200 by 630 PNG built by Next.js. New pages following the existing content and metadata pattern are discovered during builds and receive a card with their own text automatically. Dedicated artwork is optional: until it exists, the card uses the master template. Builds do not call an image model.

## Source files

- `public/images/social-card-template.jpg` is the master visual reference, inspired by the existing red restaurant OG image. Keep the pale background, red details, empty left text area and framed scene on the right.
- `public/images/social-cards/<illustrationKey>.jpg` contains dedicated, text-free artwork. Equivalent translations share the same artwork.
- `utils/social-images.js` discovers localized page JSON files at build time, excluding the 404 and 500 error content. Blog and industry entries come from the existing collections and industry route mapping. Taxi content uses the existing pricing transformation.
- `components/social-image-card.mjs` adds the title, description, category, action label and branding. Fonts and their licenses are bundled in `public/fonts/social-cards/`.
- `src/app/social-cards/[key]/opengraph-image.jsx` pre-renders every registered key. Unknown keys are not generated on demand.

## Adding a page

1. Create the page and localized content normally, including its SEO title, description and canonical URL. Page content belongs in `messages/en/pages/` or `messages/nl/pages/`; blogs and industries use their existing collections. No OG registry entry is required.
2. As part of the page implementation, use the existing metadata pattern: call `await getSocialImageMetadata(seo.canonical)` in `generateMetadata`, then use the descriptor in `openGraph.images` and its URL in `twitter.images`. A route with no content record or no metadata connection cannot acquire page-specific sharing metadata automatically.
3. Build and deploy through the existing commands. Next.js generates the new card and OpenNext packages it for production. Missing dedicated artwork uses the master template; it does not block the build.
4. Optionally prepare dedicated artwork later. Follow the master reference and prompts below, keep all text and prices out of the artwork, and export a 1200 by 630 JPEG into the source artwork directory.

Blog artwork keys default to the canonical path with slashes replaced by `--`, without leading/trailing slashes. For example, `/blogs/example` uses `blogs--example.jpg`. A translated blog with an English alternate reuses the English artwork. Static pages and industry pages use their content file names, such as `home.jpg` or `taxi.jpg`. New static-page types receive a generic Webdevamin label and a localized action label by default.

Titles use `seo.ogTitle`, then the page title or `seo.title`. Descriptions use `seo.ogDescription` or `seo.description`. An optional `seo.socialImage` object supports `title`, `description`, `illustrationKey` and `artworkVersion` for card-specific adjustments. These fields do not change the page's ordinary SEO text. Keep titles short enough for three readable lines; an excessively long title needs a shorter override rather than clipping important information.

## Builds and caching

`npm run build` creates the final images in Next.js build output. The existing Cloudflare deployment command also runs this build. OpenNext uses its built-in static-assets incremental cache and cache interception to serve the pre-rendered cards; it does not require a new storage binding. Image routes bypass language middleware and have no timed regeneration. Existing public page rendering and the contact API remain separate from the static image routes.

OpenNext copies its prepared cache into Workers static assets during its cache-population step before deployment. Use the existing OpenNext deployment command, rather than deploying an unpopulated output directory directly with Wrangler.

Image URLs include a version derived from card copy, illustration key, artwork version and the shared design version. Copy edits update the URL automatically. After replacing artwork, increment `seo.socialImage.artworkVersion` for every page sharing it, or bump `SOCIAL_IMAGE_DESIGN_VERSION` in `utils/social-image-data.mjs` to refresh all cards. Bump the shared version when changing the renderer, template or fonts. Social platforms can retain their own cached previews until they scrape the page again.

Source artwork and fonts belong in version control. Generated images remain in the already-ignored `.next` and `.open-next` directories. Previous hero images and OG assets are preserved.

## Checks

```sh
node --test tests/social-images.test.mjs
npm run build
```

Confirm every public URL in the sitemap has a corresponding pre-rendered image, with 1200 by 630 dimensions and matching Open Graph and Twitter URLs. A Cloudflare packaging check uses `opennextjs-cloudflare build`; it does not deploy. Inspect generated image files directly when checking artwork and text fit. No browser or development server is needed.

To verify the complete local Cloudflare output without deploying or starting a server:

```sh
npx opennextjs-cloudflare build
npx opennextjs-cloudflare populateCache local
VERIFY_SOCIAL_IMAGE_BUILD=1 node --test tests/social-images.test.mjs
```

With the configured static-assets cache, the population command only copies the built cache into local Workers assets. The build test checks all sitemap URLs against actual page metadata, image dimensions, middleware exclusions, static generation and packaged PNG bytes.

## Artwork prompts

Every illustrated human must have a completely blank face: no eyes, eyelids, eyebrows, nose, mouth, lips or other facial details. Use a smooth skin-toned oval, including side profiles, background people, reflections and portraits on device screens. Do not use blurring, masks, glasses or facial hair to hide features. Hair on the head, clothing and poses can remain. This requirement applies to all future artwork prompts and edits.

The seven existing backgrounds with visible faces were updated using the built-in imagegen tool with this edit prompt:

> Edit this existing Webdevamin OG background. Change ONLY the facial details of EVERY human, including tiny people, reflections, and any portraits on screens. Every visible face must be a smooth, entirely blank skin-toned oval with absolutely NO eyes, pupils, eyelids, eyebrows, nose, nostrils, mouth, lips, teeth, cheek features, glasses, moustache, or beard. Remove projecting noses from side profiles too: use smooth featureless oval silhouettes. Keep hair on top/back of heads, heads, bodies, clothing and poses. People seen from behind can stay as they are, provided no facial features are visible. This must be unmistakably faceless editorial illustration, not blurred, censored, masked or obscured faces. Preserve the exact composition, background, scene, lighting, devices, objects, color palette, rounded right frame, red dots and decorative waves, and blank left text area. Do not add people. Keep 1200x630 proportions and do not add any text, labels or watermarks. The whole image should otherwise remain unchanged.

The source artwork was generated with the built-in imagegen tool, then resized and encoded as JPEG with the project's existing Sharp package. Font files are Mohave Bold and Quicksand SemiBold from Google Fonts, with their OFL licenses included.

The master was generated from `public/images/restaurant-website-laten-maken-og.png`, preserving the layout while removing its text, prices and button. It shows a Belgian small-business web design scene. The master also supplies the restaurant artwork; other page scenes use the prompt set below.

Each page prompt consists of this shared instruction, its subject below, and the closing constraints. Attach the master image as the reference.

> Create ONE text-free Webdevamin social-card background using the attached master as a STRICT layout reference. Landscape 1200x630 composition. Keep the same warm pale off-white background, red corner shapes, red dot patterns, delicate bottom-left waves, rounded white illustration frame covering the RIGHT half. The LEFT 46% must be completely empty quiet pale background suitable for code-rendered headings and paragraph copy. Replace ONLY the scene INSIDE the RIGHT frame with this page-specific subject: 

- **home**: A Belgian freelance web designer's bright studio. Large laptop with abstract web design canvas, tablet with a color palette of red and warm neutrals, a phone with a clean mobile website, small model Belgian storefront, plant. The screen should look like generic business website design, not food.
- **blogs**: An inviting editorial workspace for practical web design guides: open notebook, a laptop showing a grid of abstract article image cards, stacked books, red pen, cup of coffee and a desk lamp. Warm sophisticated illustration.
- **contact**: A friendly Belgian web designer and small-business owner discussing a project across a desk. Laptop with abstract website mockup, a red smartphone, simple paper proposal with blank lines, small chat and envelope symbols. No text.
- **policy**: An elegant conceptual scene about online privacy: laptop with an abstract shield and lock symbol, a glass privacy screen, secured document folder with blank pages, soft red highlights and a plant. Calm trustworthy palette and no people.
- **projects**: A polished designer's portfolio workspace: one large desktop display showing an abstract business website, a tablet displaying a dashboard of charts and rectangles, a phone displaying an ecommerce product grid, tidy red accents. Emphasize different digital projects.
- **brugge**: A picturesque Bruges canal with brick stepped-gable houses and the Belfry in the background, foreground laptop and phone showing abstract local business websites, warm late afternoon light, understated red accents. No signage.
- **industries**: Four attractive Belgian miniature businesses arranged as a cohesive street: restaurant, hair salon, taxi outside, and a house being insulated. Foreground laptop with abstract website blocks connecting the businesses, warm scene, red details.
- **taxi**: A professional Belgian taxi company website scene: sleek taxi car outside a Bruges-style street, laptop and phone with abstract ride-booking form blocks and a route map using red pins, warm lighting, no text, no taxi lettering.
- **kapper**: A stylish Belgian hair salon: barber chair, large mirror, scissors and comb, green plant, warm interior. Foreground laptop and phone with abstract salon website and appointment calendar squares. Tasteful red details, no text.
- **isolatiebedrijf**: A Belgian home insulation business: warm brick house with a neatly visible roof insulation cutaway, professional worker fitting insulation in the background. Laptop and phone in the foreground show abstract contractor website and quote form, red accents.
- **blogs--how-to-hire-webdesigner**: A small-business owner meeting a friendly web designer at a studio desk, both looking at a laptop with abstract portfolio thumbnails, a subtle approval checkmark symbol, open notebook, plant. Emphasize finding a reliable professional.
- **blogs--website-vs-webapplication**: A clean comparison of two digital tools: two adjacent laptops on a studio desk, one displays an elegant simple website with hero image and sections, the other a functional dashboard with calendar, graphs and toggles. Red accents connect both devices, no text.
- **blogs--vat-exemption-not-worth-it**: A thoughtful small-business finance desk: calculator, blank invoice sheets, red folder, small globe, European-style buildings faintly in the background, laptop displaying abstract expense chart. Clear editorial illustration about international VAT administration, no text or numbers.
- **blogs--find-businesses-without-websites**: A laptop showing an abstract local business map with red location pins, several Belgian miniature storefronts around it, magnifying glass focused on one shop, a phone displaying a contact card of abstract lines. Emphasize finding local businesses needing a website.
- **blogs--how-to-get-web-development-clients**: A freelance web designer showing an abstract website on a laptop to two engaged small-business clients, warm studio desk, portfolio cards and simple connected person icons. Welcoming professional atmosphere and red accents.
- **nl--blogs--zenchef-alternatief**: A restaurant owner considering two online reservation systems: open laptop and tablet with distinct abstract booking calendars, beautifully set restaurant table, small appointment checkmarks and a phone, warm interior, red details. No logos, no text.
- **nl--blogs--taxibedrijf-starten**: A new taxi business owner beside a clean car on a Belgian city street. Foreground desk with car keys, blank permit document with a checkmark seal, smartphone with abstract route map, warm red-accented illustration. No text or numbers.

> Match the master's sophisticated detailed editorial digital illustration and warm lighting. Every human must be faceless, with a smooth blank skin-toned oval and no eyes, eyebrows, nose, mouth, facial hair or other facial details, including people on screens or in the background. No text, headlines, buttons, prices, labels, numbers, brands, logos, watermarks or legible typography anywhere, including device screens. All interface elements must be abstract blank shapes. Keep the scene within the right frame, and preserve every template element outside that frame. This is source artwork; the final social-card text will be added by code.
