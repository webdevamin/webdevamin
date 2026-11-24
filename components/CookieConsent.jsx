'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import useStore from "../utils/store";
import Cookies from 'js-cookie';
import { Link } from '../src/i18n/navigation';

const key = `wda-consent`;
const GOOGLE_ADS_ID = 'AW-11183393827';

const expirationDate = new Date();
expirationDate.setFullYear(expirationDate.getFullYear() + 1);

// gtag.js only understands `arguments` objects, not plain arrays.
function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
}

const updateGoogleConsent = (status) => {
    gtag('consent', 'update', {
        ad_storage: status,
        analytics_storage: status,
        ad_user_data: status,
        ad_personalization: status,
    });
};

// The Google Ads tag only loads after the visitor accepted.
const loadGoogleAds = () => {
    if (window.__wdaGoogleAdsLoaded) return;
    window.__wdaGoogleAdsLoaded = true;
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    document.head.appendChild(script);
};

// Removes analytics and advertising cookies set before the visitor withdrew consent.
const removeTrackingCookies = () => {
    const domains = [undefined, window.location.hostname, `.${window.location.hostname.replace(/^www\./, '')}`];
    Object.keys(Cookies.get()).forEach((name) => {
        if (/^(ph_|_gcl|_ga|_gid)/.test(name)) {
            domains.forEach((domain) => Cookies.remove(name, { path: '/', domain }));
        }
    });
    try {
        Object.keys(localStorage).forEach((name) => {
            if (name.startsWith('ph_')) localStorage.removeItem(name);
        });
    } catch {}
};

const CookieConsent = () => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] === 'nl' ? 'nl' : 'en';

    const { update, showConsent, setShowConsent } = useStore();

    useEffect(() => {
        const existing = Cookies.get(key);
        if (!existing) {
            setShowConsent(true);
        } else if (existing === 'enable') {
            updateGoogleConsent('granted');
            loadGoogleAds();
        }
    }, [setShowConsent])

    const texts = locale === 'nl'
        ? {
            text: 'Met uw toestemming gebruiken we cookies voor statistieken (PostHog) en advertenties (Google Ads). Weigert u, dan plaatsen we alleen de cookies die nodig zijn om de website te laten werken.',
            more: 'Meer info in ons',
            link: 'privacybeleid',
            accept: 'Akkoord',
            decline: 'Weigeren',
        }
        : {
            text: 'With your consent, we use cookies for statistics (PostHog) and advertising (Google Ads). If you decline, we only set the cookies the website needs to work.',
            more: 'More info in our',
            link: 'privacy policy',
            accept: 'Accept',
            decline: 'Decline',
        };

    const acceptConsent = () => {
        Cookies.set(key, 'enable', { expires: expirationDate });
        setShowConsent(false);
        update('enable');
        updateGoogleConsent('granted');
        loadGoogleAds();
    }

    const declineConsent = () => {
        const hadConsent = Cookies.get(key) === 'enable';
        Cookies.set(key, 'disable', { expires: expirationDate });
        setShowConsent(false);
        update('disable');
        updateGoogleConsent('denied');

        // Scripts that already loaded can't be unloaded, so clean up and start fresh.
        if (hadConsent) {
            removeTrackingCookies();
            window.location.reload();
        }
    }

    const buttonClass = 'w-full rounded border-2 border-dark text-sm py-2 font-bold';

    return (
        <div role="dialog" aria-live="polite" aria-label={locale === 'nl' ? 'Cookie-instellingen' : 'Cookie settings'}
            className={`${!showConsent && `hidden`} fixed bottom-0 left-1/2 w-full py-15 p-6 bg-light border-t-2 border-dark flex flex-col items-center justify-center transform -translate-x-1/2 z-50 xl:flex-row xl:gap-12`}>
            <p className='text-dark text-center font-medium text-sm xl:mb-0'>
                {texts.text}{' '}{texts.more} <Link href={`/policy`}>{texts.link}</Link>.
            </p>
            <div className="flex mt-3 w-full gap-3 max-w-lg xl:mt-0">
                <button onClick={acceptConsent} className={`${buttonClass} text-white bg-dark`}>{texts.accept}</button>
                <button onClick={declineConsent} className={`${buttonClass} text-white bg-dark`}>{texts.decline}</button>
            </div>
        </div>
    )
}

export default CookieConsent
