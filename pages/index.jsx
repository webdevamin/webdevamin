import Seo from '../components/Seo'
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Header from "../components/Header";
import { gql, GraphQLClient } from 'graphql-request';

const Index = ({ data }) => {
  return (
    <>
      <Seo />
      <Header />
      <main>
        <Hero />
        <About />
        <Contact socials={data.socials}/>
      </main>
    </>
  )
}

export default Index;

export async function getStaticProps({ locale }) {
  const client = new GraphQLClient(
    'https://api-eu-central-1.graphcms.com/v2/cl30pogb60w7001z81zzp4xtw/master'
  );

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