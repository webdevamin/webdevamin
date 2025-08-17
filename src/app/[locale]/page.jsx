import About from '../../../components/Home/About'
import Header from '../../../components/Layouts/Header'
import Projects from '../../../components/Home/Projects'
import Testimonials from '../../../components/Home/Testimonials'
import PageLayout from '../../../components/Layouts/PageLayout'
import Blogs from '../../../components/Home/Blogs'
import Contact from '../../../components/Contact'
import Footer from '../../../components/Layouts/Footer'
import Hero from '../../../components/Home/Hero'
import PricingSection from '../../../components/Home/Pricing'
import BlockAccordion from '../../../components/Blocks/BlockAccordion'
import Services from '../../../components/Home/Services'
import CallToAction from '../../../components/Home/CallToAction'
import Why from '../../../components/Home/Why'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import JsonLd from '../../../components/SEO/JsonLd'

async function getData(locale) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const localesData = (await import(`../../../messages/${locale}/locales.json`)).default;
  const socialsData = (await import(`../../../messages/${locale}/socials.json`)).default;
  const blogsData = (await import(`../../../messages/${locale}/blogs.json`)).default;
  const pagesData = (await import(`../../../messages/${locale}/pages.json`)).default;
  const heroBannerData = (await import(`../../../messages/${locale}/heroBanner.json`)).default;
  const contactBlockData = (await import(`../../../messages/${locale}/contactBlock.json`)).default;
  const projectsData = (await import(`../../../messages/${locale}/projects.json`)).default;
  const pageData = (await import(`../../../messages/${locale}/pages/home.json`)).default;

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    heroBannerData,
    contactBlockData,
    projectsData,
    pageData,
  };
}

export async function generateMetadata({ params: { locale } }) {
  const { pageData } = await getData(locale);
  const { seo, alternates, jsonLd } = pageData;
  const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

  const defaultImage = image || (locale === `nl` ?
    `/images/ogbanner-nl.png` :
    `/images/ogbanner.png`);

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
          url: defaultImage,
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
      images: [defaultImage],
    },
    other: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-UA-Compatible': 'IE=edge',
    },
    jsonLd: jsonLd,
  };
}

const Index = async ({ params: { locale } }) => {
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    heroBannerData,
    contactBlockData,
    projectsData,
    pageData,
  } = await getData(locale);

  const { alternates, alternateLangs, blocks } = pageData;

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} heroBannerData={heroBannerData} />
      <Hero content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
      <PageLayout>
        <About content={blocks.find(block => block.slug === `about`)} />
        {blocks.find(block => block.slug === `why-all-in-one`) && (
          <Why content={blocks.find(block => block.slug === `why-all-in-one`)} />
        )}
        <Services content={blocks.find(block => block.slug === `services`)} />
        <Projects content={blocks.find(block => block.slug === `projects`)} data={projectsData} />
        <Blogs content={blocks.find(block => block.slug === `blogs`)} data={blogsData} />
        <PricingSection content={blocks.find(block => block.slug === `pricing`)} />
        <CallToAction content={blocks.find(block => block.slug === 'cta')} />
        <Testimonials content={blocks.find(block => block.slug === `testimonials`)} />
        <div className="transition-all duration-500 rounded-xl">
          <BlockAccordion content={blocks.find(block => block.component === `faq`)} center />
        </div>
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default Index;
