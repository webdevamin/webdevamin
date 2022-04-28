import Head from "next/head";

const defaultTitle =
    "Software Developer from Bruges | Amin Intichev";
const defaultDescription =
    "I make full fledged, state-of-art websites/apps regardless of complexity. ✓ User fiendly, ✓ Professional, ✓ Comfort.";

const Seo = ({ title, description }) => {
    const realTitle = title ? `${title} | Amin Intichev` : defaultTitle;
    const realDescription = description ?? defaultDescription;

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