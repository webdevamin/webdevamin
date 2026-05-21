import Header from '../../../../components/Layouts/Header'
import Footer from '../../../../components/Layouts/Footer'
import PageLayout from '../../../../components/Layouts/PageLayout'
import Contact from '../../../../components/Contact'
import BlockAccordion from '../../../../components/Blocks/BlockAccordion'
import CallToAction from '../../../../components/Home/CallToAction'
import JsonLd from '../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { routing } from '../../../i18n/routing'
import BlockLayoutOne from '../../../../components/Layouts/BlockLayoutOne'
import Heading from '../../../../components/Heading'
import { PricingCard } from '../../../../components/Cards/PricingCard'
import CardTwo from '../../../../components/Cards/CardTwo'
import BlockNormal from '../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../components/Heroes/HeroOne'
import Testimonials from '../../../../components/Home/Testimonials'
import Location from '../../../../components/Location/Location'
import OneTimePayment from '../../../../components/Home/OneTimePayment'
import { renderIcon } from '../../../../utils/iconMapper'

/*
 * Haalt alle benodigde data op voor de "website laten maken brugge" landingspagina.
 * Alleen beschikbaar in het Nederlands.
 */
async function getData(locale) {
  if (locale !== 'nl') {
    notFound()
  }

  const localesData = (await import(`../../../../messages/${locale}/locales.json`)).default
  const socialsData = (await import(`../../../../messages/${locale}/socials.json`)).default
  const blogsData = (await import(`../../../../messages/${locale}/blogs.json`)).default
  const pagesData = (await import(`../../../../messages/${locale}/pages.json`)).default
  const contactBlockData = (await import(`../../../../messages/${locale}/contactBlock.json`)).default
  const projectsData = (await import(`../../../../messages/${locale}/projects.json`)).default
  const pageData = (await import(`../../../../messages/${locale}/pages/brugge.json`)).default

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    projectsData,
    pageData,
  }
}

export async function generateMetadata({ params: { locale } }) {
  if (locale !== 'nl') {
    return {}
  }

  const { pageData } = await getData(locale)
  const { seo, alternates } = pageData
  const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo

  const defaultImage = image || '/images/ogbanner-nl.png'

  return {
    title: `${title}`,
    description: description,
    keywords: keywords,
    canonical: canonical,
    alternates: {
      canonical: canonical,
      languages: alternates.reduce((acc, alt) => {
        acc[alt.hreflang] = alt.href
        return acc
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
  }
}

/*
 * Rendert het proces in 3 stappen zodat bezoekers direct begrijpen
 * hoe het werkt nadat ze contact opnemen.
 */
const ProcessSection = ({ content }) => {
  if (!content?.items?.length) return null

  const { title, subtitle, items } = content

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
  )
}

/*
 * Rendert een raster van Brugse projecten als bewijsmateriaal.
 * Filtert de volledige projectenlijst op basis van de slugs in de JSON-data
 * en gebruikt het gedeelde CardTwo component voor een consistente weergave.
 */
const BruggeProjectsSection = ({ content, allProjects }) => {
  if (!content?.projectSlugs?.length || !allProjects) return null

  const { title, subtitle, text } = content

  const bruggeProjects = content.projectSlugs
    .map(slug => allProjects.find(p => p.slug === slug))
    .filter(Boolean)

  if (!bruggeProjects.length) return null

  return (
    <section id="projecten" className="mt-24 md:mt-28 xl:mt-36">
      <div className="max-w-7xl mx-auto">
        <Heading title={title} subtitle={subtitle} />
        {text && (
          <div className="mb-10" dangerouslySetInnerHTML={{ __html: text }} />
        )}
        <div className={`pb-8 flex gap-y-14 flex-col md:pb-0 md:pr-0 md:w-full md:grid 
          md:grid-cols-2 xl:grid-cols-3 md:gap-x-14 md:gap-y-12`}>
          {bruggeProjects.map((project, i) => {
            const { title, img, slug, description, border, link, technologies = [], niche = '', buttonText } = project
            const { src, alt } = img

            return (
              <CardTwo
                key={slug}
                imgUrl={src}
                title={title}
                text={buttonText}
                subtitle={description}
                slug={slug}
                alt={alt}
                border={border}
                type={`project`}
                link={link}
                technologies={technologies}
                badgeAlt={niche}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

/*
 * Rendert de pricing-sectie met PricingCard componenten,
 * inclusief positionering, aanbevolen badge en groeiblok.
 */
const PricingSection = ({ content }) => {
  const { title, subtitle, text, highlight, items, growthTitle, growthText, growthNote } = content
  const hasSingleTier = Array.isArray(items) && items.length === 1

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
              <div className={`grid grid-cols-1 ${hasSingleTier ? '' : 'md:grid-cols-2 xl:grid-cols-3'} gap-6 xl:gap-8`}>
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
                  } = item

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
                  )
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
  )
}

const BruggePage = async ({ params: { locale } }) => {
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    projectsData,
    pageData,
  } = await getData(locale)

  const { alternateLangs, blocks } = pageData

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} imageMaxWidth="max-w-[700px]" />
      <PageLayout>
        <ProcessSection content={blocks.find(block => block.slug === 'process')} />
        <BlockNormal content={blocks.find(block => block.slug === 'why-website-brugge')} />
        <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position='right' />
        <BruggeProjectsSection content={blocks.find(block => block.slug === 'projecten')} allProjects={projectsData} />
        <Testimonials content={blocks.find(block => block.slug === 'testimonials')} />
        <Location content={blocks.find(block => block.slug === 'location')} />
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
  )
}

export default BruggePage
