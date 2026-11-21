import { getSocialImageMetadata } from '../../../../utils/social-images';
import Header from '../../../../components/Layouts/Header'
import Footer from '../../../../components/Layouts/Footer'
import PageLayout from '../../../../components/Layouts/PageLayout'
import BorderedSection from '../../../../components/Layouts/BorderedSection'
import BlockAccordion from '../../../../components/Blocks/BlockAccordion'
import Breadcrumbs from '../../../../components/SEO/Breadcrumbs'
import JsonLd from '../../../../components/SEO/JsonLd'
import QuoteWizard from '../../../../components/QuoteWizard'
import { notFound } from 'next/navigation'

/*
 * Haalt alle benodigde data op voor de offertepagina.
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
  const pageData = (await import(`../../../../messages/${locale}/pages/offerte.json`)).default

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
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

const OffertePage = async ({ params }) => {
  const { locale } = await params;
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    pageData,
  } = await getData(locale)

  const { alternateLangs } = pageData

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      {/* A short intro instead of a hero with an image, so the first question is visible right away. */}
      <div className="container mt-20 pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="page_container">
          <Breadcrumbs items={[{ label: 'Home', href: '/nl' }, { label: pageData.title }]} locale={locale} className="mb-6" />
          <h1 className="!mb-4 !text-4xl sm:!text-5xl lg:!text-6xl">{pageData.heading}</h1>
          <p className="max-w-2xl !mb-0 !opacity-90 sm:text-lg">{pageData.intro}</p>
        </div>
      </div>
      {/* allowSticky keeps the summary next to the questions in view while scrolling. */}
      <PageLayout allowSticky>
        <div className="pb-16 pt-8 md:pb-20 md:pt-12">
          <QuoteWizard texts={pageData.wizard} />
        </div>
        <BorderedSection>
          <BlockAccordion content={pageData.faq} center />
        </BorderedSection>
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} />
      </PageLayout>
    </>
  )
}

export default OffertePage
