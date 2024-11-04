import HeroOne from '../../components/Heroes/HeroOne'
import Header from '../../components/Layouts/Header'
import Seo from '../../components/Seo'
import PageLayout from '../../components/Layouts/PageLayout'
import BlockLayoutOne from '../../components/Layouts/BlockLayoutOne';
import Heading from '../../components/Heading';
import CardOne from '../../components/Cards/CardOne';
import Image from 'next/image';
import BlockLayoutTwo from '../../components/Layouts/BlockLayoutTwo';
import { Accordion } from 'flowbite-react';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import ButtonOne from '../../components/Buttons/ButtonOne';

const Services = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, contactBlockData, pageData }) => {
    const { seo, alternates, alternateLangs, title, blocks } = pageData;

    const { title: xpTitle, subtitle: xpSubtitle, slug: xpSlug } = blocks[1];

    const { title: whoTitle, text: whoText, slug: whoSlug,
        img: whoImg, button: whoButton,
        summary: whoSummary } = blocks[2];

    const { src: whoUrl, alt: whoAlt } = whoImg;

    const { title: whyTitle, text: whyText,
        img: whyImg, slug: whySlug, summary: whySummary } = blocks[3];

    const { src: whyUrl, alt: whyAlt } = whyImg;

    const { title: whatTitle, subtitle: whatSubtitle, text: whatText, serviceDetails } = blocks[4];

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData} />
            <PageLayout>
                <BlockLayoutOne title={xpSlug}>
                    <div className={`text-center`}>
                        <Heading title={xpTitle} subtitle={xpSubtitle} />
                    </div>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 mt-16 
                    xl:mt-0 gap-11 lg:flex-row lg:gap-16`}>
                        {
                            servicesData.map((service, i) => {
                                const { title, text, backgroundColor, icon } = service;

                                return <CardOne title={title}
                                    bgColor={backgroundColor}
                                    key={i} text={text} icon={icon} />
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
                        <Image
                            src={whoUrl} width={700} height={400} alt={whoAlt}
                            style={{ objectFit: 'cover' }} />
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
                            <Heading title={whyTitle} />
                        </div>
                        <Image
                            src={whyUrl} width={562} height={396} alt={whyAlt}
                            style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`md:w-full xl:ml-8`}>
                        <div className={`hidden md:block`}>
                            <Heading title={whyTitle} />
                        </div>
                        <h3 className={`text-base sm:text-lg md:mb-4 
                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                            {whySummary}
                        </h3>
                        <div dangerouslySetInnerHTML={{ __html: whyText }} />
                    </div>
                </BlockLayoutTwo>
                <BlockLayoutOne title={title}>
                    <div>
                        <Heading title={whatTitle} subtitle={whatSubtitle} />
                        <div dangerouslySetInnerHTML={{ __html: whatText }}
                            className={`p`} />
                    </div>
                    <div id={`accordion`} className={`w-full mt-10 
                    lg:mt-12 xl:mt-0`}>
                        <Accordion>
                            {
                                serviceDetails.map((serviceDetail, i) => {
                                    const { title, description } = serviceDetail;

                                    return (
                                        <Accordion.Panel key={i}>
                                            <Accordion.Title>
                                                {title}
                                            </Accordion.Title>
                                            <Accordion.Content>
                                                <div className={`text-left text-sm lg:text-base`}>
                                                    {description}
                                                </div>
                                            </Accordion.Content>
                                        </Accordion.Panel>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </BlockLayoutOne>
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
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
            regionsData: (await import(`../../lang/${locale}/regions.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            pageData: (await import(`../../lang/${locale}/pages/services.json`)).default,
        },
    }
}