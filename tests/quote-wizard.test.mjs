import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { TAXI_CATALOG, TAXI_ONE_TIME } from '../utils/taxi-pricing.mjs';
import { STEPS, nextStep, prefill, priceLine, recommend } from '../utils/quote-wizard.mjs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));
const wizard = json('messages/nl/pages/offerte.json').wizard;
const answers = changes => ({ ...prefill(wizard, ''), ...changes });

test('the matching package follows the sector and the chosen features', () => {
    const pick = changes => recommend(wizard, answers(changes));
    assert.equal(pick({ features: ['none'] }).name, 'Standaard');
    assert.equal(pick({ sector: 'other', features: ['booking'] }).monthly, 70);
    assert.equal(pick({ sector: 'kapper', features: ['booking'] }).monthly, 90);
    assert.equal(pick({ sector: 'kapper', features: ['booking', 'marketing'] }).name, 'Pro');
    assert.equal(pick({ sector: 'restaurant', features: ['selling'] }).monthly, 140);
    assert.equal(pick({ sector: 'taxi', features: ['booking'] }).name, 'Booking');
    // Nothing covers it, or the visitor asked for custom work: a fixed price after a short call.
    assert.equal(pick({ sector: 'other', features: ['selling'] }).key, 'op-maat');
    assert.equal(pick({ sector: 'aannemer', features: ['booking'] }).key, 'op-maat');
    assert.equal(pick({ need: 'custom', sector: 'kapper', features: ['none'] }).key, 'op-maat');
});

test('the price line covers monthly, one-time and custom packages', () => {
    const line = changes => priceLine(wizard, recommend(wizard, answers(changes)), changes.payment);
    assert.equal(line({ sector: 'kapper', features: ['booking'], payment: 'monthly' }), '€90 per maand');
    assert.equal(line({ sector: 'taxi', features: ['booking'], payment: 'onetime' }), 'Eenmalig vanaf €1.890');
    // Restaurant reservations and ordering are only offered per month.
    assert.equal(line({ sector: 'restaurant', features: ['booking'], payment: 'onetime' }), '€90 per maand');
    assert.equal(line({ sector: 'aannemer', features: ['none'], payment: 'onetime' }), wizard.prices.custom);
    assert.equal(line({ need: 'custom', features: ['none'] }), wizard.prices.custom);
});

test('a ?pakket= link answers questions ahead and the wizard skips them', () => {
    assert.deepEqual(prefill(wizard, 'kapper-premium'), { need: '', sector: 'kapper', features: ['booking', 'emails'], payment: '', timing: '' });
    assert.deepEqual(prefill(wizard, 'premium').features, ['booking', 'emails']);
    assert.deepEqual(prefill(wizard, 'standaard').features, ['none']);
    assert.equal(prefill(wizard, 'taxi-op-maat').need, 'custom');
    assert.equal(prefill(wizard, 'restaurant-eenmalig').payment, 'onetime');
    assert.deepEqual(prefill(wizard, 'unknown'), prefill(wizard, ''));
    const linked = prefill(wizard, 'kapper-premium');
    assert.equal(nextStep(linked), 0);
    assert.equal(nextStep({ ...linked, need: 'new' }, 0), STEPS.indexOf('payment'));
    assert.equal(nextStep({ ...linked, need: 'new', payment: 'monthly', timing: 'soon' }, 0), STEPS.length);
});

test('every quote link on the site fills in at least one answer', () => {
    const sources = [...fs.readdirSync(new URL('../messages/nl', import.meta.url), { recursive: true })]
        .filter(file => file.endsWith('.json')).map(file => read(`messages/nl/${file}`));
    const values = new Set(sources.flatMap(source => [...source.matchAll(/\?offerte=([a-z0-9-]+)/g)].map(match => match[1])));
    assert.ok(values.size > 10);
    for (const value of values) {
        assert.notDeepEqual(prefill(wizard, value), prefill(wizard, ''), value);
    }
});

test('wizard prices match the pricing page, the sector pages and the taxi offer', () => {
    const byName = Object.fromEntries(wizard.packages.map(item => [item.name, item.monthly]));
    const offers = json('messages/nl/pages/prijzen.json').jsonLd.service.offers;
    assert.deepEqual(byName, Object.fromEntries(offers.map(offer => [offer.name, Number(offer.price)])));

    for (const sector of ['kapper', 'restaurant']) {
        const catalog = json(`messages/nl/industries/${sector}.json`).jsonLd.service.hasOfferCatalog.itemListElement;
        const published = Object.fromEntries(catalog.map(offer => [offer.itemOffered.name.split(' ')[0], Number(offer.price ?? offer.priceSpecification?.price)]));
        assert.deepEqual(Object.fromEntries(wizard.sectors[sector].packages.map(item => [item.name, item.monthly])), published, sector);
    }
    for (const sector of ['aannemer', 'isolatiebedrijf']) {
        const items = json(`messages/nl/industries/${sector}.json`).blocks.find(block => block.slug === 'pricing').items;
        assert.equal(Number(items.find(item => item.title === 'Standaard').price), wizard.sectors[sector].packages[0].monthly, sector);
    }

    const taxi = wizard.sectors.taxi.packages;
    assert.deepEqual(taxi.map(item => item.monthly), TAXI_CATALOG.packages.slice(0, 2).map(item => item.monthlyPriceEur));
    assert.deepEqual(taxi.map(item => item.oneTime), [TAXI_ONE_TIME.website, TAXI_ONE_TIME.booking]);
});

test('every feature a package covers is a choice in the wizard', () => {
    const features = wizard.steps.find(step => step.key === 'features').options.map(option => option.value);
    const packages = [...wizard.packages, ...Object.values(wizard.sectors).flatMap(sector => sector.packages || [])];
    for (const item of packages) {
        for (const feature of item.covers) assert.ok(features.includes(feature), `${item.name}: ${feature}`);
    }
    assert.deepEqual(wizard.steps.map(step => step.key), STEPS);
});
