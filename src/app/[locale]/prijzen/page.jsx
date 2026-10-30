import { getSocialImageMetadata } from '../../../../utils/social-images';
import Header from '../../../../components/Layouts/Header'
import Footer from '../../../../components/Layouts/Footer'
import PageLayout from '../../../../components/Layouts/PageLayout'
import Contact from '../../../../components/Contact'
import BlockAccordion from '../../../../components/Blocks/BlockAccordion'
import CallToAction from '../../../../components/Home/CallToAction'
import JsonLd from '../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import BlockNormal from '../../../../components/Blocks/BlockNormal'
import HeroOne from '../../../../components/Heroes/HeroOne'
import OneTimePayment from '../../../../components/Home/OneTimePayment'
import BorderedSection from '../../../../components/Layouts/BorderedSection'
import PricingGrid from '../../../../components/Blocks/PricingGrid'

/*
 * Haalt alle benodigde data op voor de prijzenpagina.
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
  const pageData = (await import(`../../../../messages/${locale}/pages/prijzen.json`)).default

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
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

const PrijzenPage = async ({ params }) => {
  const { locale } = await params;
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
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
        breadcrumbItems={[{ label: 'Home', href: '/nl' }, { label: 'Prijzen' }]}
        breadcrumbLocale={locale}
      />
      <PageLayout>
        <PricingGrid content={blocks.find(block => block.slug === 'pricing')} />
        <BorderedSection>
          <OneTimePayment content={blocks.find(block => block.slug === 'one-time-payment')} />
        </BorderedSection>
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'sectoren')} position='right' />
        </BorderedSection>
        {/* Heft de negatieve bovenmarge van CallToAction op, want de sectie erboven eindigt met vaste padding. */}
        <div className="lg:mt-20">
          <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        </div>
        <BorderedSection>
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </BorderedSection>
        <Contact content={contactBlockData} />
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  )
}

export default PrijzenPage
