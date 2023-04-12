import React from 'react'
import Seo from '../components/Seo';
import Header from '../components/Layouts/Header';
import HeroOne from '../components/Heroes/HeroOne';

const Pricing = () => {
  return (
    <>
      <Seo seo={seo} alternates={alternates} />
      <Header nav={navigation} localepages={localepages} />
      <HeroOne content={hero} socialsRaw={socials} />
    </>
  )
}

export default Pricing