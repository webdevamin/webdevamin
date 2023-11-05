import React from 'react'
import Image from 'next/image';
import ButtonThree from '../Buttons/ButtonThree';

const CardTwo = ({ imgUrl, title, text, subtitle, slug, alt, badge }) => {
    const { bText, bgColor, color } = badge || {};

    return (
        <article>
            <div className={`relative h-[calc(100vw/2)] 
        sm:h-[calc(100vw/3)] md:h-[calc(100vw/3.75)] 
        xl:h-[calc(100vw/6)] 3xl:h-[calc(100vw/6.5)] rounded-xl`}>
                <Image
                    src={imgUrl}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={alt} className={`rounded-xl`}
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className={`mt-4 ml-1`}>
                <h3 className={`mb-2 sm:mb-3 text-base lg:text-lg`}>
                    <span>{title}</span>
                    {
                        badge && (
                            <span className={`text-xs sm:text-sm rounded px-1 py-0.5 ml-3
                            ${bgColor || `bg-cyan-500`} 
                            ${color || `text-white`}`}>
                                {bText}
                            </span>
                        )
                    }
                </h3>
                <p className={`text-base clamp_2`}>{subtitle}</p>
                <ButtonThree href={`/projects/${slug}`}
                    text={text} noLink />
            </div>
        </article>
    )
}

export default CardTwo