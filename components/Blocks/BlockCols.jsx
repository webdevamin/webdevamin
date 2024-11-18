import React from 'react'
import Heading from '../Heading';
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';
import { componentMapper } from '../../utils/app';
import ButtonOne from '../Buttons/ButtonOne';

// Horizontal stacked view with 2 columns. Other side is another component that can be rendered on choice
const BlockCols = ({ content }) => {
    const { title, slug, text, subtitle, side, buttons } = content;
    const ComponentToRenderSide = componentMapper[side.component];

    return (
        <BlockLayoutTwo title={title} slug={slug} contentClasses={`xl:flex-row-reverse`}>
            <div className={`md:w-full flex flex-col md:flex-row gap-16 md:gap-20`}>
                <div className='md:w-7/12'>
                    <Heading title={title} />
                    <h3 className={`text-base sm:text-lg md:mb-4 md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                        {subtitle}
                    </h3>
                    <div dangerouslySetInnerHTML={{ __html: text }}
                        className={`p mt-10`} />
                    <div className={`flex flex-col gap-4 lg:flex-row mt-8 lg:mt-10`}>
                        {
                            buttons.map((btn, i) => {
                                const { href, text } = btn;
                                const isOdd = i % 2 !== 0 ? true : false;

                                if (href) {
                                    return (
                                        <ButtonOne key={i} href={href}
                                            text={text} outline={isOdd} noMargin classes={`sm:px-14 text-center`} />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className='md:w-5/12 md:mr-5'>
                    <ComponentToRenderSide content={side} />
                </div>
            </div>
        </BlockLayoutTwo>
    )
}

export default BlockCols