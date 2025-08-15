'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import useConsentStore from '../utils/store';
import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';

const key = `wda-consent`;

export default function PostHogProvider({ children }) {
  const { consent } = useConsentStore();
  const [posthogInstance, setPosthogInstance] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const currentConsent = Cookies.get(key) || consent;

    if (currentConsent === 'enable') {
      if (!posthogInstance) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: "/ingest",
          ui_host: 'https://eu.posthog.com',
          person_profiles: 'identified_only',
          loaded: (ph) => {
            setPosthogInstance(ph);
          }
        });
      }
    } else {
      if (posthogInstance) {
        posthogInstance.shutdown();
        setPosthogInstance(null);
      }
    }
  }, [consent, posthogInstance]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (posthogInstance && pathname) {
        let url = window.origin + pathname;
        if (searchParams.toString()) {
            url = url + `?${searchParams.toString()}`;
        }
        posthogInstance.capture('$pageview', {
            '$current_url': url,
        });
    }
  }, [pathname, searchParams, posthogInstance]);

  if (process.env.NODE_ENV === 'production' && posthogInstance && consent === 'enable') {
    return <Provider client={posthogInstance}>{children}</Provider>;
  }

  return <>{children}</>;
}
