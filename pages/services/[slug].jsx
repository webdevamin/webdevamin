import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
import PageLayout from '../../components/Layouts/PageLayout';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import HeroOne from '../../components/Heroes/HeroOne';
import { componentMapper } from '../../utils/app';

const Service = ({ localesData, socialsData, servicesData, serviceData, regionsData, pagesData, contactBlockData, blogsData, pricingData }) => {
    const { seo, alternates, alternateLangs, titleTwo,
        description, button, img, contents } = serviceData;

    const heroContent = {
        title: titleTwo, text: description, button, image: img
    }

    return (
        <div>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroOne content={heroContent} socials={socialsData} />
            <PageLayout>
                {
                    contents.map((content, i) => {
                        const ComponentToRender = componentMapper[content.component];
                        return <ComponentToRender key={i} content={content} sideData={pricingData} />
                    })
                }
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </div>
    )
}

export default Service

export async function getStaticPaths() {
    const servicesDataNl = (await import(`../../lang/nl/services.json`)).default;
    // const blogsDataEn = (await import(`../../lang/en/services.json`)).default;

    // const blogsAllLocales = blogsDataNl.concat(blogsDataEn);
    const servicesAllLocales = servicesDataNl

    const paths = servicesAllLocales.map((serviceRaw) => {
        const { locale, slug } = serviceRaw;

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
    const servicesData = (await import(`../../lang/${locale}/services.json`)).default;
    const pricingData = (await import(`../../lang/${locale}/pricing.json`)).default;

    const serviceData = servicesData.find((p) => {
        return p.slug === params.slug;
    });

    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            servicesData,
            regionsData: (await import(`../../lang/${locale}/regions.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            serviceData, pricingData
        }
    }
}