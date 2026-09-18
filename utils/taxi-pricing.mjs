export const TAXI_ONE_TIME = Object.freeze({ website: 900, booking: 1890, providerMonthlyExample: 120 });
export const TAXI_KEYS = ['taxi-website', 'taxi-booking', 'taxi-growth'];
// Public website offer. Client agreements and usage limits are configured separately.
export const TAXI_CATALOG = {
  currency: 'EUR', vatIncluded: false, packages: [
    { key: 'taxi-website', monthlyPriceEur: 49, bookings: 0, emails: 500, autocompleteRequests: 0, routes: 0, requiresMaps: false },
    { key: 'taxi-booking', monthlyPriceEur: 89, bookings: 200, emails: 1000, autocompleteRequests: 10000, routes: 1000, requiresMaps: true },
    { key: 'taxi-growth', monthlyPriceEur: 179, bookings: 500, emails: 2500, autocompleteRequests: 25000, routes: 2500, requiresMaps: true },
  ],
};

