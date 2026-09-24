import { getSocialImageMetadata } from '../../../utils/social-images';
import BlockNormal from '../../../components/Blocks/BlockNormal'
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
import Location from '../../../components/Location/Location'
import OneTimePayment from '../../../components/Home/OneTimePayment'
import { notFound } from 'next/navigation'
import { routing } from '../../i18n/routing'
import JsonLd from '../../../components/SEO/JsonLd'
import BorderedSection from '../../../components/Layouts/BorderedSection'

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

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const { pageData } = await getData(locale);
  const { seo, alternates, jsonLd } = pageData;
  const { title, description, canonical, ogTitle, ogDescription, keywords } = seo;
  const socialImage = await getSocialImageMetadata(canonical);

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
      images: [socialImage],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ogTitle || title} | Webdevamin`,
      description: ogDescription || description,
      creator: '@Webdevamin',
      images: [socialImage.url],
    },
    other: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-UA-Compatible': 'IE=edge',
    },
    jsonLd: jsonLd,
  };
}

const Index = async ({ params }) => {
  const { locale } = await params;
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

  const { alternateLangs, blocks } = pageData;
  const whyAllInOne = blocks.find(block => block.slug === `why-all-in-one`);
  const location = locale === 'nl' ? blocks.find(block => block.slug === 'location') : null;
  const bruggeMeetup = locale === 'nl' ? blocks.find(block => block.slug === 'brugge-meetup') : null;
  const oneTimePayment = blocks.find(block => block.slug === `pricing`)?.oneTimePayment;

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} heroBannerData={heroBannerData} />
      <Hero content={blocks.find(block => block.slug === `hero`)} socials={socialsData} locale={locale} />
      <PageLayout>
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === `about`)} />
        </BorderedSection>
        {whyAllInOne && (
          <BorderedSection>
            <BlockNormal content={whyAllInOne} position='right' />
          </BorderedSection>
        )}
        <BorderedSection flushBottom>
          <Services content={blocks.find(block => block.slug === `services`)} />
        </BorderedSection>
        <BorderedSection>
          <Projects content={blocks.find(block => block.slug === `projects`)} data={projectsData} />
        </BorderedSection>
        <BorderedSection>
          <Blogs content={blocks.find(block => block.slug === `blogs`)} data={blogsData} />
        </BorderedSection>
        {location && (
          <BorderedSection>
            <Location content={location} />
          </BorderedSection>
        )}
        {/* De wrappers met lg:mt-20 heffen de negatieve bovenmarge van CallToAction op, want de sectie erboven eindigt met vaste padding. */}
        {bruggeMeetup && (
          <div className="lg:mt-20">
            <CallToAction content={bruggeMeetup} />
          </div>
        )}
        <BorderedSection line={!bruggeMeetup}>
          <PricingSection content={blocks.find(block => block.slug === `pricing`)} />
        </BorderedSection>
        {oneTimePayment && (
          <BorderedSection>
            <OneTimePayment content={oneTimePayment} />
          </BorderedSection>
        )}
        <div className="lg:mt-20">
          <CallToAction content={blocks.find(block => block.slug === 'cta')} />
        </div>
        <BorderedSection line={false} flushBottom>
          <Testimonials content={blocks.find(block => block.slug === `testimonials`)} />
        </BorderedSection>
        <BorderedSection>
          <BlockAccordion content={blocks.find(block => block.component === `faq`)} center />
        </BorderedSection>
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default Index;
