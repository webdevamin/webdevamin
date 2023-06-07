import React from 'react'
import Head from "next/head";
import { useRouter } from 'next/router';
import { destructureSingleType } from '../utils/app';

const Seo = ({ seo, alternates }) => {
    const { title, description, canonical, image: img } = seo;
    const router = useRouter();
    const { locale } = router;
    const { url: imageUrl } = destructureSingleType(img);

    const defaultImage = imageUrl || (locale === `nl` ?
        `/images/ogbanner-nl.png` :
        `/images/ogbanner.png`);

    return (
        <Head>
            <meta charSet="utf-8" />
            <title>{`${title} | Webdevamin`}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={`${title} | Webdevamin`} />
            <meta property="og:image" content={defaultImage} />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />
            <meta property="og:url" content={canonical} />
            <meta property="og:description" content={description} />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href={canonical} />
            {
                alternates.map((alternate, index) => {
                    const { hreflang, href } = alternate;

                    return (
                        <link rel="alternate" hrefLang={hreflang}
                            href={href} key={index} />
                    )
                })
            }
        </Head>
    )
}

export default Seo