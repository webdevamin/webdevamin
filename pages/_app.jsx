import Head from "next/head";
import "../styles/app.scss";
import Layout from "../components/Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlProvider } from 'next-intl';

config.autoAddCss = false;

const MyApp = ({ Component, pageProps }) => {
  return (
    <NextIntlProvider messages={pageProps.messages}>
      <Layout>
        <Component {...pageProps} />
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Layout>
    </NextIntlProvider>
  )
}

export default MyApp;
