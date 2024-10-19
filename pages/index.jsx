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

const Index = ({ localesData, blogsData, servicesData, socialsData, regionsData, projectsData, pagesData, heroBannerData, contactBlockData, pageData }) => {
  const { seo, alternates, alternateLangs, blocks } = pageData;

  return (
    <>
      <Seo seo={seo} alternates={alternates} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} heroBannerData={heroBannerData} />
      <Hero content={blocks.find(block => block.slug === `hero`)}
        socials={socialsData} />
      <PageLayout>
        <About content={blocks.find(block => block.slug === `about`)} />
        <Projects content={blocks.find(block => block.slug === `projects`)}
          data={projectsData} />
        <Blogs content={blocks.find(block => block.slug === `blogs`)}
          data={blogsData} />
        <Testimonials content={blocks.find(block => block.slug === `testimonials`)} />
        <Contact content={contactBlockData} />
        <Footer services={servicesData} blogs={blogsData} pages={pagesData}
          socials={socialsData} regions={regionsData} followExternalLinks />
      </PageLayout>
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
      servicesData: (await import(`../lang/${locale}/services.json`)).default,
      regionsData: (await import(`../lang/${locale}/regions.json`)).default,
      pagesData: (await import(`../lang/${locale}/pages.json`)).default,
      heroBannerData: (await import(`../lang/${locale}/heroBanner.json`)).default,
      contactBlockData: (await import(`../lang/${locale}/contactBlock.json`)).default,
      // End global data

      projectsData: (await import(`../lang/${locale}/projects.json`)).default,
      pageData: (await import(`../lang/${locale}/pages/home.json`)).default,
    },
  }
}