import { Fragment } from 'react';
import Heading from '../Heading';
import { FullBleedLine } from '../Layouts/BorderedSection';

/*
 * Diensten als vakken gescheiden door lijnen: 1 kolom op gsm, 2 op tablet, 3 op
 * desktop. De rijlijn staat telkens voor het eerste vak van een nieuwe rij.
 */
const Services = ({ content }) => {
    const { title, subtitle, text, services } = content;

    return (
        <section id="services">
            <div className='max-w-7xl mx-auto'>
                <Heading title={title} subtitle={subtitle} />
                {text && <div className="max-w-5xl" dangerouslySetInnerHTML={{ __html: text }} />}

                <div className="relative mt-8 md:mt-10 xl:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <FullBleedLine className="absolute top-0" />
                    {services.map((service, index) => (
                        <Fragment key={index}>
                            {index > 0 && (
                                <FullBleedLine className={`relative col-span-full ${index % 2 === 0 ? 'md:block' : 'md:hidden'} ${index % 3 === 0 ? 'lg:block' : 'lg:hidden'}`} />
                            )}
                            <div className={`flex flex-col items-center text-center px-6 py-10 lg:px-8 border-dark ${index % 2 === 1 ? 'md:border-l-[0.5px]' : ''} ${index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l-[0.5px]'}`}>
                                <div className="rounded-full bg-theme bg-opacity-5 p-3 sm:p-4 lg:p-5 mb-3 lg:mb-4">
                                    <div className="text-theme_dark">
                                        {getServiceIcon(service.type)}
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold normal-case mb-2 sm:mb-3 text-gray-800 break-words hyphens-auto w-full px-1">
                                    {service.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 break-words">
                                    {service.description}
                                </p>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Helper function to return the appropriate icon for each service type
const getServiceIcon = (type) => {
    const iconClass = "h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9";

    switch (type.toLowerCase()) {
        case 'webdesign':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            );
        case 'webdevelopment':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            );
        case 'seo':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            );
        case 'graphicdesign':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            );
        case 'ecommerce':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            );
        case 'automation':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );
        default:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            );
    }
};

export default Services;
