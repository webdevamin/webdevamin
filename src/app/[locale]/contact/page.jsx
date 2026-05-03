import Header from '../../../../components/Layouts/Header';
import PageLayout from '../../../../components/Layouts/PageLayout';
import Heading from '../../../../components/Heading';
import Footer from '../../../../components/Layouts/Footer';
import HeroOne from '../../../../components/Heroes/HeroOne';
import ContactForm from '../../../../components/ContactForm';

async function getData(locale) {
    const localesData = (await import(`../../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../../messages/${locale}/socials.json`)).default;
    const blogsData = (await import(`../../../../messages/${locale}/blogs.json`)).default;
    const pagesData = (await import(`../../../../messages/${locale}/pages.json`)).default;
    const pageData = (await import(`../../../../messages/${locale}/pages/contact.json`)).default;

    return {
        localesData,
        socialsData,
        blogsData,
        pagesData,
        pageData,
    };
}

export async function generateMetadata({ params: { locale } }) {
    const { pageData } = await getData(locale);
    const { seo, alternates } = pageData;
    const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

    return {
        title: `${title} | Webdevamin`,
        description: description,
        keywords: keywords,
        canonical: canonical,
        alternates: {
            canonical: canonical,
            languages: alternates.reduce((acc, alt) => {
                acc[alt.hreflang] = alt.href;
                return acc;
            }, {}),
        },
        openGraph: {
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            url: canonical,
            siteName: 'Webdevamin',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            creator: '@Webdevamin',
            images: [image],
        },
    };
}

/*
 * Normaliseert de pakketquery zodat pricing CTA's het contactformulier vooraf
 * kunnen invullen zonder vrije querywaarden door te geven.
 */
const getSelectedPackage = (searchParams) => {
    const packageParam = Array.isArray(searchParams?.pakket)
        ? searchParams.pakket[0]
        : searchParams?.pakket;

    const allowedPackages = ['taxi', 'standaard', 'premium', 'op-maat', 'eenmalig'];

    return allowedPackages.includes(packageParam) ? packageParam : '';
};

const Contact = async ({ params: { locale }, searchParams }) => {
    const { localesData, socialsData, blogsData, pagesData, pageData } = await getData(locale);
    const { alternateLangs, slug, blocks } = pageData;
    const contactBlock = blocks.find(block => block.slug === `contact`);
    const { title: title4, subtitle, text } = contactBlock;
    const selectedPackage = getSelectedPackage(searchParams);

    const formTexts = {
        name: locale === `en` ? `Name` : `Naam`,
        email: locale === `en` ? `Email address` : `E-mailadres`,
        package: locale === `en` ? `Package or service` : `Pakket of dienst`,
        packageOptions: locale === `en` ? [
            { value: 'taxi', label: 'Taxi website' },
            { value: 'standaard', label: 'Standard package' },
            { value: 'premium', label: 'Premium package' },
            { value: 'op-maat', label: 'Custom website' },
            { value: 'eenmalig', label: 'One-time payment' },
        ] : [
            { value: 'taxi', label: 'Taxi website' },
            { value: 'standaard', label: 'Standaard pakket' },
            { value: 'premium', label: 'Premium pakket' },
            { value: 'op-maat', label: 'Op maat' },
            { value: 'eenmalig', label: 'Eenmalige betaling' },
        ],
        message: locale === `en` ? `Your message` : `Uw bericht`,
        send: locale === `en` ? `Submit` : `Verzenden`,
    }

    return (
        <>
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
            <PageLayout>
                <div id={slug} className={`block_container sm:text-center`}>
                    <Heading title={title4} subtitle={subtitle} />
                    <div className={`mt-7 sm:mt-10 xl:mt-16 max-w-4xl mx-auto`}>
                        <div dangerouslySetInnerHTML={{ __html: text }} className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                        <ContactForm content={blocks} formText={formTexts} selectedPackage={selectedPackage} />
                    </div>
                </div>
                <Footer blogs={blogsData} socials={socialsData} pages={pagesData} />
            </PageLayout>
        </>
    );
}

export default Contact;
