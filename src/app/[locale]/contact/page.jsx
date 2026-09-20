import Header from '../../../../components/Layouts/Header';
import PageLayout from '../../../../components/Layouts/PageLayout';
import Heading from '../../../../components/Heading';
import Footer from '../../../../components/Layouts/Footer';
import HeroOne from '../../../../components/Heroes/HeroOne';
import ContactForm from '../../../../components/ContactForm';
import BorderedSection from '../../../../components/Layouts/BorderedSection';

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

export async function generateMetadata({ params }) {
  const { locale } = await params;
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

const Contact = async ({ params, searchParams }) => {
  const { locale } = await params;
    const { localesData, socialsData, blogsData, pagesData, pageData } = await getData(locale);
    const { alternateLangs, slug, blocks } = pageData;
    const contactBlock = blocks.find(block => block.slug === `contact`);
    const { title: title4, subtitle, text } = contactBlock;
    const packageMessages = {
        isolatiebedrijf: 'Dag Amin, ik heb interesse in een website voor mijn isolatiebedrijf vanaf €49/maand excl. btw. Kunnen we bespreken wat bij mijn bedrijf past?',
        'isolatiebedrijf-op-maat': 'Dag Amin, ik wil graag het pakket Op maat voor mijn isolatiebedrijf bespreken, bijvoorbeeld met online afspraken, klantenbeheer of andere extra functies.',
        'isolatiebedrijf-eenmalig': 'Dag Amin, ik heb interesse in een website voor mijn isolatiebedrijf met een eenmalige betaling. Graag bespreek ik de mogelijkheden en de kosten voor hosting en domeinnaam.',
        restaurant: 'Dag Amin, ik wil graag bespreken wat er mogelijk is voor mijn restaurantwebsite.',
        'restaurant-standaard': 'Dag Amin, ik heb interesse in Standaard voor mijn restaurant (€49/maand excl. btw).',
        'restaurant-premium': 'Dag Amin, ik heb interesse in Premium met online reservaties voor mijn restaurant (€89/maand excl. btw).',
        'restaurant-pro': 'Dag Amin, ik heb interesse in Pro met online reservaties, bestellingen en meertaligheid (€139/maand excl. btw).',
        'restaurant-op-maat': 'Dag Amin, ik wil graag een website of webapplicatie op maat voor mijn restaurant bespreken.',
        'restaurant-eenmalig': 'Dag Amin, ik heb interesse in een restaurantwebsite met eenmalige betaling, zonder reservatie- of bestelsysteem.',
    };
    const selectedPackage = searchParams?.pakket;
    const initialMessage = locale === 'nl' && typeof selectedPackage === 'string'
        && Object.hasOwn(packageMessages, selectedPackage) ? packageMessages[selectedPackage] : '';

    const formTexts = {
        name: locale === `en` ? `Name` : `Naam`,
        email: locale === `en` ? `Email address` : `E-mailadres`,
        message: locale === `en` ? `Your message` : `Uw bericht`,
        send: locale === `en` ? `Submit` : `Verzenden`,
    }

    return (
        <>
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne
                content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData}
                breadcrumbItems={[
                    { label: 'Home', href: locale === 'nl' ? '/nl' : '/' },
                    { label: pageData.title },
                ]}
                breadcrumbLocale={locale}
            />
            <PageLayout>
                <BorderedSection>
                    <div id={slug} className={`block_container sm:text-center`}>
                        <Heading title={title4} subtitle={subtitle} />
                        <div className={`mt-7 sm:mt-10 xl:mt-16 max-w-4xl mx-auto`}>
                            <div dangerouslySetInnerHTML={{ __html: text }} className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                            <ContactForm key={initialMessage} content={blocks} formText={formTexts} initialMessage={initialMessage} />
                        </div>
                    </div>
                </BorderedSection>
                <Footer blogs={blogsData} socials={socialsData} pages={pagesData} />
            </PageLayout>
        </>
    );
}

export default Contact;
