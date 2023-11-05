import React from 'react'
import Image from 'next/image'

const Slide = ({ image, title }) => {
    const { src, alt } = image;

    return (
        <article className={`relative`}>
            <div className={`relative h-[calc(100vw/1.75)] 
        md:h-[calc(100vw/3.5)] xl:h-[calc(100vw/4.20)] 
        2xl:h-[calc(100vw/4.2)] max-h-[427px]`}>
                <Image
                    src={src}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={alt}
                    style={{ objectFit: "cover" }}
                    className={`rounded-xl`}
                />
            </div>
            <h3 className={`leading-6 absolute left-0 right-0 m-auto 
            backdrop-blur-sm bg-dark/50 w-fit 
            text-center text-light rounded-2xl 
            top-1/2 text-xs px-4 py-1 mt-[12%] 
            lg:text-sm lg:px-5 lg:py-2 lg:mt-[15%] 
            xl:text-base xl:px-6 xl:py-3 xl:mt-[13%] 
            2xl:mt-24 ${title ? `block` : `hidden`}`}>
                {title}
            </h3>
        </article>
    )
}

export default Slide