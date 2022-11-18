import React from 'react'

const Heading = ({ title, subtitle, titleClasses }) => {
    return (
        <div>
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