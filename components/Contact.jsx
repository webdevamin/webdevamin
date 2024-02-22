import ButtonTwo from './Buttons/ButtonTwo'
import BlockLayoutThree from './Layouts/BlockLayoutThree'
import Heading from './Heading';

const Contact = ({ content }) => {
    const { title, text, button } = content;
    const { href, text: buttonText } = button;

    return (
        <BlockLayoutThree title={`contact`}>
            <div className={`text-center max-w-2xl mx-auto`}>
                <div>
                    <Heading title={title} noSubtitle titleClasses={`text-white`} />
                    <p className={`text-white font-bold md:text-lg lg:text-2xl lg:leading-9 opacity-100`}>{text}</p>
                </div>
                <ButtonTwo href={href} text={buttonText}
                    classes={`sm:w-fit px-7 sm:px-12 md:px-20`} />
            </div>
        </BlockLayoutThree>
    )
}

export default Contact