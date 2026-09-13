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
import CardOne from '../../../../../components/Cards/CardOne'
import Image from 'next/image'
import BlockNormal from '../../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../../components/Heroes/HeroOne'
import BlockCards from '../../../../../components/Blocks/BlockCards'
import RestaurantFeatures from '../../../../../components/Blocks/RestaurantFeatures'
import OneTimePayment from '../../../../../components/Home/OneTimePayment'
import { renderIcon } from '../../../../../utils/iconMapper'

const slugToFileMap = {
  nl: {
    'taxi-website-laten-maken': 'taxi',
    'kapper-website-laten-maken': 'kapper',
    'restaurant-website-laten-maken': 'restaurant',
  },
};

/*
 * Vertelt Next.js welke industry-pagina's statisch gebouwd kunnen worden.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const localeMap = slugToFileMap[locale] || {};

    return Object.keys(localeMap).map((slug) => ({
      locale,
      slug,
    }));
  });
}

async function getData(locale, slug) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

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

/*
 * Rendert de korte processectie zodat bezoekers snel begrijpen wat er gebeurt
 * nadat ze een offerte of pakket aanvragen.
 */
const ProcessSection = ({ content }) => {
  if (!content?.items?.length) return null;

  const { title, subtitle, items } = content;

  return (
    <section id="process" className="mt-24 md:mt-28 xl:mt-36">
      <div className="max-w-7xl mx-auto">
        <Heading title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center shadow-md border 
              border-dark xl:border-opacity-10 border-opacity-20 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 
              relative justify-center transform transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="rounded-full bg-theme bg-opacity-5 p-3 
              sm:p-4 lg:p-5 mb-3 lg:mb-4">
                <div className="text-theme_dark">
                  {renderIcon(item.icon, { className: 'h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9' })}
                </div>
              </div>
              <div className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Stap {index + 1}
              </div>
              <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 break-words">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/*
 * Rendert een YouTube-demo wanneer die beschikbaar is en toont anders een
 * nette live-demo fallback, zodat de contentflow niet leeg aanvoelt.
 */
const VideoDemoSection = ({ content }) => {
  if (!content) return null;

  const { title, subtitle, text, videoUrl, videoTitle, fallbackUrl, fallbackText, fallbackButtonText } = content;

  /*
   * Haalt de YouTube video-id uit gewone YouTube links en korte youtu.be links.
   */
  const getYouTubeId = (url) => {
    if (!url) return null;
    // Handle youtu.be short URLs
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]?.split('#')[0];
      if (id && id.length === 11) return id;
    }
    // Handle standard YouTube URLs
    const regExp = /^.*(v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  if (!videoUrl && !fallbackUrl) return null;

  return (
    <BlockLayoutOne title={title} slug="video-demo" includeMaxWidth={false}>
      <div className="w-full">
        <div className="max-w-6xl mx-auto">
          <Heading title={title} subtitle={subtitle} />
          {text && <div className="mb-8" dangerouslySetInnerHTML={{ __html: text }} />}

          {videoId && (
            <div
              className="relative w-full overflow-hidden rounded-lg border border-gray-200 shadow-2xl"
              style={{ paddingTop: '56.25%' }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={videoTitle || title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {!videoId && videoUrl && (
            <div
              className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-2xl"
              style={{ paddingTop: '56.25%' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 text-theme hover:text-theme_darker transition-colors"
                >
                  <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="font-semibold">Bekijk de video</span>
                </a>
              </div>
            </div>
          )}

          {!videoUrl && fallbackUrl && (
            <div className="rounded-lg border border-dark border-opacity-10 bg-white p-6 text-center shadow-md sm:p-8">
              {fallbackText && (
                <p className="mx-auto mb-6 max-w-2xl text-base leading-7 text-slate-600">
                  {fallbackText}
                </p>
              )}
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded border border-dark bg-theme px-5 py-3 text-sm font-semibold uppercase tracking-wider text-dark shadow-bold_r_sm transition-all hover:shadow-zero sm:w-auto"
              >
                {fallbackButtonText || 'Bekijk voorbeeld'}
              </a>
            </div>
          )}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

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
  const { image, description: projectDesc, wideImageWidth = 560 } = project;

  return (
    <BlockLayoutOne title={title} slug={`services`} includeMaxWidth={false}>
      <div className="flex flex-col-reverse lg:flex-row lg:gap-[7rem] lg:justify-center lg:items-center text-left">
        <div className="lg:flex-1">
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:gap-10 lg:justify-center lg:items-center text-left">
            <div className="lg:max-w-[45%]">
              <Heading title={title} subtitle={subtitle} />
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className="w-full lg:w-auto my-4">
              <div
                className="portfolio-project-mockup relative mx-auto"
                style={{ '--portfolio-mockup-wide-width': `${wideImageWidth}px` }}
              >
                <Image
                  src={image}
                  alt={projectDesc}
                  width={720}
                  height={540}
                  className="w-full h-auto object-contain px-5 lg:px-0"
                  sizes={`(max-width: 480px) 100vw, (max-width: 768px) 80vw, (min-width: 1536px) ${wideImageWidth}px, 560px`}
                />
              </div>
            </div>
          </div>

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

/*
 * Rendert de pricing-sectie volledig vanuit data, inclusief positionering,
 * aanbevolen badge en een extra groeiblok onder de kaarten.
 */
const PricingSection = ({ content }) => {
  const { title, subtitle, text, highlight, items, growthTitle, growthText, growthNote } = content;
  const hasSingleTier = Array.isArray(items) && items.length === 1;

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
              <div className={`grid grid-cols-1 ${hasSingleTier ? '' : 'md:grid-cols-2 xl:grid-cols-4'} gap-6 xl:gap-8`}>
                {items.map((item, index) => {
                  const {
                    title,
                    price,
                    currency,
                    period,
                    tagline,
                    microcopy,
                    badge,
                    limitLabel,
                    description,
                    features,
                    excludedFeatures,
                    buttonText,
                    buttonHref,
                    popular,
                  } = item;

                  return (
                    <div key={index} className={hasSingleTier ? 'w-full' : ''}>
                      <PricingCard
                        title={title}
                        price={price}
                        currency={currency}
                        period={period}
                        tagline={tagline}
                        microcopy={microcopy}
                        badge={badge}
                        limitLabel={limitLabel}
                        description={description}
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
          {(growthTitle || growthText || growthNote) && (
            <div className="mt-10 pt-5 mb-10 rounded-3xl lg:ml-auto lg:max-w-4xl">
              {growthTitle && (
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                  {growthTitle}
                </h3>
              )}
              {growthText && (
                <p className="text-base leading-7 text-slate-600">
                  {growthText}
                </p>
              )}
              {growthNote && (
                <div className="mt-6">
                  <span className="inline-block bg-theme px-4 py-2 
                  text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white">
                    {growthNote}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

const TestimonialSpotlight = ({ content }) => {
  const reviews = content?.reviews || (content?.review ? [content.review] : []);
  if (!reviews.length) return null;

  const { moreReviewsUrl, moreReviewsText } = content;

  return (
    <section className="mt-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.name} className="flex transform transition-all duration-500 hover:-translate-y-1.5">
              <CardOne
                initial={review.name.charAt(0).toUpperCase()}
                title={review.name}
                bgColor={review.backgroundColor || '#FF4654'}
                text={review.text}
                count={review.stars}
              />
            </div>
          ))}
        </div>
        {moreReviewsUrl && (
          <div className="mt-6 md:mt-10">
            <a
              href={moreReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-theme_darker hover:text-dark transition-colors uppercase"
            >
              <span>{moreReviewsText}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
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
      <PageLayout allowSticky={locale === 'nl' && slug === 'restaurant-website-laten-maken'}>
        <ProcessSection content={blocks.find(block => block.slug === 'process')} />
        <BlockNormal content={blocks.find(block => block.slug === 'why-taxi-website' || block.slug === 'why-barber-website' || block.slug === 'why-kapper-website' || block.slug === 'why-restaurant-website')} />
        <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position='right' />
        <VideoDemoSection content={blocks.find(block => block.slug === 'video-demo')} />
        {locale === 'nl' && slug === 'restaurant-website-laten-maken' ? (
          <RestaurantFeatures content={blocks.find(block => block.slug === 'features-benefits')} />
        ) : (
          <FeaturesSection content={blocks.find(block => block.slug === 'features-benefits')} />
        )}
        <PortfolioCase content={blocks.find(block => block.slug === 'portfolio-case')} />
        <TestimonialSpotlight content={blocks.find(block => block.slug === 'review')} />
        <PricingSection content={blocks.find(block => block.slug === 'pricing')} />
        <OneTimePayment content={blocks.find(block => block.slug === 'one-time-payment')} />
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
