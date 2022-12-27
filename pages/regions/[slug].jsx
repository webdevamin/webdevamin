import React from 'react'
import { getData } from '../../graphql/api';
import { GET_REGIONS, GET_REGION } from '../../graphql/queries';
import { destructureCollectionType, destructureCollectionTypeObject, destructureImageComponent } from '../../utils/app';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import Header from '../../components/Layouts/Header';
import HeroOne from '../../components/Heroes/HeroOne';
import PageLayout from '../../components/Layouts/PageLayout';
import BlockLayoutTwo from '../../components/Layouts/BlockLayoutTwo';
import Heading from '../../components/Heading';
import Image from 'next/image';
import ButtonOne from '../../components/Buttons/ButtonOne';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';

const Region = ({ data }) => {
    const router = useRouter();
    const { locale } = router;
    const { data: regionData, globalData } = data;

    const regionForCurrentLang = destructureCollectionTypeObject(
        destructureCollectionType(regionData.regions).find(
            (region) => region.attributes.locale === locale));

    const { seo, hero, alternates, contents } = regionForCurrentLang;
    const { blogs, contactblock, services, socials } = globalData;

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header interpol={{
                pathname: `/regions/[slug]`,
                query: { slug: router.query.slug }
            }} />
            <HeroOne content={hero} socialsRaw={socials} smallerTitle />
            <PageLayout>
                {
                    contents.map((content, i) => {
                        const { title, slug, summary, text, subtitle,
                            position, img, button } = content;

                        const { url, objectFit, width, height, alt } = destructureImageComponent(img);
                        const { href, text: buttonText } = button[0] || {};

                        return (
                            position === `none` ? (
                                <section className={`xl:mx-10 xl:text-center block_container`}>
                                    <Heading title={title} subtitle={subtitle} />
                                    <div dangerouslySetInnerHTML={{ __html: text }} />
                                </section>
                            ) : (
                                <BlockLayoutTwo key={i} position={position}
                                    title={title} slug={slug}>
                                    <div className={`mb-8 md:mb-0 md:basis-10/12 xl:mr-8`}>
                                        <h2 className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                                            {title}
                                        </h2>
                                        <Image src={url}
                                            objectFit={objectFit} alt={alt}
                                            width={width} height={height} />
                                    </div>
                                    <div className={`md:w-full 
                                    ${position === `right` ? `xl:ml-8` : `xl:mr-8`}`}>
                                        <h2 className={`hidden md:block`}>
                                            {title}
                                        </h2>
                                        <h3 className={`text-base sm:text-lg md:mb-4 
                                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                                            {summary}
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                        {
                                            button && (
                                                <ButtonOne href={href} text={buttonText} wFit />
                                            )
                                        }
                                    </div>
                                </BlockLayoutTwo>
                            )
                        )
                    })
                }
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs} socialsRaw={socials} />
            </PageLayout>
        </>
    )
}

export default Region

export async function getStaticPaths() {
    const regions =
        destructureCollectionType((await getData(
            GET_REGIONS, { locale: "all" }, false)).regions);

    const paths = regions.map((regionRaw) => {
        const { locale, slug } = destructureCollectionTypeObject(regionRaw);

        return {
            params: { slug }, locale
        }
    });

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps({ locale, params }) {
    params.locale = [locale];
    const data = await getData(GET_REGION, params);

    return {
        props: { data },
    }
}