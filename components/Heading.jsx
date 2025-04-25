import React from 'react'
import { useInView } from 'react-intersection-observer'

const Heading = ({ title, subtitle, titleClasses, split, noSubtitle }) => {
    const { ref, inView } = useInView({
        threshold: 0, triggerOnce: true
    });

    if (noSubtitle) {
        return (
            <h2 className={`transition-all duration-700 ease-linear 
            ${inView && `is-visible opacity-100 translate-y-0`} 
            ${!inView && `opacity-40 translate-y-10`}
            ${titleClasses}`} ref={ref}>
                {title}
            </h2>
        )
    }

    if (split) {
        return (
            <h2 className={`lg:mb-0 transition-all 
            duration-700 ease-linear 
            ${inView && `is-visible opacity-100 translate-y-0`} 
            ${!inView && `opacity-40 translate-y-10`}`} ref={ref}>
                {split[0]}
                <div className={`xl:mt-2 2xl:mt-3 3xl:mt-4 
                inline-block lg:block font_mohave`}>
                    &{split[1]}
                </div>
            </h2>
        )
    }

    return (
        <div className={`transition-all 
        duration-700 ease-linear 
        ${inView && `is-visible opacity-100 translate-y-0`} 
        ${!inView && `opacity-40 translate-y-10`}`}
            ref={ref}>
            <div className={`uppercase font-bold text-theme_darker
            text-opacity-100 mb-4 md:mb-5 lg:mb-4 tracking-widest 
            text-sm lg:text-lg xl:mb-8 xl:text-2xl`}>
                {subtitle}
            </div>
            <h2 className={titleClasses}>
                {title}
            </h2>
        </div>
    )
}

export default Heading