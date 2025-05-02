import '../styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from "next/head";
import { useRouter, Router } from 'next/router';
import Cookies from 'js-cookie';
import useConsentStore from "../utils/store";
import { NextIntlClientProvider } from 'next-intl';
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, useState } from 'react';

config.autoAddCss = false
const key = `wda-consent`;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { consent } = useConsentStore();
  const [posthogInstance, setPosthogInstance] = useState(null);

  // Effect for handling PostHog initialization based on consent
  useEffect(() => {
    // Prevent PostHog initialization in development environment
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const currentConsent = Cookies.get(key) || consent;

    if (currentConsent === 'enable') {
      if (!posthogInstance) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: "/ingest",
          ui_host: 'https://eu.posthog.com',
          person_profiles: 'identified_only', // Ensure you comply with privacy regulations
          loaded: (ph) => {
            ph.capture('$pageview');
            setPosthogInstance(ph);
          }
        });
      }

      const handleRouteChange = () => {
        if (posthogInstance) {
          posthogInstance.capture('$pageview');
        }
      };

      Router.events.on('routeChangeComplete', handleRouteChange);

      // Cleanup function
      return () => {
        Router.events.off('routeChangeComplete', handleRouteChange);
      };
    } else {
      // Handle consent withdrawal or initial non-consent
      if (posthogInstance) {
        posthogInstance.shutdown();
        setPosthogInstance(null); // Reset instance state
      }
      // Ensure route change listener is removed if consent is not 'enable'
      // This line might be redundant if the cleanup function handles it, but ensures clarity
      Router.events.off('routeChangeComplete', () => posthogInstance?.capture('$pageview'));
    }
  }, [consent, posthogInstance]); // Dependencies array

  // Conditionally wrap with PostHogProvider only in production and when consented
  const AppContent = process.env.NODE_ENV === 'production' && posthogInstance && consent === 'enable' ? (
    <PostHogProvider client={posthogInstance}>
      <Component {...pageProps} />
    </PostHogProvider>
  ) : (
    <Component {...pageProps} />
  );

  return (
    <NextIntlClientProvider locale={router.locale} timeZone='Europe/Brussels' messages={pageProps.messages}>
      {AppContent}
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </NextIntlClientProvider>
  )
}

export default MyApp
