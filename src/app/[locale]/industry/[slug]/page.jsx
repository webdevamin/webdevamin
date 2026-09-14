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
import BorderedSection, { FullBleedLine } from '../../../../../components/Layouts/BorderedSection'
import ProcessSteps from '../../../../../components/Blocks/ProcessSteps'
import PricingGrid from '../../../../../components/Blocks/PricingGrid'
import Image from 'next/image'
import { Fragment } from 'react'
import BlockNormal from '../../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../../components/Heroes/HeroOne'
import RestaurantFeatures from '../../../../../components/Blocks/RestaurantFeatures'
import OneTimePayment from '../../../../../components/Home/OneTimePayment'
import IndustryCards from '../../../../../components/IndustryCards'
import { renderIcon } from '../../../../../utils/iconMapper'
import { slugToFileMap, getIndustryCards } from '../../../../../utils/industries'

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
  const sectorsPageData = (await import(`../../../../../messages/${locale}/pages/industries.json`)).default;
  const otherIndustryCards = await getIndustryCards(locale, slug);

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    projectsData,
    pageData,
    sectorsPageData,
    otherIndustryCards,
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
    <BorderedSection>
      <BlockLayoutOne title={title} slug="video-demo" includeMaxWidth={false}>
        <div className="w-full">
          {/* Extra ruimte onderaan zodat de schaduw van de video niet tegen de lijn eronder komt. */}
          <div className="max-w-6xl mx-auto pb-6 md:pb-8 xl:pb-12">
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
    </BorderedSection>
  );
};

/*
 * Functies als vakken gescheiden door lijnen: 1 kolom op gsm, 2 op tablet, 3 op
 * desktop. De rijlijn staat telkens voor het eerste vak van een nieuwe rij.
 */
const FeaturesSection = ({ content }) => {
  const { title, subtitle, text, features = [] } = content;

  return (
    <BorderedSection flushBottom>
      <section id="services">
        <div className="max-w-7xl mx-auto">
          <Heading title={title} subtitle={subtitle} />
          {text && <div className="max-w-5xl" dangerouslySetInnerHTML={{ __html: text }} />}
          <div className="relative mt-8 md:mt-10 xl:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <FullBleedLine className="absolute top-0" />
            {features.map((feature, index) => (
              <Fragment key={feature.title}>
                {index > 0 && (
                  <FullBleedLine className={`relative col-span-full ${index % 2 === 0 ? 'md:block' : 'md:hidden'} ${index % 3 === 0 ? 'lg:block' : 'lg:hidden'}`} />
                )}
                <div className={`flex flex-col items-center text-center px-6 py-10 lg:px-8 border-dark ${index % 2 === 1 ? 'md:border-l-[0.5px]' : ''} ${index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l-[0.5px]'}`}>
                  <div className="rounded-full bg-theme bg-opacity-5 p-3 sm:p-4 lg:p-5 mb-3 lg:mb-4">
                    <div className="text-theme_dark">
                      {renderIcon(feature.icon, { className: 'h-5 w-5 sm:h-7 sm:w-7' })}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold normal-case mb-2 sm:mb-3 text-gray-800 break-words hyphens-auto w-full">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 break-words">
                    {feature.description}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </BorderedSection>
  );
};

// Portfolio Case Component
const PortfolioCase = ({ content }) => {
  const { title, subtitle, description, project, highlights } = content;
  const { image, description: projectDesc, wideImageWidth = 560 } = project;

  return (
    <BorderedSection flushBottom>
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
              <div className="relative grid grid-cols-1 md:grid-cols-3">
                <FullBleedLine className="absolute top-0" />
                {highlights.map((highlight, index) => (
                  <Fragment key={index}>
                    {index > 0 && <FullBleedLine className="relative col-span-full md:hidden" />}
                    <div className={`flex items-center justify-center px-6 py-8 border-dark ${index > 0 ? 'md:border-l-[0.5px]' : ''}`}>
                      <span className="stroke-text pr-4 text-3xl">{highlight.number}</span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-800 break-words hyphens-auto w-full mb-0">
                        {highlight.title}
                      </h3>
                    </div>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </BlockLayoutOne>
    </BorderedSection>
  );
};

const TestimonialSpotlight = ({ content }) => {
  const reviews = content?.reviews || (content?.review ? [content.review] : []);
  if (!reviews.length) return null;

  const { moreReviewsUrl, moreReviewsText } = content;
  const average = reviews.reduce((sum, review) => sum + (review.stars || 5), 0) / reviews.length;
  // Eén review krijgt twee van de drie kolommen naast de score; twee reviews krijgen elk één kolom.
  const reviewSpan = reviews.length === 1 ? 'lg:col-span-2' : '';

  const Stars = ({ count }) => (
    <div className="flex gap-0.5 text-yellow-400" role="img" aria-label={`${count} sterren`}>
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <BorderedSection flushTop flushBottom>
      <section aria-label="Reviews van klanten" className="grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col justify-center py-10 lg:py-14 lg:pr-10">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Google reviews</div>
          <div className="mt-3 flex items-end gap-3">
            <div className="stroke-text leading-none">{average.toFixed(1).replace('.', ',')}</div>
            <div className="mb-1 text-sm font-semibold text-slate-500">/ 5</div>
          </div>
          <div className="mt-3">
            <Stars count={Math.round(average)} />
          </div>
          {moreReviewsUrl && (
            <a
              href={moreReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-theme_darker hover:text-dark transition-colors uppercase"
            >
              <span>{moreReviewsText}</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        {reviews.map((review, index) => (
          <Fragment key={review.name}>
            <FullBleedLine className="relative col-span-full lg:hidden" />
            <figure className={`flex flex-col justify-between gap-8 py-10 lg:py-14 lg:px-10 border-dark lg:border-l-[0.5px] ${reviewSpan} ${index === reviews.length - 1 ? 'lg:pr-0' : ''}`}>
              <blockquote>
                <svg className="mb-4 h-8 w-8 text-theme" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <p className="mb-0 text-lg md:text-xl leading-8 text-dark opacity-100">{review.text}</p>
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-dark shadow-bold_r_xs"
                  style={{ backgroundColor: review.backgroundColor || '#FF4654' }}
                  aria-hidden="true"
                >
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{review.name}</div>
                  <Stars count={review.stars || 5} />
                </div>
              </figcaption>
            </figure>
          </Fragment>
        ))}
      </section>
    </BorderedSection>
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
    sectorsPageData,
    otherIndustryCards,
  } = await getData(locale, slug);

  const { alternateLangs, blocks } = pageData;
  const oneTimePayment = blocks.find(block => block.slug === 'one-time-payment');

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
      <PageLayout allowSticky={locale === 'nl' && slug === 'restaurant-website-laten-maken'}>
        <ProcessSteps content={blocks.find(block => block.slug === 'process')} />
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'why-taxi-website' || block.slug === 'why-barber-website' || block.slug === 'why-kapper-website' || block.slug === 'why-restaurant-website')} />
        </BorderedSection>
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position='right' />
        </BorderedSection>
        <VideoDemoSection content={blocks.find(block => block.slug === 'video-demo')} />
        <BorderedSection>
          {locale === 'nl' && slug === 'restaurant-website-laten-maken' ? (
            <RestaurantFeatures content={blocks.find(block => block.slug === 'features-benefits')} />
          ) : (
            <FeaturesSection content={blocks.find(block => block.slug === 'features-benefits')} />
          )}
        </BorderedSection>
        <PortfolioCase content={blocks.find(block => block.slug === 'portfolio-case')} />
        <TestimonialSpotlight content={blocks.find(block => block.slug === 'review')} />
        <PricingGrid content={blocks.find(block => block.slug === 'pricing')} />
        {oneTimePayment && (
          <BorderedSection>
            <OneTimePayment content={oneTimePayment} />
          </BorderedSection>
        )}
        {/* Heft de negatieve bovenmarge van CallToAction op, want de sectie erboven eindigt nu met vaste padding. */}
        <div className="lg:mt-20">
          <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        </div>
        <BorderedSection line={false}>
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </BorderedSection>
        {otherIndustryCards.length > 0 && (
          <BorderedSection>
            <IndustryCards
              content={sectorsPageData.blocks.find(block => block.slug === 'andere-sectoren')}
              cards={otherIndustryCards}
            />
          </BorderedSection>
        )}
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default IndustryPage;
