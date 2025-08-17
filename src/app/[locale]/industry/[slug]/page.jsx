import Header from '../../../../../components/Layouts/Header'
import Footer from '../../../../../components/Layouts/Footer'
import PageLayout from '../../../../../components/Layouts/PageLayout'
import Contact from '../../../../../components/Contact'
import Hero from '../../../../../components/Home/Hero'
import PricingSection from '../../../../../components/Home/Pricing'
import BlockAccordion from '../../../../../components/Blocks/BlockAccordion'
import Testimonials from '../../../../../components/Home/Testimonials'
import CallToAction from '../../../../../components/Home/CallToAction'
import Projects from '../../../../../components/Home/Projects'
import JsonLd from '../../../../../components/SEO/JsonLd'
import { notFound } from 'next/navigation'
import { routing } from '../../../../i18n/routing'
import BlockLayoutOne from '../../../../../components/Layouts/BlockLayoutOne'
import BlockLayoutTwo from '../../../../../components/Layouts/BlockLayoutTwo'
import Heading from '../../../../../components/Heading'
import SubHeading from '../../../../../components/SubHeading'
import ButtonOne from '../../../../../components/Buttons/ButtonOne'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faMapMarkedAlt, faMobile, faSearch, faCreditCard, faCalculator } from '@fortawesome/free-solid-svg-icons'

async function getData(locale, slug) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Only handle taxi-website-laten-maken for now
  if (slug !== 'taxi-website-laten-maken') {
    notFound();
  }

  const localesData = (await import(`../../../../../messages/${locale}/locales.json`)).default;
  const socialsData = (await import(`../../../../../messages/${locale}/socials.json`)).default;
  const blogsData = (await import(`../../../../../messages/${locale}/blogs.json`)).default;
  const pagesData = (await import(`../../../../../messages/${locale}/pages.json`)).default;
  const heroBannerData = (await import(`../../../../../messages/${locale}/heroBanner.json`)).default;
  const contactBlockData = (await import(`../../../../../messages/${locale}/contactBlock.json`)).default;
  const projectsData = (await import(`../../../../../messages/${locale}/projects.json`)).default;
  const pageData = (await import(`../../../../../messages/${locale}/industries/taxi-website-laten-maken.json`)).default;

  return {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    heroBannerData,
    contactBlockData,
    projectsData,
    pageData,
  };
}

export async function generateMetadata({ params: { locale, slug } }) {
  const { pageData } = await getData(locale, slug);
  const { seo, alternates, jsonLd } = pageData;
  const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

  const defaultImage = image || (locale === `nl` ?
    `/images/ogbanner-nl.png` :
    `/images/ogbanner.png`);

  return {
    title: `${title} | Webdevamin`,
    description: description,
    keywords: keywords,
    canonical: canonical,
    alternates: {
      canonical: canonical,
      languages: alternates.reduce((acc, alt) => {
        acc[alt.hreflang] = alt.href;
        return acc;
      }, {}),
    },
    openGraph: {
      title: `${ogTitle || title} | Webdevamin`,
      description: ogDescription || description,
      url: canonical,
      siteName: 'Webdevamin',
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ogTitle || title} | Webdevamin`,
      description: ogDescription || description,
      creator: '@Webdevamin',
      images: [defaultImage],
    },
    other: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-UA-Compatible': 'IE=edge',
    },
    jsonLd: jsonLd,
  };
}

// Why Taxi Website Section Component
const WhyTaxiWebsite = ({ content }) => {
  const { title, subtitle, description, content: contentItems, image } = content;

  return (
    <BlockLayoutTwo title={title} slug="why-taxi-website">
      <div className="md:basis-6/12">
        <Heading title={title} subtitle={subtitle} />
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: description }} />
        
        {contentItems.map((item, index) => {
          if (item.type === 'paragraph') {
            return (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {item.text}
              </p>
            );
          }
          
          if (item.type === 'list') {
            return (
              <ul key={index} className="mb-6 space-y-2">
                {item.items.map((listItem, listIndex) => (
                  <li key={listIndex} className="flex items-start">
                    <span className="text-theme mr-2 mt-1">✓</span>
                    <span className="text-gray-700">{listItem}</span>
                  </li>
                ))}
              </ul>
            );
          }
          
          return null;
        })}
      </div>
      
      <div className="mt-10 md:mt-0 md:basis-6/12">
        <div className="relative">
          <Image
            src={image}
            alt="Waarom taxi website belangrijk is"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </BlockLayoutTwo>
  );
};

// Features Section Component
const FeaturesSection = ({ content }) => {
  const { title, subtitle, features } = content;

  const iconMap = {
    faCalendarCheck,
    faMapMarkedAlt,
    faMobile,
    faSearch,
    faCreditCard,
    faCalculator
  };

  return (
    <BlockLayoutOne title={title} slug="features-benefits">
      <div className="w-full">
        <Heading title={title} subtitle={subtitle} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => {
            const { icon, title, description } = feature;
            const IconComponent = iconMap[icon] || faCalendarCheck;
            
            return (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-theme mb-4">
                  <FontAwesomeIcon icon={IconComponent} size="3x" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

// Portfolio Case Component
const PortfolioCase = ({ content }) => {
  const { title, subtitle, description, project } = content;
  const { name, url, image, description: projectDesc, features, results } = project;

  return (
    <BlockLayoutTwo title={title} slug="portfolio-case">
      <div className="md:basis-6/12">
        <Heading title={title} subtitle={subtitle} />
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: description }} />
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-theme mb-4">{name}</h3>
          <p className="text-gray-700 mb-4">{projectDesc}</p>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Functionaliteiten:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-theme mr-2">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-3">Resultaten:</h4>
            <ul className="space-y-1">
              {results.map((result, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-theme mr-2">→</span>
                  <span className="text-gray-700">{result}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <ButtonOne href={url} text="Bekijk Website" target="_blank" />
        </div>
      </div>
      
      <div className="mt-10 md:mt-0 md:basis-6/12">
        <div className="relative">
          <Image
            src={image}
            alt={`${name} taxi website`}
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </BlockLayoutTwo>
  );
};

// Custom Pricing Component for Taxi Website
const TaxiPricingSection = ({ content }) => {
  const { title, subtitle, plans } = content;

  return (
    <BlockLayoutOne title={title} slug="taxi-pricing">
      <div className="w-full">
        <Heading title={title} subtitle={subtitle} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const { name, price, period, description, features, cta, popular } = plan;
            
            return (
              <div key={index} className={`relative p-8 bg-white rounded-lg shadow-lg ${popular ? 'border-2 border-theme transform scale-105' : 'border border-gray-200'}`}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-theme text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Meest Populair
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-theme">€{price}</span>
                    <span className="text-gray-600 ml-1">{period}</span>
                  </div>
                  <p className="text-gray-600">{description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className="text-theme mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-center">
                  <ButtonOne 
                    href="/contact" 
                    text={cta} 
                    outline={!popular}
                    classes="w-full justify-center"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BlockLayoutOne>
  );
};

const IndustryPage = async ({ params: { locale, slug } }) => {
  const {
    localesData,
    socialsData,
    blogsData,
    pagesData,
    heroBannerData,
    contactBlockData,
    projectsData,
    pageData,
  } = await getData(locale, slug);

  const { alternates, alternateLangs, blocks } = pageData;

  return (
    <>
      <JsonLd data={pageData.jsonLd} />
      <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} heroBannerData={heroBannerData} />
      
      <Hero content={blocks.find(block => block.slug === 'hero')} socials={socialsData} />
      
      <PageLayout>
        <WhyTaxiWebsite content={blocks.find(block => block.slug === 'why-taxi-website')} />
        
        <FeaturesSection content={blocks.find(block => block.slug === 'features-benefits')} />
        
        <PortfolioCase content={blocks.find(block => block.slug === 'portfolio-case')} />
        
        <TaxiPricingSection content={blocks.find(block => block.slug === 'pricing')} />
        
        <div className="transition-all duration-500 rounded-xl">
          <BlockAccordion content={blocks.find(block => block.slug === 'faq')} center />
        </div>
        
        <CallToAction content={blocks.find(block => block.slug === 'cta-bottom')} />
        
        <Testimonials content={blocks.find(block => block.slug === 'testimonials')} />
        
        <Contact content={contactBlockData} />
        
        <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
      </PageLayout>
    </>
  );
};

export default IndustryPage;