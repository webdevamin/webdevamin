import About from '../components/Home/About'
import Header from '../components/Layouts/Header'
import Projects from '../components/Home/Projects'
import Seo from '../components/Seo'
import Testimonials from '../components/Home/Testimonials'
import PageLayout from '../components/Layouts/PageLayout'
import Blogs from '../components/Home/Blogs'
import Contact from '../components/Contact'
import Footer from '../components/Layouts/Footer'
import {
  GET_TECHS, GET_PAGE, GET_PROJECTS, GET_BLOGS,
  GET_TESTIMONIALS
} from '../graphql/queries';
import { getData } from '../graphql/api';
import { destructureCollectionType, destructureCollectionTypeObject } from '../utils/app';
import Hero from '../components/Home/Hero'

const Index = ({ pageData, projectsData, blogsData,
  testimonialsData, techData }) => {
  const { globalData } = pageData;
  const projects = destructureCollectionType(projectsData.projects);
  const blogs = destructureCollectionType(blogsData.blogs);
  const testimonials = destructureCollectionType(testimonialsData.testimonials);
  const techs = destructureCollectionType(techData.teches);
  const page = destructureCollectionTypeObject(pageData.data.pages, true);

  const { blogs: blogsGlobal, pages, services, socials,
    regions, contactblock } = globalData;
  const { seo, blocks, alternates, localepages } = page;

  return (
    <>
      <Seo seo={seo} alternates={alternates} />
      <div className={`md:bg-banner_image md:bg-no-repeat 
      md:bg-[center] md:bg-contain 2xl:bg-[center_-2rem] 
      3xl:bg-[center_-3rem]`}>
        <Header pages={pages} localepages={localepages} />
        <Hero content={blocks.find(block => block.slug === `hero`)}
          socialsRaw={socials} />
      </div>
      <PageLayout>
        <About content={blocks.find(block => block.slug === `about`)}
          techs={techs} />
        <Projects content={blocks.find(block => block.slug === `projects`)}
          data={projects} />
        <Blogs content={blocks.find(block => block.slug === `blogs`)}
          data={blogs} />
        <Testimonials content={blocks.find(block => block.slug === `testimonials`)}
          data={testimonials} />
        <Contact content={contactblock} />
        <Footer servicesRaw={services} blogsRaw={blogsGlobal}
          socialsRaw={socials} regionsRaw={regions} />
      </PageLayout>
    </>
  )
}

export default Index

export async function getStaticProps({ locale }) {
  const pageData = await getData(GET_PAGE, { "slug": "home", "locale": [locale] });
  const projectsData = await getData(GET_PROJECTS, { locale: [locale] }, false);
  const blogsData = await getData(GET_BLOGS, { locale: [locale] }, false);
  const testimonialsData = await getData(GET_TESTIMONIALS, { locale: [locale] }, false);
  const techData = await getData(GET_TECHS, { locale: [locale] }, false);

  return {
    props: { pageData, projectsData, blogsData, testimonialsData, techData },
  }
}