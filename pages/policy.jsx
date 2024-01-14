import Header from '../components/Layouts/Header'
import PageLayout from '../components/Layouts/PageLayout'
import { getData } from '../graphql/api';
import { GET_PAGE } from '../graphql/queries';
import { destructureCollectionTypeObject } from '../utils/app';
import Seo from '../components/Seo';
import Heading from '../components/Heading';
import Footer from '../components/Layouts/Footer';
import HeroOne from '../components/Heroes/HeroOne';

const Policy = ({ pageData }) => {
    const { globalData } = pageData;
    const page = destructureCollectionTypeObject(pageData.data.pages, true);

    const { blogs, pages, services, socials, regions } = globalData;
    const { seo, blocks, alternates, localepages } = page;
    const { title, slug, subtitle, text } = blocks[1];

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pages} localepages={localepages} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socialsRaw={socials} />
            <PageLayout>
                <section id={slug} className={`block_container`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`mt-7 sm:mt-10 xl:mt-16 lg:w-10/12`}>
                        <div dangerouslySetInnerHTML={{ __html: text }}
                            className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                    </div>
                </section>
                <Footer servicesRaw={services} blogsRaw={blogs} pagesRaw={pages}
                    socialsRaw={socials} regionsRaw={regions} />
            </PageLayout>
        </>
    )
}

export default Policy

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_PAGE, { "slug": "policy", "locale": [locale] });

    return {
        props: { pageData },
    }
}