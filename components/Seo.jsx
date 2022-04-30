import { useTranslations } from "next-intl";
import Head from "next/head";

const Seo = ({ title, description }) => {
    const t = useTranslations('seo');

    const realTitle = title ? `${title} | Amin Intichev` : t('title');
    const realDescription = description ?? t('description');

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{realTitle}</title>
            <meta name="description" content={realDescription} />
            <meta property="og:title" content={realTitle} />
            {/* <meta property="og:image" content={"/assets/images/logo-square.png"} /> */}
            <meta
                property="og:url"
                content={process.env.NEXT_PUBLIC_URL ?? "https://aminintichev.com"}
            />
            <meta property="og:description" content={realDescription} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
    );
};

export default Seo;