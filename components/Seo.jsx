import { useTranslations } from "next-intl";
import Head from "next/head";

const Seo = ({ title, description }) => {
    const t = useTranslations('seo');

    const realTitle = title ? `${title} | Webdevamin` : t('title');
    const realDescription = description ?? t('description');

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{realTitle}</title>
            <meta name="description" content={realDescription} />
            <meta property="og:title" content={realTitle} />
            <meta property="og:image" content={t('imagePath')} />
            <meta
                property="og:url"
                content={process.env.NEXT_PUBLIC_URL ?? "https://webdevamin.com"}
            />
            <meta property="og:description" content={realDescription} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="alternate" hrefLang="nl"
                href="https://webdevamin.com/nl" />
            <link rel="alternate" hrefLang="en"
                href="https://webdevamin.com/" />
        </Head>
    );
};

export default Seo;