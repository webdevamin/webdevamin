import React from 'react'
import Heading from '../Heading';
import Image from 'next/image';
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';
import ButtonOne from '../Buttons/ButtonOne';

// Horizontal stacked view with 2 columns
const BlockCols = ({ content }) => {
    const { title, slug, text, subtitle, img, position, side } = content;
    const { src, alt, width, height } = img || {};

    return (
        <BlockLayoutTwo title={title} slug={slug}
            contentClasses={`xl:flex-row-reverse`}>
            <div className={`mb-8 md:mb-0 md:basis-10/12 xl:mr-8`}>
                <h2 className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                    <Heading title={title} />
                </h2>
                <Image
                    src={whoUrl} width={700} height={400} alt={whoAlt}
                    style={{ objectFit: 'cover' }} />
            </div>
            <div className={`md:w-full`}>
                <div className={`hidden md:block`}>
                    <Heading title={title} />
                </div>
                <h3 className={`text-base sm:text-lg md:mb-4 
            md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                    {subtitle}
                </h3>
                <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
        </BlockLayoutTwo>
    )
}

export default BlockCols