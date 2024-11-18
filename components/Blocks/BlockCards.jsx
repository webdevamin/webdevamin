import React from 'react'
import Heading from '../Heading';
import CardOne from '../Cards/CardOne';

// Normal vertical stacked view with cards
const BlockCards = ({ content }) => {
    const { title, slug, text, subtitle, items } = content;

    return (
        <div id={slug} className={`z-30 max-w-6xl mx-auto block_container`}>
            <section className={`xl:flex flex-col justify-center 
        items-center gap-16 4xl:px-0 xl:text-center`}>
                <div className={`text-center`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div dangerouslySetInnerHTML={{ __html: text }}
                        className={`p`} />
                </div>
                <div className={`grid grid-cols-1 lg:grid-cols-2 mt-20 xl:mt-6 gap-14 lg:flex-row lg:gap-x-10 lg:gap-y-14 text-center`}>
                    {
                        items.map((item, i) => {
                            const { title, body, backgroundColor, icon } = item;

                            return (
                                <CardOne title={title}
                                    bgColor={backgroundColor}
                                    key={i} text={body} icon={icon} />
                            )
                        })
                    }
                </div>
            </section>
        </div>
    )
}

export default BlockCards