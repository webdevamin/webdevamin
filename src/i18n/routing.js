import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'nl'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Don't prefix the default locale in paths ("/" shows English)
    localePrefix: 'as-needed',

    // Do not auto-redirect based on Accept-Language
    localeDetection: false
});