'use client';

import React, { useState } from 'react'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Tooltip } from "flowbite-react"
import Link from 'next/link';

// Example: Projects
const CardTwo = ({ imgUrl, title, subtitle, alt, badge, border, type, link, technologies = [], badgeAlt, badgeAltTwo }) => {
    const pathname = usePathname();
    const locale = pathname.split('/')[1];
    const { bText, bgColor, color } = badge || {};
    const [isHovered, setIsHovered] = useState(false);

    // Determine text based on locale and link presence
    const buttonText = locale === 'en' ? 'Visit website' : 'Bezoek website';

    // Get max 3 primary technologies to show
    const primaryTechs = technologies?.slice(0, 3) || [];

    // Create the card content
    const cardContent = (
        <div>
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

                <div className='flex flex-wrap gap-2'>
                    {badgeAlt && (
                        <span className="inline-block text-xs font-medium 
                        bg-theme bg-opacity-10 text-theme_darker rounded-full 
                        px-2.5 py-1 mb-3 lg:mb-4 border border-theme_darker border-opacity-20">
                            {badgeAlt}
                        </span>
                    )}

                    {badgeAltTwo && (
                        <span className="inline-block text-xs font-semibold bg-dark bg-opacity-80 text-white rounded-full px-2.5 py-1 mb-3 lg:mb-4">
                            {badgeAltTwo}
                        </span>
                    )}
                </div>

                <p className={`text-base clamp_3 text-gray-600 mb-3 transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-70'}`}>
                    {subtitle}
                </p>
                {link && (
                    <div className="mt-4 flex items-center text-sm font-semibold text-theme_darker hover:text-dark transition-colors">
                        {buttonText}
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <article
            className="group transition-all duration-500 hover:-translate-y-1.5 rounded-xl relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {link ? (
                <Link href={link} target="_blank" rel="noopener noreferrer" className="block" aria-label={title}>
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
        </article>
    );
}

export default CardTwo