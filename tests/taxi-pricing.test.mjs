import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TAXI_CATALOG } from '../utils/taxi-pricing.mjs';
import { applyTaxiPricing } from '../utils/taxi-page.mjs';

const source = JSON.parse(fs.readFileSync(new URL('../messages/nl/industries/taxi.json', import.meta.url), 'utf8'));
test('local taxi offer supplies page prices, allowances and structured data', () => {
  const page = applyTaxiPricing(source);
  const items = page.blocks.find(block => block.slug === 'pricing').items;
  assert.deepEqual(items.slice(0, 3).map(item => item.price), ['49', '89', '179']);
  assert.equal(items[3].title, 'Op Maat');
  assert.deepEqual(TAXI_CATALOG.packages.map(item => item.bookings), [0, 200, 500]);
  assert.deepEqual(page.jsonLd.service.hasOfferCatalog.itemListElement.map(item => item.price), [49, 89, 179]);
  assert.match(page.jsonLd.faqPage.mainEntity[0].acceptedAnswer.text, /89/);
  assert.doesNotMatch(JSON.stringify(page), /\{\{|calculator|tijdelijk niet beschikbaar/);
});
