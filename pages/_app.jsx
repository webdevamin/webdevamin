import '../styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from "next/head";
import Script from "next/script"
import * as fbq from "../utils/fbpixel";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import useConsentStore from "../utils/store";
import { appWithTranslation } from 'next-i18next';

config.autoAddCss = false
const key = `wda-consent`;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { consent } = useConsentStore();

  useEffect(() => {
    if (consent === 'enable' || Cookies.get(key) === 'enable') {
      fbq.pageview();

      const handleRouteChange = () => fbq.pageview();
      router.events.on(`routeChangeComplete`, handleRouteChange);

      return () => {
        router.events.off(`routeChangeComplete`, handleRouteChange);
      }
    }
  }, [router.events, consent]);

  return (
    <>
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
            <Script
              id='fb-pixel'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', ${fbq.FB_PIXEL_ID});`,
              }}></Script>
          </>
        )
      }
      <Component {...pageProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}

export default appWithTranslation(MyApp)