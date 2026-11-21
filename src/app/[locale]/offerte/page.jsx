import { getSocialImageMetadata } from '../../../../utils/social-images';
import CookieConsent from '../../../../components/CookieConsent'
import QuoteWizard from '../../../../components/QuoteWizard'
import { notFound } from 'next/navigation'

/*
 * Haalt de inhoud van de offertepagina op.
 * Alleen beschikbaar in het Nederlands.
 */
async function getData(locale) {
  if (locale !== 'nl') {
    notFound()
  }

  const pageData = (await import(`../../../../messages/${locale}/pages/offerte.json`)).default

  return { pageData }
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

// Only the wizard, without header, footer or other sections, so nothing distracts from the questions.
const OffertePage = async ({ params }) => {
  const { locale } = await params;
  const { pageData } = await getData(locale)

  return (
    <>
      <main className="flex min-h-[100dvh] items-start justify-center px-4 py-6 sm:items-center sm:px-6 sm:py-10">
        <h1 className="sr-only">{pageData.heading}</h1>
        <QuoteWizard texts={pageData.wizard} />
      </main>
      <CookieConsent />
    </>
  )
}

export default OffertePage
