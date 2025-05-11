import React from 'react'
import { useInView } from 'react-intersection-observer'

const Heading = ({ title, subtitle, titleClasses = '', split, noSubtitle, level = 'h2' }) => {
    // Map heading level to corresponding class
    const headingClass = level === 'h1' ? 'h1' : level === 'h2' ? 'h2' : level === 'h3' ? 'h3' : '';
    const { ref, inView } = useInView({
        threshold: 0, triggerOnce: true
    });

    if (noSubtitle) {
        const HeadingTag = level;
        return (
            <HeadingTag
                className={`${headingClass} transition-all duration-700 ease-linear 
                ${inView && `is-visible opacity-100 translate-y-0`} 
                ${!inView && `opacity-40 translate-y-10`} 
                ${titleClasses}`.trim()}
                ref={ref}
            >
                {title}
            </HeadingTag>
        );
    }

    if (split) {
        const HeadingTag = level;
        return (
            <HeadingTag
                className={`${headingClass} lg:mb-0 transition-all duration-700 ease-linear 
                ${inView && `is-visible opacity-100 translate-y-0`} 
                ${!inView && `opacity-40 translate-y-10`} 
                ${titleClasses}`.trim()}
                ref={ref}
            >
                {split[0]}
                <div className={`xl:mt-2 2xl:mt-3 3xl:mt-4 inline-block lg:block font_mohave`}>
                    &{split[1]}
                </div>
            </HeadingTag>
        );
    }

    const HeadingTag = level;
    return (
        <div
            className={`flex flex-col-reverse transition-all duration-700 ease-linear 
            ${inView && `is-visible opacity-100 translate-y-0`} 
            ${!inView && `opacity-40 translate-y-10`}`}
            ref={ref}
        >
            <HeadingTag className={`${headingClass} ${titleClasses}`.trim()}>
                {title}
            </HeadingTag>
            <h3 className="h3 uppercase font-bold text-theme_darker 
            text-opacity-100 mb-4 md:mb-5 lg:mb-4 tracking-widest text-sm 
            lg:text-lg xl:mb-8 xl:text-2xl">
                {subtitle}
            </h3>
        </div>
    );
}

export default Heading