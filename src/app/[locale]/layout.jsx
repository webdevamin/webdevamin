import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

import '../../../styles/globals.scss';
import PostHogProvider from '../../../components/PostHogProvider';
import { Quicksand, Mohave } from 'next/font/google';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host');

  const baseMetadata = {
    icons: {
      icon: '/favicon.ico',
    },
  };

  if (host !== 'webdevamin.com') {
    return {
      ...baseMetadata,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return baseMetadata;
}

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
});

const mohave = Mohave({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mohave',
});

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <PostHogProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className={`${quicksand.className} ${quicksand.variable} ${mohave.variable}`}>
          {children}
        </div>
      </NextIntlClientProvider>
    </PostHogProvider>
  );
}
