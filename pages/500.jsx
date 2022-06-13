import Seo from '../components/Seo'
import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/500.json';
import { useTranslations } from "next-intl";
import React from 'react';

const Error = () => {
    const t = useTranslations('error');

    return (
        <>
            <Seo title={t('title')} description={t('text')}/>
            <main className='error'>
                <Lottie
                    animationData={lottieJson}
                    play
                    style={{ maxWidth: '500px', maxHeight: '500px', marginLeft: 'auto', marginRight: 'auto' }}
                />
                <h1>{t('text')}</h1>
            </main>
        </>
    )
}

export default Error;

export async function getStaticProps({ locale }) {
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            // messages: (await import(`../lang/${locale}.json`)).default
        }
    };
}