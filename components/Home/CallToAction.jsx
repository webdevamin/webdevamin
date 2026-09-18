import Heading from '../Heading'; // Assuming Heading component exists and is suitable
import ButtonTwo from '../Buttons/ButtonTwo';
import BlockLayoutThree from '../Layouts/BlockLayoutThree';

const CallToAction = ({ content }) => {
    if (!content) {
        return null; // Don't render if content is missing
    }

    const { title, text, button } = content;

    return (
        <div className='lg:-mt-20'>
            <BlockLayoutThree title={`cta`} bothSides>
                {/* Geen .container op gsm: BlockLayoutThree is al 10/12 breed, anders wordt de tekst te smal. */}
                <div className="mx-auto w-full max-w-8xl md:w-10/12 md:px-4 text-center
                text-white md:py-32 lg:py-48">
                    {title && <Heading title={title} noSubtitle />}
                    {text && (
                        <p className="text-lg md:text-xl mb-8 max-w-3xl 
                        mx-auto font-semibold opacity-100">
                            {text}
                        </p>
                    )}
                    {button && button.length > 0 && (
                        <div className="flex flex-col items-stretch justify-center gap-x-4 sm:flex-row sm:flex-wrap sm:items-center">
                            {button.map((item) => (
                                <ButtonTwo key={item.href} href={item.href} text={item.text}
                                    external={item.external}
                                    classes={`sm:w-fit px-7 sm:px-12 md:px-20`} />
                            ))}
                        </div>
                    )}
                </div>
            </BlockLayoutThree>
        </div>
    );
};

export default CallToAction;
