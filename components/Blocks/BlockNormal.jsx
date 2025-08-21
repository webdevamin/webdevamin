import Image from 'next/image';
import ButtonOne from '../Buttons/ButtonOne';
import Heading from '../Heading';
import SubHeading from '../SubHeading';

const BlockNormal = ({ content, position = 'left' }) => {
    const { title, text, subtitle, img, button, slug } = content;
    const { src, alt } = img;
    const isImageLeft = position === 'left';

    const ImageSection = () => (
        <div className={`mb-0 lg:self-start md:mb-4 md:ml-3 lg:ml-0 lg:mb-0 xl:w-full`}>
            <Heading title={title} />
            <Image src={src} priority width={836} height={483} alt={alt} className="object-contain w-full h-auto mt-4" />
        </div>
    );

    const ContentSection = () => (
        <div className={`mt-1 sm:mt-3 md:mt-8 lg:mt-20 xl:mt-32 xl:w-full lg:max-w-md xl:max-w-2xl 2xl:max-w-3xl`}>
            <article className={`mt-6 lg:ml-3`}>
                <div>
                    <SubHeading title={subtitle} />
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                </div>
                {button && button.length > 0 && (
                    <div className={`mt-8 flex flex-col sm:flex-row lg:mt-10 xl:mt-12 gap-4 sm:justify-center sm:mt-9 lg:w-full lg:gap-7 md:justify-start xl:gap-8`}>
                        {button.map((btn, index) => {
                            const { href: hrefButton, text: textButton, external = false } = btn;
                            return (
                                <ButtonOne
                                    key={index}
                                    href={hrefButton}
                                    text={textButton}
                                    classes={`w-fit px-14 sm:px-14 mt-0`}
                                    noMargin={true}
                                    external={external}
                                    outline={index % 2 !== 0}
                                />
                            );
                        })}
                    </div>
                )}
            </article>
        </div>
    );

    return (
        <div id={slug} className={`mt-24 md:mt-28 xl:mt-44`}>
            <div className={`lg:flex lg:gap-[7rem] md:text-start lg:justify-between xl:justify-evenly ${!isImageLeft ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <ImageSection />
                <ContentSection />
            </div>
        </div>
    );
}

export default BlockNormal;