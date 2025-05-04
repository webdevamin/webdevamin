import Image from 'next/image';
import Heading from '../Heading';
import SubHeading from '../SubHeading';
import ButtonOne from '../Buttons/ButtonOne';

const Why = ({ content }) => {
    const { title, text, subtitle, img, button } = content;
    const { src, alt } = img;

    return (
        <div id={`about`} className={`mt-20 md:mt-30 lg:mt-36 xl:mt-48`}>
            <section className={`lg:flex lg:flex-row-reverse lg:gap-[7rem] md:text-start lg:justify-between xl:justify-evenly`}>
                <div className={`mb-0 lg:self-start md:mb-4 md:ml-3 lg:ml-0 lg:mb-0`}>
                    <Heading title={title} />
                    <Image src={src} priority width={836} height={483} alt={alt} className="object-contain w-full h-auto mt-4" />
                </div>
                <div className={`mt-1 sm:mt-3 md:mt-8 lg:mt-20 xl:mt-36 xl:w-full lg:max-w-md xl:max-w-lg 2xl:max-w-xl`}>
                    <article className={`mt-6 lg:ml-3`}>
                        <div>
                            <SubHeading title={subtitle} />
                            <div dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                        <div className={`mt-8 flex-col sm:flex-row lg:mt-10 xl:mt-12 flex 
                        gap-4 sm:justify-center sm:mt-9 lg:w-full 
                        lg:gap-7 md:justify-start xl:gap-8`}>
                            {
                                button.map((btn, index) => {
                                    const { href: hrefButton, text: textButton,
                                        external = false } = btn;

                                    return (
                                        <ButtonOne href={hrefButton} text={textButton}
                                            classes={`w-fit px-14 sm:px-14 mt-0`}
                                            noMargin={true} external={external}
                                            key={index} outline={index % 2 !== 0 ? true : false} />
                                    )
                                })
                            }
                        </div>
                    </article>
                </div>
            </section>
        </div>
    )
}

export default Why