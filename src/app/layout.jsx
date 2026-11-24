import { getLocale } from 'next-intl/server';
import Script from 'next/script';

export const revalidate = 3600;

export const metadata = {
  metadataBase: new URL('https://webdevamin.com'),
};

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
              ad_storage: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
