'use client';

import Heading from '../Heading';
import ButtonOne from '../Buttons/ButtonOne';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';

const OneTimePayment = ({ content }) => {
    if (!content) return null;

    const { title, text, button } = content;

    return (
        <BlockLayoutOne title={title} slug={`one-time-payment`} includeMaxWidth={false} position={`right`}>
            <div className="4xl:pl-5 4xl:pr-12 w-full">
                <div className="max-w-6xl ml-auto lg:text-right">
                    <div>
                        <Heading title={title} noSubtitle />
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        {button?.href && button?.text && (
                            <div className="flex flex-col lg:gap-4 lg:flex-row lg:justify-end">
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
