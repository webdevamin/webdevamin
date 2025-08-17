import { getLocale } from 'next-intl/server';
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return (
    <html lang={locale || 'en'}>
      <body>{children}</body>
    </html>
  );
}
