/*
 * Koppelt per taal de slug van een sectorpagina aan het JSON-bestand in
 * messages/{locale}/industries.
 */
export const slugToFileMap = {
  nl: {
    'taxi-website-laten-maken': 'taxi',
    'kapper-website-laten-maken': 'kapper',
    'restaurant-website-laten-maken': 'restaurant',
  },
};

/*
 * Haalt de kaart van elke sectorpagina op voor het sectoroverzicht en het blok
 * "Andere sectoren". excludeSlug laat de huidige pagina weg. Een JSON-bestand
 * zonder `card` wordt overgeslagen. De afbeelding is de hero-afbeelding van
 * de sectorpagina.
 */
export async function getIndustryCards(locale, excludeSlug) {
  const localeMap = slugToFileMap[locale] || {};

  const cards = await Promise.all(
    Object.entries(localeMap)
      .filter(([slug]) => slug !== excludeSlug)
      .map(async ([slug, fileName]) => {
        const { card, blocks } = (await import(`../messages/${locale}/industries/${fileName}.json`)).default;
        const heroImage = blocks.find(block => block.slug === 'hero')?.image;

        return card ? { ...card, image: heroImage, href: `/industry/${slug}` } : null;
      })
  );

  return cards.filter(Boolean);
}
