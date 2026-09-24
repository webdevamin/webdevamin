import { getSocialImageMetadata } from '../../../../utils/social-images';
import Header from '../../../../components/Layouts/Header'
import Footer from '../../../../components/Layouts/Footer'
import PageLayout from '../../../../components/Layouts/PageLayout'
import Contact from '../../../../components/Contact'
import BlockAccordion from '../../../../components/Blocks/BlockAccordion'
import BlockNormal from '../../../../components/Blocks/BlockNormal'
import BorderedSection from '../../../../components/Layouts/BorderedSection'
import CallToAction from '../../../../components/Home/CallToAction'
import HeroOne from '../../../../components/Heroes/HeroOne'
import IndustryCards from '../../../../components/IndustryCards'
import JsonLd from '../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { getIndustryCards } from '../../../../utils/industries'

/*
 * Haalt alle data op voor het sectoroverzicht, de pagina die naar elke
 * sectorpagina linkt. Alleen beschikbaar in het Nederlands.
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
  const pageData = (await import(`../../../../messages/${locale}/pages/industries.json`)).default
  const industryCards = await getIndustryCards(locale)

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    pageData,
    industryCards,
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
  }
}

const IndustriesPage = async ({ params }) => {
  const { locale } = await params;
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    contactBlockData,
    pageData,
    industryCards,
  } = await getData(locale)

  const { alternateLangs, blocks } = pageData
  const sectoren = blocks.find(block => block.slug === 'sectoren')

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
      <HeroOne
        content={blocks.find(block => block.slug === 'hero')}
        socials={socialsData}
        breadcrumbItems={[{ label: 'Home', href: '/nl' }, { label: 'Sectoren' }]}
        breadcrumbLocale={locale}
      />
      <PageLayout>
        {/* De sectie eindigt met het raster, en de lijn van de volgende sectie sluit het af. */}
        <BorderedSection flushBottom>
          <IndustryCards content={sectoren} cards={[...industryCards, pageData.otherCard]} />
        </BorderedSection>
        <BorderedSection>
          <BlockNormal content={blocks.find(block => block.slug === 'why-per-sector')} />
        </BorderedSection>
        {/* Heft de negatieve bovenmarge van CallToAction op, want de sectie erboven eindigt nu met vaste padding. */}
        <div className="lg:mt-20">
          <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} borderless />
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

export default IndustriesPage
