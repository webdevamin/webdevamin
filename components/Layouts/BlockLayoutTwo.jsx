import React from 'react'

const BlockLayoutTwo = ({ children, title, slug, position, contentClasses, noPadding = false }) => {
    return (
        <div {...slug && { id: slug }} className={`block_container 
        relative z-30 xl:w-screen xl:left-[calc(-50vw+50%)] ${!noPadding && `xl:py-20`}`}>
            <div className={`hidden absolute -z-10 bg-theme
            -translate-y-1/2 top-2/4 h-[115%] xl:flex shadow-2xl
            items-center flex-col justify-center 
            w-[calc(100vw-83%)] 8xl:w-[calc(((100vw-1504px)/2)+160px)]
            ${position === `right` ?
                    `right-0 rounded-l-xl 4xl:items-start 4xl:pl-20` :
                    `left-[0%] rounded-r-xl 4xl:items-end 4xl:pr-14`}`}>
                <h2 className={`uppercase text-5xl text-light flex items-center
                tracking-wide xl:mb-0 4xl:text-6xl
                ${position === `right` ? `rotate-90` : `-rotate-90`}`}>
                    {title}
                </h2>
            </div>
            <div className={`xl:w-10/12 xl:max-w-8xl xl:mx-auto xl:py-8`}>
                <div className={`${position === `right` ?
                    `xl:mr-[13%]` : `xl:ml-[13%]`}`}>
                    <section className={`page_container md:flex 
                        md:gap-20 md:items-center ${contentClasses}
                        ${position === `right` ? `md:flex-row-reverse` : ``}`}>
                        {children}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default BlockLayoutTwo