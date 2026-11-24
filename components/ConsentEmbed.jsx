'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Cookies from 'js-cookie';
import useStore from '../utils/store';

// Google Maps and YouTube set cookies, so they only load after cookie consent or a click.
const ConsentEmbed = ({ provider, className = '', children }) => {
    const locale = useLocale();
    const { consent } = useStore();
    const [clicked, setClicked] = useState(false);
    const [savedConsent, setSavedConsent] = useState(false);

    // Read the cookie after mounting so server and browser render the same placeholder first.
    useEffect(() => {
        setSavedConsent(Cookies.get('wda-consent') === 'enable');
    }, [consent]);

    if (clicked || savedConsent) return children;

    const text = locale === 'nl'
        ? { note: `Deze inhoud komt van ${provider}. Bij het laden kan ${provider} cookies plaatsen en uw IP-adres ontvangen.`, button: `${provider} laden` }
        : { note: `This content comes from ${provider}. When it loads, ${provider} may set cookies and receive your IP address.`, button: `Load ${provider}` };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 bg-light p-6 text-center ${className}`}>
            <p className="!mb-0 max-w-md text-sm text-dark">{text.note}</p>
            <button type="button" onClick={() => setClicked(true)}
                className="min-h-11 rounded border-2 border-dark bg-dark px-5 py-2 text-sm font-bold text-white">
                {text.button}
            </button>
        </div>
    );
};

export default ConsentEmbed;
