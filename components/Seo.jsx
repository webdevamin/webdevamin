import React from 'react'
import Head from "next/head";

const Seo = ({ seo, alternates }) => {
    const { title, description, canonical } = seo;

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{`${title} | Webdevamin`}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Webdevamin`} />
            <meta property="og:image" content={`/images/ogbanner.png`} />
            <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
            <meta property="og:description" content={description} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href={canonical} />
            {
                alternates.map((alternate, index) => {
                    const { hreflang, href } = alternate;
                    const formattedHreflang = hreflang.replace(`_`, `-`);

                    return (
                        <link rel="alternate" hrefLang={formattedHreflang}
                            href={href} key={index} />
                    )
                })
            }
        </Head>
    )
}

export default Seo