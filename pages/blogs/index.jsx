import Header from '../../components/Layouts/Header'
import Seo from '../../components/Seo';
import PageLayout from '../../components/Layouts/PageLayout';
import Heading from '../../components/Heading';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import CardTwo from '../../components/Cards/CardTwo';
import HeroOne from '../../components/Heroes/HeroOne';

const Blogs = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, contactBlockData, pageData }) => {
    const router = useRouter();

    const { seo, alternates, alternateLangs, blocks } = pageData;

    const { title: titleHeading, slug: slugHeading,
        subtitle: subtitleHeading, text: textHeading } = blocks[1];

    return (
        <>
            <Seo seo={seo} alternates={alternates} includeCompanyName />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData} ctaLink={`#${slugHeading}`} />
            <PageLayout>
                <section id={slugHeading} className={`block_container`}>
                    <Heading title={titleHeading} subtitle={subtitleHeading} />
                    <div dangerouslySetInnerHTML={{ __html: textHeading }}
                        className={`${textHeading ? `pb-6` : `hidden`}`} />
                    <div className={`overflow-x-auto overscroll-x-contain gap-6 
                            pb-6 md:pb-0 md:pr-0 md:w-full md:grid 
                            md:grid-cols-2 xl:grid-cols-3 md:gap-10 md:mt-7 lg:mt-14 
                            ${blogsData.length >= 2 && `pr-[20%] w-screen flex`}`}>
                        {
                            blogsData.map((blog, index) => {
                                const { title, img, slug, description, dev, border } = blog;
                                const { src, alt } = img;
                                const text = router.locale === `en` ? `Read more` : `Verder lezen`;

                                return (
                                    <Link href={`/blogs/${slug}`} key={index} className={`min-w-[75vw] sm:min-w-[53vw] md:min-w-0`}>
                                        <CardTwo imgUrl={src} title={title} text={text}
                                            subtitle={description} slug={slug} alt={alt}
                                            badge={dev && { bText: `dev` }} border={border} type={`blog`} />
                                    </Link>
                                )

                            })
                        }
                    </div>
                </section>
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData} pages={pagesData}
                    socials={socialsData} regions={regionsData} followExternalLinks />
            </PageLayout>
        </>
    )
}

export default Blogs

export async function getStaticProps({ locale }) {
    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../../lang/${locale}/services.json`)).default,
            regionsData: (await import(`../../lang/${locale}/regions.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            pageData: (await import(`../../lang/${locale}/pages/blogs.json`)).default,
        },
    }
}