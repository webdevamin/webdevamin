import React, { useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import ButtonThree from '../Buttons/ButtonThree';
import { Tooltip } from "flowbite-react"
import Link from 'next/link';

const CardTwo = ({ imgUrl, title, subtitle, alt, badge, border, type, link, technologies = [], badgeAlt }) => {
    const router = useRouter();
    const { bText, bgColor, color } = badge || {};
    const [isHovered, setIsHovered] = useState(false);

    // Determine text based on locale and link presence
    const buttonText = router.locale === 'en' ? 'Visit website' : 'Bezoek website';

    // Get max 3 primary technologies to show
    const primaryTechs = technologies?.slice(0, 3) || [];

    // Create the card content
    const cardContent = (
        <>
            <div className={`relative rounded-xl w-full border shadow ${type === `project` ? `pt-[70%]` : `pt-[58.25%]`} overflow-hidden`}>
                <Image
                    src={imgUrl}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt={alt}
                    className={`rounded-xl absolute top-0 left-0 w-full h-full ${border && `border`} transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                    style={{ objectFit: "cover" }}
                    priority={type === 'project'}
                />
                {link && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 hover:bg-opacity-5" />
                )}
            </div>

            <div className={`mt-4 ml-1 relative`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-base lg:text-lg transition-colors duration-300 group-hover:text-theme font-medium flex-shrink-0 max-w-[70%] mb-0`}>
                        {badge && (
                            <span className={`text-xs sm:text-sm rounded px-1.5 mr-3 py-0.5 ${bgColor || `bg-theme_dark`} 
                            ${color || `text-white`}`}>
                                {bText ?? badge}
                            </span>
                        )}
                        <span>{title}</span>
                    </h3>

                    {primaryTechs.length > 0 && (
                        <div className="flex gap-1 ml-auto items-center">
                            {primaryTechs.map((tech, i) => {
                                const { name } = tech;

                                return (
                                    tech?.image?.src && (
                                        <Tooltip content={name} arrow={false} key={i}>
                                            <div className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors duration-200 p-1">
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <Image
                                                        src={tech.image.src}
                                                        alt={name}
                                                        width={25}
                                                        height={25}
                                                        className="object-contain max-h-full max-w-full"
                                                    />
                                                </div>
                                            </div>
                                        </Tooltip>
                                    )
                                )
                            })}
                        </div>
                    )}
                </div>

                {badgeAlt && (
                    <span className="inline-block text-xs font-medium bg-theme bg-opacity-10 text-theme_darker rounded-full px-2.5 py-1 mb-2">
                        {badgeAlt}
                    </span>
                )}

                <p className={`text-base clamp_2 text-gray-600 mb-3 transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-70'}`}>
                    {subtitle}
                </p>

                {link && (
                    <div className="mt-1 cursor-pointer relative z-10">
                        <ButtonThree href={link} text={buttonText} target="_blank" rel="noopener noreferrer" />
                    </div>
                )}
            </div>
        </>
    );

    return link ? (
        <article
            className="group transition-all duration-500 hover:-translate-y-1.5 rounded-xl relative overflow-hidden cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={link} passHref legacyBehavior>
                <a className="block" target="_blank" rel="noopener noreferrer" aria-label={title}>
                    {cardContent}
                </a>
            </Link>
        </article>
    ) : (
        <article
            className="group transition-all duration-500 hover:-translate-y-1.5 rounded-xl relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {cardContent}
        </article>
    );
}

export default CardTwo