import React from 'react'
import { Accordion } from "flowbite-react";
import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import ButtonThree from '../Buttons/ButtonThree';

const BlockAccordion = ({ content }) => {
    const { title, text, subtitle, position, items, buttons } = content;

    return (
        <BlockLayoutOne title={title} includeMaxWidth={false} textCenter={false}>
            <div className={`4xl:pr-5 4xl:pl-12`}>
                {
                    (title && subtitle && text) && (
                        <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `4xl:justify-end 4xl:items-end 4xl:text-right` : `max-w-6xl`}`}>
                            <Heading title={title} subtitle={subtitle} />
                            <div dangerouslySetInnerHTML={{ __html: text }} className='p' />
                        </section>
                    )
                }
                <div className='mt-8 lg:mt-10 accordion'>
                    <Accordion className='text-left'>
                        {
                            items.map((item, i) => {
                                const { title, shortDescription, description, detailBtn, slug } = item;
                                const text = shortDescription || description;
                                console.log(detailBtn);
                                return (
                                    <Accordion.Panel key={i}>
                                        <Accordion.Title>{title}</Accordion.Title>
                                        <Accordion.Content>
                                            {text.includes('<') ? (
                                                <div
                                                    className="mb-2 text-gray-500 dark:text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: text }}
                                                />
                                            ) : (
                                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                                    {text}
                                                </p>
                                            )}
                                            {detailBtn && (
                                                <div className={`mt-4`}>
                                                    <ButtonThree href={detailBtn.href} text={detailBtn.text} />
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
                                                text={text} outline={isOdd} noMargin classes={`sm:px-14 text-center`} />
                                        )
                                    }
                                })
                            }
                        </div>
                    )
                }
            </div>
        </BlockLayoutOne>
    )
}

export default BlockAccordion