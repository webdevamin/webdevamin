import About from '../components/Home/About'
import Header from '../components/Layouts/Header'
import Projects from '../components/Home/Projects'
import Seo from '../components/Seo'
import Testimonials from '../components/Home/Testimonials'
import PageLayout from '../components/Layouts/PageLayout'
import Blogs from '../components/Home/Blogs'
import Contact from '../components/Contact'
import Footer from '../components/Layouts/Footer'
import Hero from '../components/Home/Hero'
import PricingSection from '../components/Home/Pricing'
import BlockAccordion from '../components/Blocks/BlockAccordion'
import Services from '../components/Home/Services'
import CallToAction from '../components/Home/CallToAction'
import Why from '../components/Home/Why'

const Index = ({ localesData, blogsData, socialsData, projectsData, pagesData, heroBannerData, contactBlockData, pageData }) => {
  const { seo, alternates, alternateLangs, blocks, jsonLd } = pageData;

  return (
    <>
      <Seo seo={seo} alternates={alternates} jsonLd={jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} heroBannerData={heroBannerData} />
      <Hero content={blocks.find(block => block.slug === `hero`)}
        socials={socialsData} />
      <PageLayout>
        <About content={blocks.find(block => block.slug === `about`)} />
        
        {/* Conditionally render Why component only if the block exists */}
        {blocks.find(block => block.slug === `why-all-in-one`) && (
          <Why content={blocks.find(block => block.slug === `why-all-in-one`)} />
        )}

        <Services content={blocks.find(block => block.slug === `services`)} />
        <Projects 
          content={blocks.find(block => block.slug === `projects`)} 
          data={projectsData} 
        />
        <Blogs 
          content={blocks.find(block => block.slug === `blogs`)} 
          data={blogsData} 
        />
        <PricingSection content={blocks.find(block => block.slug === `pricing`)} />
        <CallToAction content={blocks.find(block => block.slug === 'cta')} />
        <Testimonials content={blocks.find(block => block.slug === `testimonials`)} />
        <div className="transition-all duration-500 rounded-xl">
          <BlockAccordion content={blocks.find(block => block.component === `faq`)} center />
        </div>
        <Contact content={contactBlockData} />
      </PageLayout>
      <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
    </>
  )
}

export default Index

export async function getStaticProps({ locale }) {
  return {
    props: {
      // Global data
      localesData: (await import(`../lang/${locale}/locales.json`)).default,
      socialsData: (await import(`../lang/${locale}/socials.json`)).default,
      blogsData: (await import(`../lang/${locale}/blogs.json`)).default,
      pagesData: (await import(`../lang/${locale}/pages.json`)).default,
      heroBannerData: (await import(`../lang/${locale}/heroBanner.json`)).default,
      contactBlockData: (await import(`../lang/${locale}/contactBlock.json`)).default,
      // End global data

      projectsData: (await import(`../lang/${locale}/projects.json`)).default,
      pageData: (await import(`../lang/${locale}/pages/home.json`)).default,
    },
  }
}