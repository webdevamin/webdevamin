import { getSocialImageMetadata } from '../../../../utils/social-images';
import Header from '../../../../components/Layouts/Header'
import Footer from '../../../../components/Layouts/Footer'
import PageLayout from '../../../../components/Layouts/PageLayout'
import Contact from '../../../../components/Contact'
import BlockAccordion from '../../../../components/Blocks/BlockAccordion'
import CallToAction from '../../../../components/Home/CallToAction'
import JsonLd from '../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { routing } from '../../../i18n/routing'
import Heading from '../../../../components/Heading'
import CardTwo from '../../../../components/Cards/CardTwo'
import BlockNormal from '../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../components/Heroes/HeroOne'
import Testimonials from '../../../../components/Home/Testimonials'
import Location from '../../../../components/Location/Location'
import OneTimePayment from '../../../../components/Home/OneTimePayment'
import BorderedSection from '../../../../components/Layouts/BorderedSection'
import ProcessSteps from '../../../../components/Blocks/ProcessSteps'
import PricingGrid from '../../../../components/Blocks/PricingGrid'

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

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (locale !== 'nl') {
    return {}
  }

  const { pageData } = await getData(locale)
  const { seo, alternates } = pageData
  const { title, description, canonical, ogTitle, ogDescription, keywords } = seo
  const socialImage = await getSocialImageMetadata(canonical);

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
      images: [socialImage],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ogTitle || title}`,
      description: ogDescription || description,
      creator: '@Webdevamin',
      images: [socialImage.url],
    },
    other: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-UA-Compatible': 'IE=edge',
    },
  }
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
    <BorderedSection>
      <section id="projecten">
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
                  technologies={[]}
                  badgeAlt={niche}
                />
              )
            })}
          </div>
        </div>
      </section>
    </BorderedSection>
  )
}

const BruggePage = async ({ params }) => {
  const { locale } = await params;
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
      <HeroOne
        content={blocks.find(block => block.slug === `hero`)}
        socials={socialsData}
        imageMaxWidth="max-w-[700px]"
        breadcrumbItems={[{ label: 'Home', href: '/nl' }, { label: 'Website laten maken Brugge' }]}
        breadcrumbLocale={locale}
      />
      <PageLayout>
        <ProcessSteps content={blocks.find(block => block.slug === 'process')} />
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'why-website-brugge')} />
        </BorderedSection>
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'why-all-in-one')} position='right' />
        </BorderedSection>
        <BruggeProjectsSection content={blocks.find(block => block.slug === 'projecten')} allProjects={projectsData} />
        <BorderedSection flushBottom>
          <Testimonials content={blocks.find(block => block.slug === 'testimonials')} />
        </BorderedSection>
        <BorderedSection>
          <Location content={blocks.find(block => block.slug === 'location')} />
        </BorderedSection>
        <PricingGrid content={blocks.find(block => block.slug === 'pricing')} />
        <BorderedSection>
          <OneTimePayment content={blocks.find(block => block.slug === 'one-time-payment')} />
        </BorderedSection>
        {/* Heft de negatieve bovenmarge van CallToAction op, want de sectie erboven eindigt nu met vaste padding. */}
        <div className="lg:mt-20">
          <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        </div>
        <BorderedSection line={false}>
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </BorderedSection>
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  )
}

export default BruggePage
