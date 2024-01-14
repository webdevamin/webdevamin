import Contact from '../components/Contact'
import Footer from '../components/Layouts/Footer'
import { GET_PAGE, GET_TECHS, GET_PROJECTS, GET_BLOGS, GET_TESTIMONIALS, GET_TYPES } from '../graphql/queries';
import { getData } from '../graphql/api';
import { useRouter } from 'next/router';
import SeoNew from '../components/SeoNew';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import HeaderNew from '../components/Layouts/HeaderNew';

const Policy = ({ pageData }) => {
    const router = useRouter();
    const { locale } = router;

    const { t } = useTranslation('policy')
    const { globalData } = pageData;

    const { blogs: blogsGlobal, pages, services, socials,
        regions, contactblock } = globalData;
    // const { globalData } = pageData;
    
    // const { blogs: blogsGlobal, pages, services, socials,
    //     regions, contactblock } = globalData;

    return (
        <>
            <SeoNew seo={t('seo', { returnObjects: true })} alternates={t('alternates', { returnObjects: true })} />
            <HeaderNew pages={pages} localepages={t('localepages', { returnObjects: true })} currentLocale={locale}/>
            {/* <div className='page_container max-w-8xl container pt-16'>
                <section className='block_container'>
                    <div className='mb-8'>
                        <h1 className='h2'>{title}</h1>
                        <p>{text}</p>
                    </div>
                    <div className='mb-10'>
                        {
                            blocks.map((block, i) => {
                                const { title, text } = block;

                                return (
                                    <article key={i} className='mb-8'>
                                        <h2 className='h4'>{title}</h2>
                                        <p>{text}</p>
                                    </article>
                                )
                            })
                        }
                    </div>
                    <div>
                        <ButtonOne href={'/'} text={'Naar homepagina'} wFit />
                    </div>
                </section>
            </div> */}
            <Contact content={contactblock} />
            <Footer servicesRaw={services} blogsRaw={blogsGlobal} pagesRaw={pages}
                socialsRaw={socials} regionsRaw={regions} followExternalLinks />
        </>
    )
}

export default Policy

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_PAGE, { "slug": "home", "locale": [locale] });

    return {
        props: {
            pageData,
            ...(await serverSideTranslations(locale, [
                'common',
                'policy'
            ]))
        },
    }
}