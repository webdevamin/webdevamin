import Header from '../components/Layouts/Header'
import PageLayout from '../components/Layouts/PageLayout'
import Seo from '../components/Seo';
import Heading from '../components/Heading';
import Footer from '../components/Layouts/Footer';
import HeroOne from '../components/Heroes/HeroOne';

const Policy = ({ localesData, socialsData, blogsData, regionsData, pagesData, pageData }) => {
    const { seo, alternates, alternateLangs, blocks } = pageData;
    const { title, subtitle, slug, text } = blocks[1];
    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData} />
            <PageLayout>
                <div id={slug} className={`block_container`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`mt-3 sm:mt-8 md:mt-12 lg:w-10/12`}>
                        <div dangerouslySetInnerHTML={{ __html: text }}
                            className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                    </div>
                </div>
                <Footer blogs={blogsData}
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
            pagesData: (await import(`../lang/${locale}/pages.json`)).default,
            // End global data

            pageData: (await import(`../lang/${locale}/pages/policy.json`)).default,
        },
    }
}