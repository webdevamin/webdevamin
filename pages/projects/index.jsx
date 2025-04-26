import Header from '../../components/Layouts/Header'
import Seo from '../../components/Seo';
import PageLayout from '../../components/Layouts/PageLayout';
import Heading from '../../components/Heading';
import { useRouter } from 'next/router';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import CardTwo from '../../components/Cards/CardTwo';
import HeroOne from '../../components/Heroes/HeroOne';
import { useEffect, useState } from 'react';

const Projects = ({ localesData, socialsData, blogsData, regionsData, pagesData, contactBlockData, projectsData, pageData }) => {
    const router = useRouter();
    const [animationsReady, setAnimationsReady] = useState(false);

    const { seo, alternates, alternateLangs, title, blocks } = pageData;
    const { subtitle, slug, text } = blocks[1];

    // Add animation effect to reveal projects on page load
    useEffect(() => {
        // Wait for next tick to ensure hydration is complete
        requestAnimationFrame(() => {
            // Add a small delay for better visual effect
            setTimeout(() => {
                setAnimationsReady(true);
            }, 100);
        });
    }, []);

    return (
        <>
            <Seo seo={seo} alternates={alternates} includeCompanyName />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
            <PageLayout>
                <section id={slug} className={`block_container overflow-hidden`}>
                    <Heading title={title} subtitle={subtitle} />
                    <p className="max-w-2xl mb-8 opacity-85">{text}</p>
                    <div
                        className={`pb-8 flex gap-y-14 flex-col md:pb-0 md:pr-0 md:w-full md:grid 
                            md:grid-cols-2 xl:grid-cols-3 md:gap-x-14 md:gap-y-12 lg:mt-14`}
                    >
                        {projectsData.length > 0 ? (
                            projectsData.map((project, i) => {
                                const { title, img, slug, description, border, link, technologies = [], niche = '', price } = project;
                                const { src, alt } = img;
                                const text = router.locale === `en` ? `Read more` : `Verder lezen`;

                                return (
                                    <div
                                        key={i}
                                        className={`min-w-[75vw] sm:min-w-[53vw] md:min-w-0 transition-all duration-700 ease-out ${animationsReady ? 'opacity-100 transform-none' : 'opacity-0 translate-y-6'}`}
                                        style={{
                                            transitionDelay: `${Math.min(i * 100, 500)}ms`,
                                        }}
                                    >
                                        <CardTwo
                                            imgUrl={src}
                                            title={title}
                                            text={text}
                                            subtitle={description}
                                            slug={slug}
                                            alt={alt}
                                            border={border}
                                            type={`project`}
                                            link={link}
                                            technologies={technologies}
                                            badgeAlt={niche} badgeAltTwo={price}
                                        />
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-full py-10 text-center text-gray-500">
                                {router.locale === 'en'
                                    ? 'No projects found in this category.'
                                    : 'Geen projecten gevonden in deze categorie.'}
                            </div>
                        )}
                    </div>
                </section>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData} pages={pagesData}
                    socials={socialsData} regions={regionsData} followExternalLinks />
            </PageLayout>
        </>
    )
}

export default Projects

export async function getStaticProps({ locale }) {
    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            projectsData: (await import(`../../lang/${locale}/projects.json`)).default,
            pageData: (await import(`../../lang/${locale}/pages/projects.json`)).default,
        },
    }
}