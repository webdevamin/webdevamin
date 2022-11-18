import React from 'react'
import Image from 'next/image';
import ButtonThree from '../Buttons/ButtonThree';

const CardTwo = ({ imgUrl, title, text, subtitle, slug, alt }) => {
    return (
        <article>
            <div className={`relative h-[calc(100vw/2)] 
        sm:h-[calc(100vw/3)] md:h-[calc(100vw/3.75)] 
        xl:h-[calc(100vw/6)] 3xl:h-[calc(100vw/6.5)] rounded-xl`}>
                <Image src={imgUrl} alt={alt} className={`rounded-xl`}
                    objectFit={`cover`} layout={`fill`} />
            </div>
            <div className={`mt-4 ml-1`}>
                <h3 className={`mb-2 sm:mb-3 text-base lg:text-lg`}>
                    {title}
                </h3>
                <p className={`text-base clamp_2`}>{subtitle}</p>
                <ButtonThree href={`/projects/${slug}`}
                    text={text} noLink />
            </div>
        </article>
    )
}

export default CardTwo