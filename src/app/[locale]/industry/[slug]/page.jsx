import Header from '../../../../../components/Layouts/Header'
import Footer from '../../../../../components/Layouts/Footer'
import PageLayout from '../../../../../components/Layouts/PageLayout'
import Contact from '../../../../../components/Contact'
import BlockAccordion from '../../../../../components/Blocks/BlockAccordion'
import Testimonials from '../../../../../components/Home/Testimonials'
import CallToAction from '../../../../../components/Home/CallToAction'
import JsonLd from '../../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { routing } from '../../../../i18n/routing'
import BlockLayoutOne from '../../../../../components/Layouts/BlockLayoutOne'
import BlockLayoutTwo from '../../../../../components/Layouts/BlockLayoutTwo'
import Heading from '../../../../../components/Heading'
import ButtonOne from '../../../../../components/Buttons/ButtonOne'
import { PricingCard } from '../../../../../components/Cards/PricingCard'
import Image from 'next/image'
import BlockNormal from '../../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../../components/Heroes/HeroOne'
import BlockCards from '../../../../../components/Blocks/BlockCards'

async function getData(locale, slug) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Only handle taxi-website-laten-maken for now
  if (slug !== 'taxi-website-laten-maken') {
    notFound();
  }

  const localesData = (await import(`../../../../../messages/${locale}/locales.json`)).default;
  const socialsData = (await import(`../../../../../messages/${locale}/socials.json`)).default;
  const blogsData = (await import(`../../../../../messages/${locale}/blogs.json`)).default;
  const pagesData = (await import(`../../../../../messages/${locale}/pages.json`)).default;
  const contactBlockData = (await import(`../../../../../messages/${locale}/contactBlock.json`)).default;
  const projectsData = (await import(`../../../../../messages/${locale}/projects.json`)).default;
  const pageData = (await import(`../../../../../messages/${locale}/industries/taxi.json`)).default;

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

export async function generateMetadata({ params: { locale, slug } }) {
  const { pageData } = await getData(locale, slug);
  const { seo, alternates, jsonLd } = pageData;
  const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

  const defaultImage = image || (locale === `nl` ?
    `/images/ogbanner-nl.png` :
    `/images/ogbanner.png`);

  return {
    title: `${title}`,
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
      title: `${ogTitle || title}`,
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
      title: `${ogTitle || title}`,
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

// Features Section Component
const FeaturesSection = ({ content }) => {
  // Transform features to services format expected by BlockCards
  const transformedContent = {
    ...content,
    services: content.features
  };

  return <BlockCards content={transformedContent} />;
};

// Portfolio Case Component
const PortfolioCase = ({ content }) => {
  const { title, subtitle, description, project } = content;
  const { name, url, image, description: projectDesc, features, results } = project;

  return (
    <BlockLayoutTwo title={title} slug="portfolio-case">
      <div className="md:basis-6/12">
        <Heading title={title} subtitle={subtitle} />
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: description }} />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-theme mb-4">{name}</h3>
          <p className="text-gray-700 mb-4">{projectDesc}</p>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Functionaliteiten:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-theme mr-2">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Resultaten:</h4>
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-theme mr-2">→</span>
                  <span className="text-gray-700">{result}</span>
                </li>
              ))}
            </ul>
          </div>

          <ButtonOne href={url} text="Bekijk Website" target="_blank" />
        </div>
      </div>

      <div className="mt-10 md:mt-0 md:basis-6/12">
        <div className="relative">
          <Image
            src={image}
            alt={`${name} taxi website`}
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </BlockLayoutTwo>
  );
};

const PricingSection = ({ content }) => {
  const { title, subtitle, text, highlight, items } = content;

  return (
    <BlockLayoutOne title={title} slug={`pricing`} includeMaxWidth={false} position={`right`}>
      <div className="4xl:pl-5 4xl:pr-12 w-full">
        <div className="max-w-6xl ml-auto lg:text-right">
          <div>
            <Heading title={title} subtitle={subtitle} />
            <h4 className='-mt-2 text-lg font-bold font_quicksand bg-theme 
                text-white px-4 py-2 mb-7 inline-block uppercase 
                md:text-xl lg:text-2xl xl:text-3xl xl:px-5 xl:py-3'>{highlight}</h4>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
          {(items && items.length > 0) && (
            <div className="mt-12">
              <div className="flex flex-col gap-8 md:flex-row md:justify-end">
                {items.map((item, index) => (
                  <div key={index} className="flex-1 min-w-[280px] max-w-sm">
                    <PricingCard
                      title={item.title}
                      price={item.price}
                      currency={item.currency}
                      period={item.period}
                      features={item.features}
                      excludedFeatures={item.excludedFeatures}
                      buttonText={item.buttonText}
                      buttonHref={item.buttonHref}
                      popular={item.popular}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

const IndustryPage = async ({ params: { locale, slug } }) => {
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    pageData,
  } = await getData(locale, slug);

  const { alternateLangs, blocks } = pageData;

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
      <PageLayout>
        <BlockNormal content={blocks.find(block => block.slug === 'why-taxi-website')} />
        <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position='right' />
        <FeaturesSection content={blocks.find(block => block.slug === 'features-benefits')} />
        <PortfolioCase content={blocks.find(block => block.slug === 'portfolio-case')} />
        <PricingSection content={blocks.find(block => block.slug === 'pricing')} />

        <div className="transition-all duration-500 rounded-xl">
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </div>

        <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        <Testimonials content={blocks.find(block => block.slug === 'testimonials')} />
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default IndustryPage;