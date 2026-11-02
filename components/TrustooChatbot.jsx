'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Cookies from 'js-cookie';
import useConsentStore from '../utils/store';

// Third-party widget (Trustlocal/Trustoo): only load after cookie consent, and only on Dutch pages
export default function TrustooChatbot({ locale }) {
  const { consent } = useConsentStore();
  const [storedConsent, setStoredConsent] = useState('');

  useEffect(() => {
    setStoredConsent(Cookies.get('wda-consent') || '');
  }, []);

  // A choice made in the banner (store) wins over the cookie read on load
  const currentConsent = consent || storedConsent;

  if (locale !== 'nl' || currentConsent !== 'enable') return null;

  return (
    <>
      <link rel="stylesheet" href="https://chatbot-widget.trustoo.nl/trustoo-chatbot.css" />
      <Script
        src="https://chatbot-widget.trustoo.nl/trustoo-chatbot.iife.js"
        strategy="afterInteractive"
        data-id="-CR4Gd8admGNkkF2XNSfqr9B_EzwjzCx9Zc15JJbpo73lQ"
        data-country-code="BE"
        data-language-code="nl-BE"
        data-main-language="nl-BE"
        data-bot-name="Webdevamin"
        data-avatar-url="https://static.trustlocal.be/pros/173357/chatbot/avatar?v=4903784"
        data-avatar-color="#1F6FEB"
        data-primary-color="#1B2A4A"
        data-launcher-icon="chat"
        data-enable-callback="true"
        data-enable-whatsapp="true"
        data-enable-quote="true"
        data-enable-appointment="false"
        data-enable-ai="true"
        data-whatsapp-number="+32470930916"
        data-quote-fields="name,phone,email,project,budget"
        data-welcome-message="Hoi, het is met Webdevamin, professionele webontwikkelaar uit Brugge"
        data-teaser-enabled="true"
        data-teaser-text="Vragen? Ik help u graag 👋"
        data-auto-open="true"
        data-auto-open-delay="5"
        data-tone="friendly"
        data-address-form="je"
        data-auto-init="true"
      />
    </>
  );
}
