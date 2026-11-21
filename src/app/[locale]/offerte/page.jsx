import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { Link } from '../../../../src/i18n/navigation'
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

// Only the logo and the wizard, without the site menu, footer or other sections, so nothing distracts from the questions.
const OffertePage = async ({ params }) => {
  const { locale } = await params;
  const { pageData } = await getData(locale)

  return (
    <>
      <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-dark/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link href="/" aria-label={pageData.homeLabel} className="flex items-end gap-2">
            <Image src="/images/logo.png" width={38} height={23} priority alt="Webdevamin Logo" />
            <span aria-hidden="true" className="text-xl font-bold leading-none tracking-tight">ebdevamin</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 !text-sm font-semibold text-dark/70 hover:text-dark sm:!text-base">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />{pageData.homeLink}
          </Link>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-8 md:py-14 lg:py-20">
        <h1 className="sr-only">{pageData.heading}</h1>
        <QuoteWizard texts={pageData.wizard} />
      </main>
      </div>
      <CookieConsent />
    </>
  )
}

export default OffertePage
