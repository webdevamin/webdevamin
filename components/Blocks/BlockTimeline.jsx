import React from 'react'
import { Timeline } from "flowbite-react";
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';
import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';

const BlockTimeline = ({ content }) => {
    const { title, text, slug, subtitle, position, items, buttons } = content;

    return (
        <BlockLayoutTwo position={position} title={title} slug={slug}>
            <div className='4xl:pr-5 4xl:pl-12'>
                <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `4xl:justify-end 4xl:items-end 4xl:text-right` : `max-w-6xl`}`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div dangerouslySetInnerHTML={{ __html: text }} className='p' />
                </section>
                <div className='mt-8 lg:mt-10'>
                    <Timeline>
                        {
                            items.map((item, i) => {
                                return (
                                    <Timeline.Item key={i}>
                                        <Timeline.Point />
                                        <Timeline.Content>
                                            <Timeline.Title className='normal-case mb-2 lg:text-xl'>{item.title}</Timeline.Title>
                                            <Timeline.Body className='p text-gray-600'>{item.description}</Timeline.Body>
                                        </Timeline.Content>
                                    </Timeline.Item>
                                )
                            })
                        }
                    </Timeline>
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
        </BlockLayoutTwo>
    )
}

export default BlockTimeline