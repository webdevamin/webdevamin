'use client';

import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';

const OneTimePayment = ({ content, align = 'left' }) => {
    if (!content) return null;

    const { title, text, button } = content;
    const isRight = align === 'right';

    return (
        <BlockLayoutOne title={title} slug={`one-time-payment`} includeMaxWidth={false} position={isRight ? 'right' : undefined}>
            <div className={isRight ? "4xl:pl-5 4xl:pr-12 w-full" : "4xl:pr-5 4xl:pl-12 w-full"}>
                <div className={isRight ? "max-w-6xl ml-auto lg:text-right" : "max-w-6xl lg:text-left"}>
                    <div>
                        <Heading title={title} noSubtitle />
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        {button?.href && button?.text && (
                            <div className={isRight ? "flex flex-col lg:gap-4 lg:flex-row lg:justify-end" : "flex flex-col lg:gap-4 lg:flex-row"}>
                                <ButtonOne href={button.href} text={button.text} classes="sm:px-14 text-center" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BlockLayoutOne>
    );
};

export default OneTimePayment;
