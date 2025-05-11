import Heading from '../Heading'
import { Accordion } from 'flowbite-react';
import SubHeading from '../SubHeading';
import ButtonOne from '../Buttons/ButtonOne';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';

const PricingSection = ({ content }) => {
    const { title, subtitle, subsubtitle, text, items, buttons, highlight } = content;

    return (
        <BlockLayoutOne title={title} slug={`pricing`} includeMaxWidth={false} position={`right`}>
            <section className="4xl:pl-5 4xl:pr-12 w-full">
                <div className="max-w-6xl ml-auto lg:text-right">
                    <div>
                        <Heading title={title} subtitle={subtitle} />
                        <h4 className='-mt-2 text-lg font-bold font_quicksand bg-theme 
                        text-white px-4 py-2 mb-7 inline-block uppercase 
                        md:text-xl lg:text-2xl xl:text-3xl xl:px-5 xl:py-3'>{highlight}</h4>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        <div className={`flex flex-col lg:gap-4 lg:flex-row lg:justify-end`}>
                            {
                                (buttons && buttons.length > 0) && buttons.map((btn, i) => {
                                    const { href, text } = btn;
                                    const isOdd = i % 2 !== 0 ? true : false;

                                    if (href) {
                                        return (
                                            <ButtonOne key={i} href={href}
                                                text={text} outline={isOdd} classes={`sm:px-14 text-center`} />
                                        )
                                    }
                                })
                            }
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-16">
                        <div className='text-left lg:mb-10'>
                            <SubHeading title={subsubtitle} smallerMarginB />
                        </div>
                        <section className='accordion'>
                            <Accordion className='text-left w-full min-w-full'>
                                {
                                    items.map((item, i) => {
                                        const { title, details } = item;

                                        return (
                                            <Accordion.Panel
                                                key={i}
                                                className={`transition-all duration-500 shadow-md rounded-lg border-l-4 border-theme' : 'hover:border-l-2 hover:border-theme_darker`}
                                            >
                                                <Accordion.Title as='h3'
                                                    className={`transition-all duration-300 flex items-center 'text-theme font-semibold' : 'hover:text-theme_darker`}
                                                >
                                                    <span className="transform transition-transform duration-300 inline-block mr-2">
                                                        {i + 1}.
                                                    </span>
                                                    {title}
                                                </Accordion.Title>
                                                <Accordion.Content
                                                    className={`w-full transition-all duration-500 animate-fadeIn bg-gray-50 bg-opacity-30 rounded-b-lg`}
                                                >
                                                    {details.includes('<') ? (
                                                        <div
                                                            className="mb-2 w-full"
                                                            dangerouslySetInnerHTML={{ __html: details }}
                                                        />
                                                    ) : (
                                                        <p className="mb-2 w-full leading-relaxed">
                                                            {details}
                                                        </p>
                                                    )}
                                                </Accordion.Content>
                                            </Accordion.Panel>
                                        )
                                    })
                                }
                            </Accordion>
                        </section>
                    </div>
                </div>
            </section>
        </BlockLayoutOne>
    );
};

export default PricingSection;