import Seo from '../components/Seo'
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Header from "../components/Header";

const Index = () => {
  return (
    <>
      <Seo />
      <Header />
      <main>
        <Hero />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default Index;

export async function getStaticProps({ locale }) {
  return {
      props: {
          // You can get the messages from anywhere you like. The recommended
          // pattern is to put them in JSON files separated by language and read
          // the desired one based on the `locale` received from Next.js.
          messages: (await import(`../lang/${locale}.json`)).default
      }
  };
}