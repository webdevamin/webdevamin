import React from 'react'
import { useInView } from 'react-intersection-observer'
import { TypeAnimation } from 'react-type-animation';

const HeroHeading = ({ title, smallerTitle }) => {
  const { ref, inView } = useInView({
    threshold: 1, triggerOnce: false
  });

  return (
    <h1 className={`transition-all duration-500 ease-linear 
    bg-transparent opacity-100 
    ${smallerTitle && `text-3xl mb-8 font-bold lg:text-4xl 
    xl:text-5xl tracking-tight 2xl:text-6xl`}
    ${inView && `is-visible opacity-100 translate-y-0`}
    ${!inView && `opacity-40 translate-y-10`}
    ${smallerTitle && `text-3xl mb-8 
    font-bold lg:text-4xl xl:text-5xl tracking-tight 
    2xl:text-6xl`}`} ref={ref}>
      {
        (Array.isArray(title)) ? (
          <TypeAnimation
            sequence={title}
            wrapper="div"
            className='font_mohave'
            cursor={true}
            speed={60}
          />
        ) : (title)
      }
    </h1>
  )
}

export default HeroHeading