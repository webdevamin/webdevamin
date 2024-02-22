import Image from 'next/image';
import ButtonOne from '../Buttons/ButtonOne';
import Heading from '../Heading';

const About = ({ content }) => {
    const { title, text, subtitle, img, button } = content;
    const { src, alt } = img;
    const splitTitle = title.split(`&`);

    return (
        <div id={`about`} className={`mt-20 md:mt-28 xl:mt-40`}>
            <section className={`lg:flex lg:flex-row-reverse 
            lg:items-center lg:gap-20 text-center md:text-start 
            lg:justify-between xl:justify-evenly`}>
                <div className={`mb-0 lg:self-start lg:pt-24 md:mb-4 
                xl:pt-32 2xl:pt-44 2xl:text-right md:ml-3 lg:ml-0 lg:mb-0`}>
                    <Heading split={[splitTitle[0], splitTitle[1]]} />
                    <div className={`hidden lg:flex gap-x-5 gap-y-3 mt-6 
                    justify-center md:justify-start 2xl:justify-end 
                    flex-wrap 2xl:mt-10 2xl:gap-x-6 2xl:gap-y-3`}>
                        <Image src={`https://bucket.webdevamin.com/nextjs.svg`} width={70} height={70} alt={`Next.js logo`} />
                        <Image src={`https://bucket.webdevamin.com/nodejs.svg`} width={70} height={70} alt={`Node.js logo`} />
                        <Image src={`https://bucket.webdevamin.com/laravel.svg`} width={70} height={70} alt={`Laravel logo`} />
                        <Image src={`https://bucket.webdevamin.com/wordpress.svg`} width={70} height={70} alt={`Wordpress logo`} />
                    </div>
                </div>
                <div className={`mt-1 sm:mt-3 md:mt-2 lg:mt-0 xl:w-full 
                lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl`}>
                    <div>
                        <Image src={src} priority={true} width={836} height={483} alt={alt} style={{ objectFit: "contain" }} />
                    </div>
                    <article className={`mt-4 ml-3`}>
                        <div>
                            <h3>{subtitle}</h3>
                            <div className={`flex lg:hidden gap-x-4 gap-y-2 mt-5 
                            lg:mt-10 justify-center md:justify-start 
                            mb-4 sm:mb-6 flex-wrap`}>
                                <Image src={`https://bucket.webdevamin.com/nextjs.svg`} width={30} height={30} alt={`Next.js logo`} />
                                <Image src={`https://bucket.webdevamin.com/nodejs.svg`} width={30} height={30} alt={`Node.js logo`} />
                                <Image src={`https://bucket.webdevamin.com/laravel.svg`} width={30} height={30} alt={`Laravel logo`} />
                                <Image src={`https://bucket.webdevamin.com/wordpress.svg`} width={30} height={30} alt={`Wordpress logo`} />
                            </div>
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
                                            classes={`w-full md:w-auto lg:w-auto sm:px-14 mt-0`}
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

export default About