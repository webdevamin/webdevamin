import { getLocale } from 'next-intl/server';
import Script from 'next/script';
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return (
    <html lang={locale || 'en'}>
      <head>
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
      <body>{children}</body>
    </html>
  );
}
