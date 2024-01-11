import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import useConsentStore from "../utils/store";
import Cookies from 'js-cookie';

const key = `wda-consent`;

const expirationDate = new Date();
expirationDate.setFullYear(expirationDate.getFullYear() + 1);

const CookieConsent = () => {
    const router = useRouter();
    const { locale } = router;

    const [hideConsent, setHideConsent] = useState(true);
    const { update } = useConsentStore();

    useEffect(() => {
        if (!Cookies.get(key)) setHideConsent(false);
    }, [])

    const acceptBtn = locale === `en` ? `Accept` : `Akkoord`;
    const declineBtn = locale === `en` ? `Decline` : `Weigeren`;

    const text = locale === `en` ? `This website uses data collection to enhance the browsing experience. You can decline to disable these features.` : `Deze website maakt gebruik van gegevensverzameling voor een verbeterde browse-ervaring. U kunt ervoor kiezen dit uit te schakelen door te weigeren.`;

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
        <section className={`${hideConsent && `hidden`} fixed bottom-0 left-1/2 w-full py-15 p-6 bg-light border-t-2 border-dark flex flex-col items-center justify-center transform -translate-x-1/2 z-50`}>
            <p className='text-dark text-center font-medium text-sm max-w-4xl'>{text}</p>
            <div className="flex mt-3 w-full gap-3 max-w-lg">
                <button onClick={acceptConsent} className='text-white bg-dark w-full rounded border-2 border-dark text-sm py-2 font-bold'>{acceptBtn}</button>
                <button onClick={declineConsent} className='text-dark font-bold w-full rounded border-2 border-dark text-sm py-2'>{declineBtn}</button>
            </div>
        </section>
    )
}

export default CookieConsent