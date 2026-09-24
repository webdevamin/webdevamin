import { TAXI_CATALOG } from '../../../../../utils/taxi-pricing.mjs';
import { applyTaxiPricing } from '../../../../../utils/taxi-page.mjs';

export const revalidate = 300;
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
import BorderedSection from '../../../../../components/Layouts/BorderedSection'
import LineGrid from '../../../../../components/Layouts/LineGrid'
import ProcessSteps from '../../../../../components/Blocks/ProcessSteps'
import PricingGrid from '../../../../../components/Blocks/PricingGrid'
import Image from 'next/image'
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
  let pageData = (await import(`../../../../../messages/${locale}/industries/${fileName}.json`)).default;
  if (fileName === 'taxi') pageData = applyTaxiPricing(pageData, TAXI_CATALOG);
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

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
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
          alt: seo.imageAlt,
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
                    rel="noopener noreferrer nofollow"
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
                  rel="noopener noreferrer nofollow"
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
 * Functies als vakken gescheiden door lijnen: 1 kolom op gsm, 2 op tablet, 3 op desktop.
 * Tekent zelf zijn BorderedSection, dus niet nog eens inpakken op de pagina.
 */
const FeaturesSection = ({ content }) => {
  const { title, subtitle, text, features = [] } = content;

  return (
    <BorderedSection flushBottom>
      <section id="services">
        <div className="max-w-7xl mx-auto">
          <Heading title={title} subtitle={subtitle} />
          {text && <div className="max-w-5xl" dangerouslySetInnerHTML={{ __html: text }} />}
        </div>
        <LineGrid
          className="mt-8 md:mt-10 xl:mt-12"
          items={features}
          columns={{ md: 2, lg: 3 }}
          getKey={(feature) => feature.title}
          cellClassName="flex flex-col items-center text-center py-10"
          renderItem={(feature) => (
            <>
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
            </>
          )}
        />
      </section>
    </BorderedSection>
  );
};

// Portfolio Case Component
const PortfolioCase = ({ content }) => {
  const { title, subtitle, description, project, highlights, sectionId = 'services' } = content;
  const { image, description: projectDesc, wideImageWidth = 560 } = project;

  return (
    <BorderedSection flushBottom>
      <BlockLayoutOne title={title} slug={sectionId} includeMaxWidth={false}>
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
          </div>
        </div>
      </BlockLayoutOne>
      {/* Buiten BlockLayoutOne, zodat het raster van zijlijn tot zijlijn kan lopen. */}
      {highlights && (
        <LineGrid
          items={highlights}
          columns={{ md: 3 }}
          cellClassName="flex items-center justify-center py-8"
          renderItem={(highlight) => (
            <>
              <span className="stroke-text pr-4 text-3xl">{highlight.number}</span>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 break-words hyphens-auto w-full mb-0">
                {highlight.title}
              </h3>
            </>
          )}
        />
      )}
    </BorderedSection>
  );
};

const Stars = ({ count }) => (
  <div className="flex gap-0.5 text-yellow-400" role="img" aria-label={`${count} sterren`}>
    {[...Array(count)].map((_, i) => (
      <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/*
 * Reviews met titel, gevolgd door een raster: eerst de gemiddelde score, daarna
 * elke review in een eigen vak.
 */
const TestimonialSpotlight = ({ content }) => {
  const reviews = content?.reviews || (content?.review ? [content.review] : []);
  if (!reviews.length) return null;

  const { title, subtitle, moreReviewsUrl, moreReviewsText, scoreLabel } = content;
  const average = reviews.reduce((sum, review) => sum + (review.stars || 5), 0) / reviews.length;
  // null is het scorevak.
  const cells = [null, ...reviews];

  return (
    // Zonder titel valt de bovenlijn van het raster samen met die van de sectie.
    <BorderedSection flushTop={!title} flushBottom>
      <section>
        {title && (
          <div className="max-w-7xl mx-auto">
            <Heading title={title} subtitle={subtitle} />
          </div>
        )}
        <LineGrid
          className={title ? 'mt-6 md:mt-8 xl:mt-10' : ''}
          items={cells}
          columns={{ md: 2 }}
          topLine={Boolean(title)}
          getKey={(review) => review?.name || 'score'}
          cellClassName={(_, index) => `py-10 lg:py-14 ${
            cells.length % 2 === 1 && index === cells.length - 1
              ? 'md:col-span-full md:pr-0 xl:pr-12'
              : ''
          }`}
          renderItem={(review) => review ? (
            <figure className="flex h-full w-full flex-col justify-between gap-8 text-left">
              <blockquote className="w-full">
                <svg className="mb-4 h-8 w-8 text-theme" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
                <p className="mb-0">{review.text}</p>
              </blockquote>
              <figcaption className="flex items-center gap-4 text-left">
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
          ) : (
            <div className="flex h-full flex-col justify-center">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{scoreLabel || 'Google reviews'}</div>
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
                  rel="noopener noreferrer nofollow"
                  className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-theme_darker hover:text-dark transition-colors uppercase"
                >
                  <span>{moreReviewsText}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        />
      </section>
    </BorderedSection>
  );
};

const IndustryPage = async ({ params }) => {
  const { locale, slug } = await params;
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
  const isRestaurant = locale === 'nl' && slug === 'restaurant-website-laten-maken';
  const isTaxi = locale === 'nl' && slug === 'taxi-website-laten-maken';
  const benefitsFirst = isRestaurant || isTaxi;
  const benefits = (
    <BorderedSection>
      <BlockNormal content={blocks.find(block => block.slug === 'why-taxi-website' || block.slug === 'why-barber-website' || block.slug === 'why-kapper-website' || block.slug === 'why-restaurant-website' || block.slug === 'why-isolatiebedrijf-website')} />
    </BorderedSection>
  );
  const service = (
    <BorderedSection>
      <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position="right" />
    </BorderedSection>
  );
  const portfolio = (
    <>
      <PortfolioCase content={blocks.find(block => block.slug === 'portfolio-case')} />
      <TestimonialSpotlight content={blocks.find(block => block.slug === 'review')} />
    </>
  );
  const pricing = (
    <>
      <PricingGrid content={blocks.find(block => block.slug === 'pricing')} />
      {oneTimePayment && (
        <BorderedSection>
          <OneTimePayment content={oneTimePayment} />
        </BorderedSection>
      )}
    </>
  );
  const faq = (
    <BorderedSection line={false}>
      <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
    </BorderedSection>
  );
  const closing = (
    // Compenseert de negatieve bovenmarge van CallToAction.
    <div className="lg:mt-20">
      <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} borderless />
    </div>
  );

  const page = (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      <HeroOne
        content={blocks.find(block => block.slug === `hero`)}
        socials={socialsData}
        breadcrumbItems={[
          { label: 'Home', href: '/nl' },
          { label: 'Sectoren', href: '/nl/industry' },
          { label: pageData.card.title },
        ]}
        breadcrumbLocale={locale}
      />
      <PageLayout allowSticky={isRestaurant}>
        {benefitsFirst ? (
          <>
            {benefits}
            {portfolio}
          </>
        ) : (
          <>
            <ProcessSteps content={blocks.find(block => block.slug === 'process')} />
            {benefits}
            {service}
          </>
        )}
        {/* De taxipagina toont het demoblok nog niet: er is nog geen video van het boekingssysteem. */}
        {slug !== 'taxi-website-laten-maken' && (
          <VideoDemoSection content={blocks.find(block => block.slug === 'video-demo')} />
        )}
        {isRestaurant ? (
          <BorderedSection>
            <RestaurantFeatures content={blocks.find(block => block.slug === 'features-benefits')} />
          </BorderedSection>
        ) : (
          <FeaturesSection content={blocks.find(block => block.slug === 'features-benefits')} />
        )}
        {benefitsFirst ? (
          <>
            {service}
            {pricing}
            <ProcessSteps content={blocks.find(block => block.slug === 'process')} />
            {faq}
            {closing}
          </>
        ) : (
          <>
            {portfolio}
            {pricing}
            {closing}
            {faq}
          </>
        )}
        {otherIndustryCards.length > 0 && (
          // Het rode contactblok begint direct onder de afsluitende lijn van het raster, zodat die lijn niet boven een lege strook zweeft.
          <BorderedSection line={!benefitsFirst} flushBottom>
            <IndustryCards
              content={sectorsPageData.blocks.find(block => block.slug === 'andere-sectoren')}
              cards={[...otherIndustryCards, sectorsPageData.otherCard]}
              bottomLine
            />
          </BorderedSection>
        )}
        {/* Extra lege ruimte boven de schuine rand van het contactblok, alleen vanaf md waar die schuine rand er is. */}
        <div className="md:mt-12 xl:mt-20">
          <Contact content={contactBlockData} />
        </div>
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} />
      </PageLayout>
    </>
  );
  return page;
};

export default IndustryPage;
