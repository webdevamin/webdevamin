import '../styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from "next/head";
import { Analytics } from '@vercel/analytics/react';
import Script from "next/script"

config.autoAddCss = false

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-SMV41VQ81Z`} />
      <Script
        id='google-analytics'
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SMV41VQ81Z', {
            page_path: window.location.pathname,
          });
          `,
        }}>
      </Script>
      <Component {...pageProps} />
      {process.env.NODE_ENV !== `development` && <Analytics />}
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

export default MyApp