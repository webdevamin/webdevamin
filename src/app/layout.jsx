import { getLocale } from 'next-intl/server';
import Script from 'next/script';
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return (
    <html lang={locale || 'en'}>
      <head>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'granted',
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted'
            });
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            }, {
              region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO']
            });
          `}
        </Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11183393827"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'AW-11183393827');
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
