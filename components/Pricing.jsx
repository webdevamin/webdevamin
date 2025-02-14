import React from 'react'
import { Card, Popover, Tooltip } from "flowbite-react";
import ButtonThree from './Buttons/ButtonThree';
import { CheckMarkIcon, MessageCircleQuestionIcon } from './SvgIcons';

const Pricing = ({ data }) => {
    const { webdesign: { content, items } } = data;
    const { main, mid, mainTwo: { first, second }, sub, footer: { text, src } } = content;

    return (
        <Card className='rounded-2xl text-dark bg-transparent shadow-md border border-dark p-3 xl:border-opacity-20 border-opacity-30'>
            <div className="flex flex-col items-baseline text-gray-900">
                <div>
                    <span className="text-lg lg:text-xl font-semibold pr-1">€</span>
                    <span className="text-xl lg:text-3xl font-extrabold tracking-tight">{main}</span>
                </div>
                <span className={`text-lg font-medium text-gray-700 lg:my-1`}>{mid}</span>
                <div>
                    <span className="text-lg lg:text-xl font-semibold pr-1">€</span>
                    <span className="text-xl lg:text-3xl font-extrabold tracking-tight pr-2 lg:pr-3">{first}</span>
                    <span className="text-lg lg:text-xl font-semibold mt-1 lg:mt-2 text-theme_darker">{second}</span>
                </div>
                <span className="ml-1 font-normal text-gray-700 mt-1 lg:mt-2">{sub}</span>
            </div>
            <ul className="my-5 lg:my-7 space-y-5">
                {
                    items.map((item, i) => {
                        const { title, details } = item;

                        return (
                            <li key={i} className="flex justify-between gap-x-5 items-center">
                                <div className="flex space-x-3">
                                    <CheckMarkIcon />
                                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-700" dangerouslySetInnerHTML={{ __html: title }} />
                                </div>
                                <div className='md:hidden'>
                                    <Popover aria-labelledby={`?`}
                                        content={
                                            <div className="w-64 text-sm text-gray-500">
                                                <div className="px-3 py-2">
                                                    <p>{details}</p>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <button
                                            type="button"
                                            className='w-[18px] h-[18px] flex items-center justify-center'
                                            aria-label={title}
                                            role="button"
                                        >
                                            <MessageCircleQuestionIcon />
                                        </button>
                                    </Popover>
                                </div>
                                <div className='hidden md:block cursor-pointer'>
                                    <Tooltip content={details} style='light'>
                                        <MessageCircleQuestionIcon />
                                    </Tooltip>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <ButtonThree href={src} text={text} classes={`underline lg:underline-offset-4 decoration-theme_darker`} />
        </Card>
    )
}

export default Pricing