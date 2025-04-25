import React, { useState } from 'react'
import Heading from '../Heading'
import { Card, Tooltip } from "flowbite-react"
import { CheckMarkIcon, MessageCircleQuestionIcon } from '../SvgIcons'
import Image from 'next/image';

const PricingSection = ({ content }) => {
    const { title, subtitle, text, pricing, img } = content;
    const { src, alt } = img;
    const [hoveredItem, setHoveredItem] = useState(null);

    // Extract pricing data
    const { webdesign: { content: pricingContent, items } } = pricing;
    const { main, mid, mainTwo: { first, second }, sub }
        = pricingContent;

    // Split items into featured (first 4) and others
    const featuredItems = items.slice(0, 4);

    return (
        <div id="pricing" className="block_container relative z-30 overflow-hidden md:mt-28 xl:mt-40">
            <section className="lg:flex lg:flex-row lg:items-start lg:gap-[7rem] text-center md:text-start lg:justify-between xl:justify-evenly">
                {/* Left Side - Pricing Card */}
                <div className="mt-1 sm:mt-3 md:mt-8 lg:mt-20 xl:mt-36 xl:w-full lg:max-w-md xl:max-w-2xl 2xl:max-w-3xl">
                    <div className="transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
                        <Card className="bg-transparent shadow">
                            <div className="flex flex-col items-center text-left mb-6">
                                <div className="flex flex-col items-start text-gray-900 w-full">
                                    <div className="flex items-baseline">
                                        <span className="text-xl font-semibold pr-1">€</span>
                                        <span className="text-4xl lg:text-5xl font-extrabold tracking-tight">{main}</span>
                                    </div>
                                    <span className="text-lg font-medium text-gray-600 
                                    my-1">{mid}</span>
                                    <div className="flex items-baseline mt-2">
                                        <span className="text-xl font-semibold pr-1">€</span>
                                        <span className="text-4xl lg:text-5xl font-extrabold tracking-tight pr-2">{first}</span>
                                    </div>
                                    <span className="text-theme_darker font-semibold 
                                    text-lg">{second}</span>
                                    <span className="font-normal text-gray-500 
                                    mt-2">{sub}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-2 pt-6">
                                <h4 className="text-lg font-semibold mb-4 text-left">
                                    Key Benefits
                                </h4>
                                <ul className="space-y-3">
                                    {featuredItems.map((item, i) => (
                                        <li key={i}
                                            className="flex items-start group transition-all duration-300 p-2 rounded-lg"
                                            onMouseEnter={() => setHoveredItem(i)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <CheckMarkIcon className={`text - theme flex - shrink - 0 ${hoveredItem === i ? 'scale-125' : ''} transition - transform duration - 300`} />
                                            </div>
                                            <div className="ml-3">
                                                <span
                                                    className="text-base font-normal leading-tight text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                                                    dangerouslySetInnerHTML={{ __html: item.title }}
                                                />
                                                {item.details && (
                                                    <Tooltip
                                                        content={item.details}
                                                        style='light'
                                                        className="max-w-xs w-72 break-words z-50"
                                                        animation="duration-300"
                                                    >
                                                        <MessageCircleQuestionIcon
                                                            className="w-4 h-4 text-gray-500 hover:text-theme ml-2 inline-block
                                                        transition-colors duration-300" />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Side - Title and Description */}
                <div className="mb-0 lg:self-start md:mb-4 md:ml-3 lg:ml-0 lg:mb-0">
                    <Heading title={title} subtitle={subtitle} />
                    <Image src={src} width={836} height={483} alt={alt} className="object-cover mt-4" />
                    <div
                        className="mt-4 max-w-2xl text-gray-700"
                        dangerouslySetInnerHTML={{ __html: text }}
                    />
                </div>
            </section>
        </div>
    );
};

export default PricingSection;