import React from 'react'
import Head from "next/head";
import { useRouter } from 'next/router';

// Accept jsonLd prop
const Seo = ({ seo, alternates, noIndex = false, includeCompanyName = false, jsonLd }) => {
    const { title, description, canonical, image,
        ogTitle, ogDescription, keywords } = seo;

    const router = useRouter();
    const { locale } = router;

    const defaultImage = image || (locale === `nl` ?
        `/images/ogbanner-nl.png` :
        `/images/ogbanner.png`);

    const defaultOgTitle = ogTitle || title;
    const defaultOgDescription = ogDescription || description;

    return (
        <Head>
            <meta charSet="utf-8" />
            {
                (noIndex) && <meta name="robots" content="noindex,nofollow" />
            }
            <title>{includeCompanyName ? `${title} | Webdevamin` : title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta property="og:title" content={includeCompanyName ? `${defaultOgTitle} | Webdevamin` : defaultOgTitle} />
            <meta property="og:image" content={defaultImage} />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />
            <meta property="og:url" content={canonical} />
            <meta property="og:locale" content={locale} />
            <meta property="og:description" content={defaultOgDescription} />
            <meta property="og:site_name" content="Webdevamin" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href={canonical} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@Webdevamin" />
            <meta name="twitter:title" content={includeCompanyName ? `${defaultOgTitle} | Webdevamin` : defaultOgTitle} />
            <meta name="twitter:description" content={defaultOgDescription} />
            <meta name="twitter:image" content={defaultImage} />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:site" content="@Webdevamin" />
            {
                (alternates && alternates.length > 0) && alternates.map((alternate) => {
                    const { href, hreflang } = alternate;

                    return (
                        <link key={href} rel="alternate" href={href} hrefLang={hreflang} />
                    )
                })
            }

            {/* Conditionally render JSON-LD scripts if jsonLd prop exists */}
            {jsonLd && (
                <>
                    {jsonLd.localBusiness && (
                        <script
                            key="ld-localbusiness"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.localBusiness) }}
                        />
                    )}
                    {jsonLd.service && (
                        <script
                            key="ld-service"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.service) }}
                        />
                    )}
                    {/* Conditionally render FAQ based on existence and maybe router path */}
                    {jsonLd.faq && router.pathname === '/' && ( // Example: Only add FAQ on the homepage
                        <script
                            key="ld-faq"
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faq) }}
                        />
                    )}
                </>
            )}
        </Head>
    )
}

export default Seo