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
    <div className="flex min-w-0 lg:justify-end">
      <div className="min-w-0 max-w-full text-light lg:text-right">
        <div hidden={showLiveReviews}>
          <ul className="flex flex-col gap-y-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6 lg:justify-end">
            <li><strong>Trustlocal 9,5/10</strong> (21 reviews)</li>
            <li><strong>Google 5,0/5</strong> (21 reviews)</li>
          </ul>
          <a
            className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-theme underline lg:text-sm"
            href="https://trustlocal.be/west-vlaanderen/brugge/webdesign/webdevamin/"
            rel="nofollow"
          >
            Bekijk de reviews op Trustlocal
          </a>
          <div className="text-xs text-light/70">
            Scores op <time dateTime="2026-11-12">12 november 2026</time>
          </div>
        </div>
        {enabled && (
          <div hidden={!showLiveReviews} className="text-left">
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
              data-border="hidden"
              data-theme="dark"
              data-background="transparent"
              data-google="default"
            />
          </div>
        )}
      </div>
    </div>
  );
}
