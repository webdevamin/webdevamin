import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';

import '../../../styles/globals.scss';
import PostHogProvider from '../../../components/PostHogProvider';
import ChatProvider from '../../../components/Chat/ChatProvider';
import QuoteModal from '../../../components/QuoteModal';
import localFont from 'next/font/local';
import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get('host');

  const baseMetadata = {
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/images/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/images/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/images/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      ],
      apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
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

const quicksand = localFont({
  src: '../../../public/fonts/Quicksand-Variable.ttf',
  weight: '400 700',
  style: 'normal',
  variable: '--font-quicksand',
  display: 'swap',
});

const mohave = localFont({
  src: '../../../public/fonts/Mohave-Variable.ttf',
  weight: '600 700',
  style: 'normal',
  variable: '--font-mohave',
  display: 'swap',
});

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const quoteTexts = (await import(`../../../messages/${locale}/quote.json`)).default;
  const chatTexts = (await import(`../../../messages/${locale}/chat.json`)).default;

  return (
    <PostHogProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className={`${quicksand.className} ${quicksand.variable} ${mohave.variable}`}>
          <ChatProvider locale={locale} texts={chatTexts}>
            {children}
            <QuoteModal texts={quoteTexts} />
          </ChatProvider>
        </div>
      </NextIntlClientProvider>
    </PostHogProvider>
  );
}
