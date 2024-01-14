import React from 'react'
import Head from "next/head";
import { useRouter } from 'next/router';
import { destructureSingleType } from '../utils/app';

const SeoNew = ({ seo, alternates }) => {
    const { title, description, canonical, image: img,
        ogTitle, ogDescription } = seo;

    const router = useRouter();
    const { locale } = router;
    const { url: imageUrl } = destructureSingleType(img);

    const defaultImage = imageUrl || (locale === `nl` ?
        `/images/ogbanner-nl.png` :
        `/images/ogbanner.png`);

    const defaultOgTitle = ogTitle || title;
    const defaultOgDescription = ogDescription || description;
    const arrayAlternates = Object.values(alternates)

    const altLocales = arrayAlternates.filter((altLocale) => {
        return altLocale.hreflang !== locale;
    });

    const alternatesWithoutEnglish = arrayAlternates.filter((alternate) => {
        return alternate.hreflang !== `x-default`;
    });

    const alternateEnglish = arrayAlternates.find((alternate) => {
        return alternate.hreflang === `x-default`;
    });

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{`${title} | Webdevamin`}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${defaultOgTitle} | Webdevamin`} />
            <meta property="og:image" content={defaultImage} />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />
            <meta property="og:url" content={canonical} />
            <meta property="og:locale" content={locale} />
            <meta property="og:description" content={defaultOgDescription} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href={canonical} />
            <link rel="alternate" href={alternateEnglish.href} hrefLang="x-default" />
            {
                alternatesWithoutEnglish.map((alternate) => {
                    const { hreflang, href } = alternate;

                    return (
                        <link rel="alternate" hrefLang={hreflang}
                            href={href} key={href} />
                    )
                })
            }
            {
                altLocales.map((altLocale) => {
                    const { hreflang } = altLocale;

                    return (
                        <meta property="og:locale:alternate" key={hreflang}
                            content={hreflang} />
                    )
                })
            }
        </Head>
    )
}

export default SeoNew