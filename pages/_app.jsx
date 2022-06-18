import Head from "next/head";
import "../styles/app.scss";
import Layout from "../components/Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { AnimatePresence, motion } from "framer-motion";

import { library } from '@fortawesome/fontawesome-svg-core' //allows later to just use icon name to render-them
import { faGithub, faInstagram, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope, faEye, faSun, faMoon,
  faArrowLeftLong, faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(faGithub, faInstagram, faLinkedin, faFacebook, faEnvelope,
  faEye, faSun, faMoon, faArrowLeftLong, faCalendarDay);

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
  when: "afterChildren"
};

const MyApp = ({ Component, pageProps, router }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <NextIntlProvider messages={pageProps.messages}>
        <Layout>
          <AnimatePresence exitBeforeEnter initial={true}>
            <motion.div
              transition={spring}
              key={router.pathname}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              id="page-transition-container"
            >
              <Component {...pageProps} key={router.route} />
            </motion.div>
          </AnimatePresence>
          <Head>
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </Layout>
      </NextIntlProvider>
    </ThemeProvider>
  )
}

export default MyApp;
