import Header from '../../../../../components/Layouts/Header'
import Footer from '../../../../../components/Layouts/Footer'
import PageLayout from '../../../../../components/Layouts/PageLayout'
import Contact from '../../../../../components/Contact'
import BlockAccordion from '../../../../../components/Blocks/BlockAccordion'
import CallToAction from '../../../../../components/Home/CallToAction'
import JsonLd from '../../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { routing } from '../../../../i18n/routing'
import BlockLayoutOne from '../../../../../components/Layouts/BlockLayoutOne'
import Heading from '../../../../../components/Heading'
import { PricingCard } from '../../../../../components/Cards/PricingCard'
import Image from 'next/image'
import BlockNormal from '../../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../../components/Heroes/HeroOne'
import BlockCards from '../../../../../components/Blocks/BlockCards'

async function getData(locale, slug) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Map slugs to their corresponding JSON file names per locale
  const slugToFileMap = {
    nl: {
      'taxi-website-laten-maken': 'taxi',
    },
    en: {
      'taxi-website-development': 'taxi',
    },
  };

  const localeMap = slugToFileMap[locale];
  if (!localeMap || !localeMap[slug]) {
    notFound();
  }

  const fileName = localeMap[slug];

  const localesData = (await import(`../../../../../messages/${locale}/locales.json`)).default;
  const socialsData = (await import(`../../../../../messages/${locale}/socials.json`)).default;
  const blogsData = (await import(`../../../../../messages/${locale}/blogs.json`)).default;
  const pagesData = (await import(`../../../../../messages/${locale}/pages.json`)).default;
  const contactBlockData = (await import(`../../../../../messages/${locale}/contactBlock.json`)).default;
  const projectsData = (await import(`../../../../../messages/${locale}/projects.json`)).default;
  const pageData = (await import(`../../../../../messages/${locale}/industries/${fileName}.json`)).default;

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
  const { seo, alternates } = pageData;
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
  const { title, subtitle, description, project, highlights } = content;
  const { image, description: projectDesc } = project;

  return (
    <BlockLayoutOne title={title} slug={`services`} includeMaxWidth={false}>
      <div className="flex flex-col-reverse lg:flex-row lg:gap-[7rem] lg:justify-center lg:items-center text-left">
        <div className="lg:flex-1">
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:gap-[7rem] lg:justify-center lg:items-center text-left">
            <div>
              <Heading title={title} subtitle={subtitle} />
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className="w-full lg:w-auto my-4">
              <div className="relative w-full max-w-[400px] mx-auto">
                <Image
                  src={image}
                  alt={projectDesc}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain max-w-[400px] px-5 lg:px-0"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 80vw, 400px"
                  style={{ maxWidth: '400px', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Highlights Section */}
          {highlights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex shadow-md border 
                border-dark xl:border-opacity-10 border-opacity-20 rounded-lg sm:rounded-xl lg:rounded-2xl p-5 lg:p-6 relative transform transition-all duration-300 hover:scale-105 items-center justify-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <span className="stroke-text pr-4 text-3xl">{highlight.number}</span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 break-words hyphens-auto w-full mb-0">
                    {highlight.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

const PricingSection = ({ content }) => {
  const { title, subtitle, text, highlight, items } = content;

  return (
    <BlockLayoutOne title={title} slug={`pricing`} includeMaxWidth={false} position={`right`}>
      <div className="4xl:pl-5 4xl:pr-12 w-full">
        <div className="max-w-7xl ml-auto lg:text-right">
          <div className='mb-10'>
            <Heading title={title} subtitle={subtitle} />
            <h4 className='-mt-2 text-lg font-bold font_quicksand bg-theme 
                text-white px-4 py-2 mb-7 inline-block uppercase 
                md:text-xl lg:text-2xl xl:text-3xl xl:px-5 xl:py-3'>{highlight}</h4>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
          {(items && items.length > 0) && (
            <div className="mt-12 lg:pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
                {items.map((item, index) => {
                  const { title, price, currency, period, features,
                    excludedFeatures, buttonText, buttonHref, popular } = item;

                  return (
                    <div key={index}>
                      <PricingCard
                        title={title}
                        price={price}
                        currency={currency}
                        period={period}
                        features={features}
                        excludedFeatures={excludedFeatures}
                        buttonText={buttonText}
                        buttonHref={buttonHref}
                        popular={popular}
                      />
                    </div>
                  );
                })}
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
        <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        <div className="transition-all duration-500 rounded-xl">
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </div>
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default IndustryPage;