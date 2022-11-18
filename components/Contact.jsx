import React from 'react'
import { destructureSingleType } from '../utils/app';
import ButtonTwo from './Buttons/ButtonTwo'
import BlockLayoutThree from './Layouts/BlockLayoutThree'

const Contact = ({ content }) => {
    const { title, text, button } = destructureSingleType(content);
    const { href, text: buttonText } = button;

    return (
        <BlockLayoutThree title={`contact`}>
            <div className={`text-center max-w-2xl mx-auto`}>
                <div>
                    <h2 className={`text-white`}>
                        {title}
                    </h2>
                    <div className={`text_lg_white_semibold`}
                        dangerouslySetInnerHTML={{ __html: text }} />
                </div>
                <ButtonTwo href={href} text={buttonText}
                    classes={`sm:w-fit px-7 sm:px-12 md:px-20`} />
            </div>
        </BlockLayoutThree>
    )
}

export default Contact