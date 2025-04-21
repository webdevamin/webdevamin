import Header from '../components/Layouts/Header'
import PageLayout from '../components/Layouts/PageLayout'
import Seo from '../components/Seo';
import Heading from '../components/Heading';
import Footer from '../components/Layouts/Footer';
import HeroOne from '../components/Heroes/HeroOne';

const Policy = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, pageData }) => {
    const { seo, alternates, alternateLangs, blocks } = pageData;
    const { title, subtitle, slug: slug1, text } = blocks[1];
    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData} />
            <PageLayout>
                <section id={slug1} className={`block_container`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`mt-7 sm:mt-16 xl:mt-24 lg:w-10/12`}>
                        <div dangerouslySetInnerHTML={{ __html: text }}
                            className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                    </div>
                </section>
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </>
    )
}

export default Policy

export async function getStaticProps({ locale }) {
    return {
        props: {
            localesData: (await import(`../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../lang/${locale}/services.json`)).default,
            pagesData: (await import(`../lang/${locale}/pages.json`)).default,
            // End global data

            pageData: (await import(`../lang/${locale}/pages/policy.json`)).default,
        },
    }
}