import React from 'react'
import { Accordion } from "flowbite-react";
import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';
import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import ButtonThree from '../Buttons/ButtonThree';

const BlockAccordion = ({ content }) => {
    const { title, text, subtitle, position, items, buttons, layout, slug } = content;
    const { name, position: layoutPosition } = layout || {};
    const isBlockLayoutTwo = name === `block-layout-two`;
    const Layout = isBlockLayoutTwo ? BlockLayoutTwo : BlockLayoutOne;

    return (
        <Layout title={title} slug={slug} includeMaxWidth={false} textCenter={false} position={layoutPosition}>
            <div className={`4xl:pr-5 4xl:pl-12`}>
                {
                    (title && subtitle && text) && (
                        <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `4xl:justify-end 4xl:items-end 4xl:text-right` : `max-w-6xl`}`}>
                            <Heading title={title} subtitle={subtitle} />
                            <div dangerouslySetInnerHTML={{ __html: text }} className='p' />
                        </section>
                    )
                }
                <div className='mt-8 lg:mt-10 accordion w-full'>
                    <Accordion className='text-left w-full min-w-full'>
                        {
                            items.map((item, i) => {
                                const { title, shortDescription, description, detailBtn, slug } = item;
                                const text = shortDescription || description;

                                return (
                                    <Accordion.Panel key={i}>
                                        <Accordion.Title>{title}</Accordion.Title>
                                        <Accordion.Content className="w-full">
                                            {text.includes('<') ? (
                                                <div
                                                    className="mb-2 w-full"
                                                    dangerouslySetInnerHTML={{ __html: text }}
                                                />
                                            ) : (
                                                <p className="mb-2 w-full">
                                                    {text}
                                                </p>
                                            )}
                                            {detailBtn && (
                                                <div className={`mt-4`}>
                                                    <ButtonThree href={detailBtn.href}
                                                        text={detailBtn.text} />
                                                </div>
                                            )}
                                        </Accordion.Content>
                                    </Accordion.Panel>
                                )
                            })
                        }
                    </Accordion>
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
                                                text={text} outline={isOdd} noMargin
                                                classes={`sm:px-14 text-center`} />
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

export default BlockAccordion