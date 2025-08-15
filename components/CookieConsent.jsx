'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useStore from "../utils/store";
import Cookies from 'js-cookie';
import Link from 'next/link';

const key = `wda-consent`;

const expirationDate = new Date();
expirationDate.setFullYear(expirationDate.getFullYear() + 1);

const CookieConsent = () => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1] || 'en';

    const [hideConsent, setHideConsent] = useState(true);
    const { update } = useStore();

    useEffect(() => {
        if (!Cookies.get(key)) setHideConsent(false);
    }, [])

    const acceptBtn = locale === `en` ? `Accept` : `Akkoord`;
    const declineBtn = locale === `en` ? `Decline` : `Weigeren`;

    const text = locale === `en` ? `This website uses data collection to enhance the browsing experience.` : `Deze website maakt gebruik van gegevensverzameling voor een beterde browse-ervaring.`;

    const acceptConsent = () => {
        Cookies.set(key, 'enable', {
            expires: expirationDate,
        });

        setHideConsent(true)
        update('enable');
    }

    const declineConsent = () => {
        Cookies.set(key, 'disable', {
            expires: expirationDate,
        });

        setHideConsent(true)
        update('disable');
    }

    return (
        <div className={`${hideConsent && `hidden`} fixed bottom-0 left-1/2 w-full py-15 p-6 bg-light border-t-2 border-dark flex flex-col items-center justify-center transform -translate-x-1/2 z-50 xl:flex-row xl:gap-12`}>
            <p className='text-dark text-center font-medium text-sm xl:mb-0'>
                <span className='mb-0.5'>{text}{` `}</span>
                <span className={`${locale === 'en' && `hidden`}`}>Lees onze <Link href={`/policy`}>privacybeleid</Link> voor meer info.</span>
                <span className={`${locale === 'nl' && `hidden`}`}>Read our <Link href={`/policy`}>privacy policy</Link> for more info.</span>
            </p>
            <div className="flex mt-3 w-full gap-3 max-w-lg xl:mt-0">
                <button onClick={acceptConsent} className='text-white bg-dark w-full rounded border-2 border-dark text-sm py-2 font-bold'>{acceptBtn}</button>
                <button onClick={declineConsent} className='text-dark font-bold w-full rounded border-2 border-dark text-sm py-2'>{declineBtn}</button>
            </div>
        </div>
    )
}

export default CookieConsent