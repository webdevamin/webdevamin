import Head from "next/head";
import "../styles/app.scss";
import Layout from "../components/Layout";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Layout>
  )
}

export default MyApp;
