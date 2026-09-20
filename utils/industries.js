import { TAXI_CATALOG } from './taxi-pricing.mjs';
import { applyTaxiPricing } from './taxi-page.mjs';

/*
 * Koppelt per taal de slug van een sectorpagina aan het JSON-bestand in
 * messages/{locale}/industries.
 */
export const slugToFileMap = {
  nl: {
    'taxi-website-laten-maken': 'taxi',
    'kapper-website-laten-maken': 'kapper',
    'restaurant-website-laten-maken': 'restaurant',
    'isolatiebedrijf-website-laten-maken': 'isolatiebedrijf',
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
        const raw = (await import(`../messages/${locale}/industries/${fileName}.json`)).default;
        const { card, blocks } = fileName === 'taxi' ? applyTaxiPricing(raw, TAXI_CATALOG) : raw;
        const heroImage = blocks.find(block => block.slug === 'hero')?.image;

        return card ? { ...card, image: heroImage, href: `/industry/${slug}` } : null;
      })
  );

  return cards.filter(Boolean);
}
