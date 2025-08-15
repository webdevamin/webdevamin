import Header from '../../../../components/Layouts/Header';
import PageLayout from '../../../../components/Layouts/PageLayout';
import Heading from '../../../../components/Heading';
import Contact from '../../../../components/Contact';
import Footer from '../../../../components/Layouts/Footer';
import HeroOne from '../../../../components/Heroes/HeroOne';
import ProjectsList from '../../../../components/ProjectsList';

async function getData(locale) {
    const localesData = (await import(`../../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../../messages/${locale}/socials.json`)).default;
    const blogsData = (await import(`../../../../messages/${locale}/blogs.json`)).default;
    const pagesData = (await import(`../../../../messages/${locale}/pages.json`)).default;
    const contactBlockData = (await import(`../../../../messages/${locale}/contactBlock.json`)).default;
    const projectsData = (await import(`../../../../messages/${locale}/projects.json`)).default;
    const pageData = (await import(`../../../../messages/${locale}/pages/projects.json`)).default;

    return {
        localesData,
        socialsData,
        blogsData,
        pagesData,
        contactBlockData,
        projectsData,
        pageData,
    };
}

export async function generateMetadata({ params: { locale } }) {
    const { pageData } = await getData(locale);
    const { seo, alternates } = pageData;
    const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

    return {
        title: `${title} | Webdevamin`,
        description: description,
        keywords: keywords,
        canonical: canonical,
        alternates: {
            canonical: canonical,
            languages: alternates.reduce((acc, alt) => {
                acc[alt.hreflang] = alt.href;
                return acc;
            }, {}),
        },
        openGraph: {
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            url: canonical,
            siteName: 'Webdevamin',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            creator: '@Webdevamin',
            images: [image],
        },
    };
}

const Projects = async ({ params: { locale } }) => {
    const { localesData, socialsData, blogsData, pagesData, contactBlockData, projectsData, pageData } = await getData(locale);
    const { alternateLangs, title, blocks } = pageData;
    const { subtitle, slug, text } = blocks[1];

    return (
        <>
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
            <PageLayout>
                <div id={slug} className={`block_container overflow-hidden`}>
                    <Heading title={title} subtitle={subtitle} />
                    <p className="max-w-2xl mb-8 opacity-85">{text}</p>
                    <ProjectsList projectsData={projectsData} />
                </div>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
            </PageLayout>
        </>
    );
}

export default Projects;
