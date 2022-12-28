import HeroOne from '../components/Heroes/HeroOne'
import Header from '../components/Layouts/Header'
import Seo from '../components/Seo'
import { getData } from '../graphql/api';
import { GET_ABOUTPAGE, GET_SERVICES } from '../graphql/queries'
import { destructureCollectionType, destructureCollectionTypeObject, destructureSingleType, destructureImageComponent } from '../utils/app';
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

const About = ({ pageData, servicesData }) => {
    const { data, globalData } = pageData;
    const { blogs, socials, contactblock, services: servicesGlobal, navigation } = globalData;
    const { aboutpage } = data;
    const services = destructureCollectionType(servicesData.services);
    const { seo, alternates, localepages, hero, expertise, who, why, what }
        = destructureSingleType(aboutpage);

    const { title: xpTitle, subtitle: xpSubtitle, slug: xpSlug } = expertise;

    const { title: whoTitle, text: whoText, slug: whoSlug,
        img: whoImg, button: whoButton,
        summary: whoSummary } = who;

    const { url: whoUrl, objectFit: whoObjFit, width: whoWidth,
        height: whoHeight, alt: whoAlt } = destructureImageComponent(whoImg);

    const { title: whyTitle, text: whyText,
        img: whyImg, slug: whySlug, summary: whySummary } = why;

    const { url: whyUrl, objectFit: whyObjFit, width: whyWidth,
        height: whyHeight, alt: whyAlt } = destructureImageComponent(whyImg);

    const { title: whatTitle, subtitle: whatSubtitle,
        text: whatText, subBlock, slug: whatSlug } = what;

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header nav={navigation} localepages={localepages} />
            <HeroOne content={hero} socialsRaw={socials} />
            <PageLayout>
                <BlockLayoutOne title={xpSlug}>
                    <div className={`text-center`}>
                        <Heading title={xpTitle} subtitle={xpSubtitle} />
                    </div>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 mt-16 
                    xl:mt-0 gap-11 lg:flex-row lg:gap-12`}>
                        {
                            services.map((serviceRaw, index) => {
                                const { title, text, backgroundColor, icon } =
                                    destructureCollectionTypeObject(serviceRaw);

                                return <CardOne title={title} bgColor={backgroundColor}
                                    key={index} text={text} icon={icon} />
                            })
                        }
                    </div>
                </BlockLayoutOne>
                <BlockLayoutTwo title={whoTitle} slug={whoSlug} contentClasses={`xl:flex-row-reverse`}>
                    <div className={`mb-8 md:mb-0 md:basis-10/12 xl:mr-8`}>
                        <h2 className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                            {whoTitle}
                        </h2>
                        <Image src={whoUrl}
                            objectFit={whoObjFit} alt={whoAlt}
                            width={whoWidth} height={whoHeight} />
                    </div>
                    <div className={`md:w-full`}>
                        <h2 className={`hidden md:block`}>
                            {whoTitle}
                        </h2>
                        <h3 className={`text-base sm:text-lg md:mb-4 
                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                            {whoSummary}
                        </h3>
                        <div dangerouslySetInnerHTML={{ __html: whoText }} />
                        <ButtonOne href={whoButton[0].href} text={whoButton[0].text}
                            wFit external />
                    </div>
                </BlockLayoutTwo>
                <BlockLayoutTwo title={whyTitle} slug={whySlug} position={`right`}>
                    <div className={`mb-8 md:mb-0 md:basis-10/12`}>
                        <h2 className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                            {whyTitle}
                        </h2>
                        <Image src={whyUrl}
                            objectFit={whyObjFit} alt={whyAlt}
                            width={whyWidth} height={whyHeight} />
                    </div>
                    <div className={`md:w-full xl:ml-8`}>
                        <h2 className={`hidden md:block`}>
                            {whyTitle}
                        </h2>
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
                    <div id={`accordion`} className={`w-full mt-10 lg:mt-12 xl:mt-0`}>
                        <Accordion>
                            {
                                subBlock.map((block, index) => {
                                    const { title, text, image, alt } = block;
                                    const { url } = destructureSingleType(image)

                                    return (
                                        <Accordion.Panel key={index}>
                                            <Accordion.Title>
                                                {title}
                                            </Accordion.Title>
                                            <Accordion.Content>
                                                <div className={`text-left text-sm lg:text-base`}>
                                                    {text}
                                                </div>
                                                {
                                                    url && (
                                                        <div className={`mt-8`}>
                                                            <Image src={url} alt={alt}
                                                                objectFit={`cover`}
                                                                width={700} height={300} />
                                                        </div>
                                                    )
                                                }
                                            </Accordion.Content>
                                        </Accordion.Panel>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </BlockLayoutOne>
                <Contact content={contactblock} />
                <Footer servicesRaw={servicesGlobal} blogsRaw={blogs} socialsRaw={socials} />
            </PageLayout>
        </>
    )
}

export default About

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_ABOUTPAGE, { locale: [locale] });
    const servicesData = await getData(GET_SERVICES, { locale: [locale] }, false);

    return {
        props: { pageData, servicesData },
    }
}