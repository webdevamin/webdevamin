import Seo from '../components/Seo'
import About from '../components/About';
import Contact from '../components/Contact';
import Header from "../components/Header";
import { gql, GraphQLClient } from 'graphql-request';
import React from 'react';
import Hero from '../components/Hero';

const Index = ({ data }) => {
  const { socials } = data;

  return (
    <>
      <Seo />
      <Header />
      <Hero intro={true}/>
      <main>
        <About />
        <Contact socials={socials} />
      </main>
    </>
  )
}

export default Index;

export async function getStaticProps({ locale }) {
  const client = new GraphQLClient(process.env.API_URL);

  const query = gql`
  query MyQuery($locale: [Locale!]!) {
    socials(locales: $locale) {
      id
      label
      iconPrefix
      icon
      text
      url
    }
  }
  `

  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      data: await client.request(query, { locale: [locale] }),
      messages: (await import(`../lang/${locale}.json`)).default,
    }
  };
}