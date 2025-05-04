import { Accordion } from "flowbite-react";
import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import ButtonThree from '../Buttons/ButtonThree';

const BlockAccordion = ({ content, center = false }) => {
    const { title, text, subtitle, position, items, buttons, layout, slug } = content;
    const { name, position: layoutPosition } = layout || {};

    return (
        <BlockLayoutOne title={title} slug={slug} includeMaxWidth={false} position={layoutPosition}>
            <div className={`4xl:pr-5 4xl:pl-12`}>
                {
                    (title && subtitle && text) && (
                        <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `4xl:justify-end 4xl:items-end 4xl:text-right` : `max-w-6xl`}`}>
                            <Heading title={title} subtitle={subtitle} />
                            <div
                                dangerouslySetInnerHTML={{ __html: text }}
                                className={`p transition-all duration-300 ${center ? `xl:text-center` : `max-w-3xl`}`}
                            />
                        </section>
                    )
                }
                <div className='mt-8 lg:mt-10 accordion w-full max-w-6xl'>
                    <Accordion className='text-left w-full min-w-full'>
                        {
                            items.map((item, i) => {
                                const { title, shortDescription, description, detailBtn } = item;
                                const text = shortDescription || description;

                                return (
                                    <Accordion.Panel
                                        key={i}
                                        className={`transition-all duration-500 shadow-md rounded-lg border-l-4 border-theme hover:border-l-2 hover:border-theme_darker`}
                                    >
                                        <Accordion.Title as="h3" className={`transition-all duration-300 flex items-center text-theme font-semibold hover:text-theme_darker`}
                                        >
                                            <span className="transform transition-transform duration-300 inline-block mr-2">
                                                {i + 1}.
                                            </span>
                                            {title}
                                        </Accordion.Title>
                                        <Accordion.Content
                                            className={`w-full transition-all duration-500 animate-fadeIn bg-gray-50 bg-opacity-30 rounded-b-lg`}
                                        >
                                            {text.includes('<') ? (
                                                <div
                                                    className="mb-2 w-full"
                                                    dangerouslySetInnerHTML={{ __html: text }}
                                                />
                                            ) : (
                                                <p className="mb-2 w-full leading-relaxed">
                                                    {text}
                                                </p>
                                            )}
                                            {detailBtn && (
                                                <div className={`mt-4 transition-all duration-300 hover:translate-x-1`}>
                                                    <ButtonThree
                                                        href={detailBtn.href}
                                                        text={detailBtn.text}
                                                    />
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
                        <div className={`flex flex-col gap-4 lg:flex-row mt-8 lg:mt-12 l:gap-6 max-w-6xl`}>
                            {
                                buttons.map((btn, i) => {
                                    const { href, text } = btn;
                                    const isOdd = i % 2 !== 0 ? true : false;

                                    if (href) {
                                        return (
                                            <ButtonOne key={i} href={href}
                                                text={text} outline={isOdd} noMargin
                                                classes={`sm:px-14 text-center transition-all duration-300 hover:scale-105`} />
                                        )
                                    }
                                    return null;
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