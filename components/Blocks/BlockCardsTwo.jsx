import React from 'react'
import { Card } from "flowbite-react";
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';
import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';

const BlockCardsTwo = ({ content }) => {
    const { title, text, slug, subtitle, position, items, buttons, layout } = content;
    const { name, position: layoutPosition } = layout || {};
    const isBlockLayoutTwo = name === `block-layout-two`;
    const Layout = isBlockLayoutTwo ? BlockLayoutTwo : BlockLayoutOne;

    return (
        <Layout position={layoutPosition} title={title} slug={slug} textCenter={false} includeMaxWidth={false}>
            <div className='4xl:pr-5 4xl:pl-12'>
                <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `4xl:justify-end 4xl:items-end 4xl:text-right` : `max-w-6xl`}`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div dangerouslySetInnerHTML={{ __html: text }} className='p' />
                </section>
                <div className='mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4'>
                    {
                        items.map((item, i) => {
                            const { title, description } = item;

                            return (
                                <Card key={i} className="bg-transparent card_two">
                                    <h3 className="text-xl xl:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
                                        {title}
                                    </h3>
                                    <p className="font-normal text-gray-700 dark:text-gray-400">
                                        {description}
                                    </p>
                                </Card>
                            )
                        })
                    }
                </div>
                {
                    (buttons && buttons.length >= 1) && (
                        <div className={`flex flex-col gap-4 lg:flex-row mt-8 lg:mt-12 l:gap-6`}>
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
                    )
                }
            </div>
        </Layout>
    )
}

export default BlockCardsTwo;