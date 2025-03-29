import '../styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from "next/head";
import Script from "next/script"
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import useConsentStore from "../utils/store";
import { NextIntlClientProvider } from 'next-intl';

config.autoAddCss = false
const key = `wda-consent`;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { consent } = useConsentStore();

  return (
    <NextIntlClientProvider locale={router.locale} timeZone='Europe/Brussels' messages={pageProps.messages}>
      {
        (consent === 'enable' || Cookies.get(key) === 'enable') && (
          <>
            {
              process.env.NODE_ENV !== "development" && (
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
                </>
              )
            }
          </>
        )
      }
      <Component {...pageProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </NextIntlClientProvider>
  )
}

export default MyApp
