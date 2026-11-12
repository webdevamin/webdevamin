'use client';

import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import useConsentStore from '../utils/store';

export default function TrustlocalWidget() {
  const { consent } = useConsentStore();
  const [storedConsent, setStoredConsent] = useState('');
  const [hasLiveReviews, setHasLiveReviews] = useState(false);
  const widgetRef = useRef(null);
  const enabled = (consent || storedConsent) === 'enable';
  const showLiveReviews = enabled && hasLiveReviews;

  useEffect(() => {
    setStoredConsent(Cookies.get('wda-consent') || '');
  }, []);

  useEffect(() => {
    if (!enabled) {
      setHasLiveReviews(false);
      return;
    }

    const widget = widgetRef.current;
    const observer = new MutationObserver(() => {
      const links = widget.querySelectorAll('a[href]');
      links.forEach((link) => {
        link.rel = 'noopener noreferrer nofollow';
        link.setAttribute('aria-label', 'Bekijk de reviews op Trustlocal');
      });
      setHasLiveReviews(links.length > 0);
    });
    observer.observe(widget, { childList: true, subtree: true });

    // The widget initializes once per script execution, including after navigation.
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://static.trustlocal.be/widget/widget_v2.js';
    widget.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
      widget.replaceChildren();
    };
  }, [enabled]);

  return (
    <div className="col-span-full min-w-0">
      <div className="w-fit max-w-full rounded-lg bg-white p-4 text-dark">
        <div hidden={showLiveReviews}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li><strong>Trustlocal 9,5/10</strong> (21 reviews)</li>
            <li><strong>Google 5,0/5</strong> (21 reviews)</li>
          </ul>
          <a
            className="mt-3 inline-block text-sm font-semibold text-theme_darker underline lg:text-sm"
            href="https://trustlocal.be/west-vlaanderen/brugge/webdesign/webdevamin/"
            rel="nofollow"
          >
            Bekijk de reviews op Trustlocal
          </a>
          <div className="mt-1 text-xs text-gray-600">
            Scores op <time dateTime="2026-11-12">12 november 2026</time>
          </div>
        </div>
        {enabled && (
          <div hidden={!showLiveReviews}>
            <div
              ref={widgetRef}
              className="trustlocal-widget"
              data-id="Y6PYWNmZh-Rr3oRw-3BgY6qrb05IWzdLAYPhIyY9Aj4YQQ"
              data-language-code="nl"
              data-country-code="BE"
              data-badge="hidden"
              data-quote="default"
              data-size="small"
              data-type="landscape"
              data-border="shadow"
              data-theme="light"
              data-background="transparent"
              data-google="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}
