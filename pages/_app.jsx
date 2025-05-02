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
import { useEffect } from 'react';

config.autoAddCss = false
const key = `wda-consent`;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { consent } = useConsentStore();

  // Effect for handling route changes for pageviews/pageleaves
  // Only run PostHog initialization and tracking in non-development environments
  if (process.env.NODE_ENV !== 'development') {
    useEffect(() => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: 'https://eu.posthog.com',
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        // Enable debug mode in development - This part is now redundant here, but harmless
        loaded: (posthog) => {
          // Debug mode check is inside init now, but keeping this structure is fine
          // if (process.env.NODE_ENV === 'development') posthog.debug() // This condition will never be true here
        }
      })

      const handleRouteChange = () => posthog?.capture('$pageview')

      Router.events.on('routeChangeComplete', handleRouteChange);

      return () => {
        Router.events.off('routeChangeComplete', handleRouteChange);
      }
    }, []) // Empty dependency array ensures this runs only once on mount in production
  }

  return (
    <NextIntlClientProvider locale={router.locale} timeZone='Europe/Brussels' messages={pageProps.messages}>
      {
        (consent === 'enable' || Cookies.get(key) === 'enable') && (
          <>
            {
              process.env.NODE_ENV !== "development" && (
                <></>
              )
            }
          </>
        )
      }
      {process.env.NEXT_PUBLIC_ENV !== 'development' ? (
        <PostHogProvider client={posthog}>
          <Component {...pageProps} />
        </PostHogProvider>
      ) : (
        <Component {...pageProps} />
      )}
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </NextIntlClientProvider>
  )
}

export default MyApp
