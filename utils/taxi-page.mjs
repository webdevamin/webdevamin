import { TAXI_ONE_TIME, TAXI_CATALOG } from './taxi-pricing.mjs';

export function applyTaxiPricing(source, catalog = TAXI_CATALOG) {
  const packages = catalog?.packages || [];
  const euro = value => new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
  const tokens = {
    websiteMonthly: packages[0] ? euro(packages[0].monthlyPriceEur) : 'prijs op aanvraag',
    bookingMonthly: packages[1] ? euro(packages[1].monthlyPriceEur) : 'prijs op aanvraag',
    growthMonthly: packages[2] ? euro(packages[2].monthlyPriceEur) : 'prijs op aanvraag',
    oneTimeWebsite: euro(TAXI_ONE_TIME.website), oneTimeBooking: euro(TAXI_ONE_TIME.booking), providerMonthly: euro(TAXI_ONE_TIME.providerMonthlyExample),
  };
  const replace = value => typeof value === 'string' ? value.replace(/\{\{(\w+)\}\}/g, (_, key) => tokens[key] ?? '')
    : Array.isArray(value) ? value.map(replace) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replace(item)])) : value;
  const page = replace(source);
  const blocks = Object.fromEntries(page.blocks.map(block => [block.slug, block]));
  const names = { 'taxi-website': 'Website', 'taxi-booking': 'Booking', 'taxi-growth': 'Growth' };
  const number = value => value.toLocaleString('nl-BE');
  blocks.pricing.items = Object.entries(names).map(([key, title]) => {
    const item = packages.find(item => item.key === key);
    const booking = key !== 'taxi-website';
    return {
      title, price: item ? number(item.monthlyPriceEur) : 'Op aanvraag', currency: item ? '€' : '', period: item ? '/maand' : '',
      tagline: booking ? (key === 'taxi-growth' ? 'Meer ruimte voor online boekingen.' : 'Laat klanten hun rit rechtstreeks bij u boeken.') : 'Een eigen website waarop klanten uw bedrijf vinden en contact opnemen.',
      description: booking ? 'Klanten vullen hun adres in en zien de ritprijs. U beheert boekingen, bevestigingen en herinneringen op één plek.' : 'Uw diensten, tarieven en contactgegevens op een overzichtelijke website. Zonder online boeken.',
      limitLabel: booking ? (item ? `${number(item.bookings)} online boekingen per maand` : 'Met online boeken') : 'Zonder online boeken',
      features: [
        ...(item ? [`${number(item.emails)} e-mails vanuit uw website per maand, zoals ${booking ? 'boekingsbevestigingen' : 'berichten via het contactformulier'}`, ...(booking ? [`${number(item.autocompleteRequests)} keer per maand hulp bij het zoeken naar een adres`, `${number(item.routes)} berekeningen van een ritroute per maand`] : [])] : []),
        booking ? 'Website in maximaal 3 talen' : 'Website in 1 taal', '1 zakelijk e-mailaccount, bijvoorbeeld info@uwtaxibedrijf.be',
        'Ruimte op internet voor uw website: ik regel en betaal die',
        'Uw eigen webadres: ik regel en betaal de verlenging',
        'Onderhoud en technische updates: ik neem het werk uit handen',
        booking ? 'De genoemde aantallen e-mails, adreszoekopdrachten en ritberekeningen zijn inbegrepen' : 'De genoemde e-mails vanuit uw website zijn inbegrepen',
      ],
      microcopy: item ? 'Exclusief btw. Minimumtermijn: 12 maanden.' : 'Vraag de actuele prijs en inbegrepen aantallen aan.',
      excludedFeatures: [], buttonText: 'Bespreek dit pakket', buttonHref: '#contact',
    };
  });
  blocks.pricing.items.push({
    title: 'Op Maat', price: 'Op aanvraag', currency: '', period: '',
    tagline: 'Een website die past bij uw eigen werkwijze.',
    description: 'Voor extra functies, meer dan 500 online boekingen per maand of een grotere website. We bespreken uw wensen en maken een persoonlijk voorstel.',
    features: ['Meer dan 3 talen of zakelijke e-mailaccounts', 'Online betalen, SMS of chauffeursplanning op aanvraag', 'Prijs en gebruikslimieten vooraf afgesproken'],
    buttonText: 'Bespreek mijn wensen', buttonHref: '#contact',
  });
  if (!catalog) {
    page.seo.title = page.seo.ogTitle = 'Taxi website laten maken | Bereken uw voorstel';
    page.seo.description = page.seo.ogDescription = 'Vergelijk een taxiwebsite met maandelijks beheer en een eenmalige aankoop. Bespreek uw wensen en verwachte gebruik.';
    page.card.price = 'Actuele prijs op aanvraag';
    blocks.hero.text = 'Een eigen taxiwebsite voor rechtstreekse aanvragen, met online boeken als u dat nodig heeft. Kies voor een maandpakket of een eenmalige aankoop. De actuele maandprijzen zijn tijdelijk niet beschikbaar. Ik bevestig uw prijs persoonlijk.';
    blocks.pricing.text += '<p><strong>De actuele maandprijzen zijn tijdelijk niet beschikbaar.</strong> Neem contact op voor een persoonlijk prijsvoorstel.</p>';
    blocks['faq'].items[0].description = `De actuele maandprijzen zijn tijdelijk niet beschikbaar. Vraag een persoonlijk voorstel aan. Een eenmalige website begint bij ${tokens.oneTimeWebsite}, of ${tokens.oneTimeBooking} met online boeken, exclusief btw. De kosten om uw website te laten werken en onderhoud zijn apart.`;
  }
  page.jsonLd.localBusiness.description = page.seo.description;
  if (catalog) {
    const prices = packages.map(item => item.monthlyPriceEur);
    page.jsonLd.localBusiness.priceRange = `${euro(Math.min(...prices))} tot ${euro(Math.max(...prices))} per maand`;
    page.jsonLd.service.hasOfferCatalog = { '@type': 'OfferCatalog', name: 'Taxi Website Pakketten', itemListElement: packages.map(item => ({
      '@type': 'Offer', itemOffered: { '@type': 'Service', name: names[item.key] }, price: item.monthlyPriceEur, priceCurrency: 'EUR',
      description: `${item.bookings} online boekingen; ${item.emails} e-mails; ${item.autocompleteRequests} adreszoekopdrachten; ${item.routes} routeberekeningen per maand. Minimumtermijn 12 maanden.`,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: item.monthlyPriceEur, priceCurrency: 'EUR', billingDuration: 'P1M', unitText: 'per maand', valueAddedTaxIncluded: false },
    })) };
  }
  page.jsonLd.faqPage = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: blocks.faq.items.map(item => ({
    '@type': 'Question', name: item.title, acceptedAnswer: { '@type': 'Answer', text: item.description.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&') },
  })) };
  return page;
}
