'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CardTwo from './Cards/CardTwo';

const ProjectsList = ({ projectsData }) => {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const locale = pathname.split('/')[1];

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div
            className={`pb-8 flex gap-y-14 flex-col md:pb-0 md:pr-0 md:w-full md:grid 
                md:grid-cols-2 xl:grid-cols-3 md:gap-x-14 md:gap-y-12 lg:mt-14`}
        >
            {projectsData.length > 0 ? (
                projectsData.map((project, i) => {
                    const { title, img, slug, description, border, link, technologies = [], niche = '', buttonText } = project;
                    const { src, alt } = img;

                    return (
                        <div
                            key={i}
                            className={`min-w-[75vw] sm:min-w-[53vw] md:min-w-0 transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                            style={{
                                transitionDelay: `${Math.min(i * 100, 500)}ms`,
                            }}
                        >
                            <CardTwo
                                imgUrl={src}
                                title={title}
                                text={buttonText}
                                subtitle={description}
                                slug={slug}
                                alt={alt}
                                border={border}
                                type={`project`}
                                link={link}
                                technologies={technologies}
                                badgeAlt={niche}
                            />
                        </div>
                    )
                })
            ) : (
                <div className="col-span-full py-10 text-center text-gray-500">
                    {locale === 'en'
                        ? 'No projects found in this category.'
                        : 'Geen projecten gevonden in deze categorie.'}
                </div>
            )}
        </div>
    );
}

export default ProjectsList;
