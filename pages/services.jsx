import HeroOne from '../components/Heroes/HeroOne'
import Header from '../components/Layouts/Header'
import Seo from '../components/Seo'
import { getData } from '../graphql/api';
import { GET_SERVICES, GET_PAGE } from '../graphql/queries';
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent
} from '../utils/app';
import PageLayout from '../components/Layouts/PageLayout'
import BlockLayoutOne from '../components/Layouts/BlockLayoutOne';
import Heading from '../components/Heading';
import CardOne from '../components/Cards/CardOne';
import Image from 'next/image';
import BlockLayoutTwo from '../components/Layouts/BlockLayoutTwo';
import { Accordion } from 'flowbite-react';
import Contact from '../components/Contact';
import Footer from '../components/Layouts/Footer';
import ButtonOne from '../components/Buttons/ButtonOne';

const Services = ({ pageData, servicesData }) => {
    const { globalData } = pageData;
    const page = destructureCollectionTypeObject(pageData.data.pages, true);
    const { seo, blocks, alternates, localepages } = page;
    const services = destructureCollectionType(servicesData.services);

    const { blogs, socials, contactblock,
        services: servicesGlobal, regions, pages } = globalData;

    const { title: xpTitle, subtitle: xpSubtitle, slug: xpSlug } = blocks[1];

    const { title: whoTitle, text: whoText, slug: whoSlug,
        img: whoImg, button: whoButton,
        summary: whoSummary } = blocks[2];

    const { url: whoUrl, objectFit: whoObjFit, width: whoWidth,
        height: whoHeight, alt: whoAlt } = destructureImageComponent(whoImg);

    const { title: whyTitle, text: whyText,
        img: whyImg, slug: whySlug, summary: whySummary } = blocks[3];

    const { url: whyUrl, objectFit: whyObjFit, width: whyWidth,
        height: whyHeight, alt: whyAlt } = destructureImageComponent(whyImg);

    const { title: whatTitle, subtitle: whatSubtitle,
        text: whatText, subblocks, slug: whatSlug } = blocks[4];

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pages} localepages={localepages} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socialsRaw={socials} />
            <PageLayout>
                <BlockLayoutOne title={xpSlug}>
                    <div className={`text-center`}>
                        <Heading title={xpTitle} subtitle={xpSubtitle} />
                    </div>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 mt-16 
                    xl:mt-0 gap-11 lg:flex-row lg:gap-16`}>
                        {
                            services.map((serviceRaw, index) => {
                                const { title, text, backgroundColor, icon } =
                                    destructureCollectionTypeObject(serviceRaw);

                                return <CardOne title={title}
                                    bgColor={backgroundColor}
                                    key={index} text={text} icon={icon} />
                            })
                        }
                    </div>
                </BlockLayoutOne>
                <BlockLayoutTwo title={whoTitle} slug={whoSlug}
                    contentClasses={`xl:flex-row-reverse`}>
                    <div className={`mb-8 md:mb-0 md:basis-10/12 xl:mr-8`}>
                        <h2 className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                            <Heading title={whoTitle} />
                        </h2>
                        <Image src={whoUrl}
                            objectFit={whoObjFit} alt={whoAlt}
                            width={whoWidth} height={whoHeight} />
                    </div>
                    <div className={`md:w-full`}>
                        <div className={`hidden md:block`}>
                            <Heading title={whoTitle} />
                        </div>
                        <h3 className={`text-base sm:text-lg md:mb-4 
                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                            {whoSummary}
                        </h3>
                        <div dangerouslySetInnerHTML={{ __html: whoText }} />
                        <ButtonOne href={whoButton[0].href}
                            text={whoButton[0].text} wFit external />
                    </div>
                </BlockLayoutTwo>
                <BlockLayoutTwo title={whyTitle} slug={whySlug} position={`right`}>
                    <div className={`mb-8 md:mb-0 md:basis-10/12`}>
                        <div className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                            <Heading title={whoTitle} />
                        </div>
                        <Image src={whyUrl}
                            objectFit={whyObjFit} alt={whyAlt}
                            width={whyWidth} height={whyHeight} />
                    </div>
                    <div className={`md:w-full xl:ml-8`}>
                        <div className={`hidden md:block`}>
                            <Heading title={whoTitle} />
                        </div>
                        <h3 className={`text-base sm:text-lg md:mb-4 
                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                            {whySummary}
                        </h3>
                        <div dangerouslySetInnerHTML={{ __html: whyText }} />
                    </div>
                </BlockLayoutTwo>
                <BlockLayoutOne title={whatSlug}>
                    <div>
                        <Heading title={whatTitle} subtitle={whatSubtitle} />
                        <div dangerouslySetInnerHTML={{ __html: whatText }} />
                    </div>
                    <div id={`accordion`} className={`w-full mt-10 
                    lg:mt-12 xl:mt-0`}>
                        <Accordion>
                            {
                                subblocks.map((subblock, index) => {
                                    const { title, text } = subblock;

                                    return (
                                        <Accordion.Panel key={index}>
                                            <Accordion.Title>
                                                {title}
                                            </Accordion.Title>
                                            <Accordion.Content>
                                                <div className={`text-left text-sm lg:text-base`}>
                                                    {text}
                                                </div>
                                            </Accordion.Content>
                                        </Accordion.Panel>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </BlockLayoutOne>
                <Contact content={contactblock} />
                <Footer servicesRaw={servicesGlobal} blogsRaw={blogs}
                    socialsRaw={socials} regionsRaw={regions} />
            </PageLayout>
        </>
    )
}

export default Services

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_PAGE, { "slug": "services", "locale": [locale] });
    const servicesData = await getData(GET_SERVICES, { locale: [locale] }, false);

    return {
        props: { pageData, servicesData },
    }
}