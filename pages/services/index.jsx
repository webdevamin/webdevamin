import HeroOne from '../../components/Heroes/HeroOne'
import Header from '../../components/Layouts/Header'
import Seo from '../../components/Seo'
import PageLayout from '../../components/Layouts/PageLayout'
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import BlockAccordion from '../../components/Blocks/BlockAccordion';

const Services = ({ localesData, socialsData, blogsData, servicesData, pagesData, contactBlockData, pageData }) => {
    const { seo, alternates, alternateLangs, hero, content: pageContent, serviceLinkBtnText } = pageData;
    const { title, subtitle, text } = pageContent;
    const content = { title, subtitle, text, items: servicesData, itemBtn: serviceLinkBtnText };

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={hero} socials={socialsData} />
            <PageLayout>
                <div className={`lg:px-10`}>
                    <BlockAccordion content={content} />
                </div>
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} pages={pagesData} />
            </PageLayout>
        </>
    )
}

export default Services

export async function getStaticProps({ locale }) {
    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../../lang/${locale}/services.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            pageData: (await import(`../../lang/${locale}/pages/services.json`)).default,
        },
    }
}