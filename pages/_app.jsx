import Head from "next/head";
import "../styles/app.scss";
import Layout from "../components/Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';

import { library } from '@fortawesome/fontawesome-svg-core' //allows later to just use icon name to render-them
import { faGithub, faInstagram, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faEye, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;
library.add(faGithub, faInstagram, faLinkedin, faFacebook, faEnvelope,
  faEye, faSun, faMoon);

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <NextIntlProvider messages={pageProps.messages}>
        <Layout>
          <Component {...pageProps} />
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </Layout>
      </NextIntlProvider>
    </ThemeProvider>
  )
}

export default MyApp;
