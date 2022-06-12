import Link from 'next/link';
import Seo from '../components/Seo'
import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/404.json';
import { useTranslations } from "next-intl";
import Header from "../components/Header";

const NotFound = () => {
    const t = useTranslations('notFound');

    return (
        <>
            <Seo title={t('title')} description={t('text')}/>
            <Header />
            <main className='not_found'>
                <Lottie
                    animationData={lottieJson}
                    play
                    style={{ maxWidth: '500px', maxHeight: '500px', marginLeft: 'auto', marginRight: 'auto' }}
                />
                <p>{t('text')}</p>
                <Link href={'/'}>
                    <a className='button button_primary'>
                        {t('link')}
                    </a>
                </Link>
            </main>
        </>
    )
}

export default NotFound;

export async function getStaticProps({ locale }) {
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            messages: (await import(`../lang/${locale}.json`)).default
        }
    };
}