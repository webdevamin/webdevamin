import Image from 'next/image';
import React from 'react'
import { destructureImageComponent } from '../../utils/app';
import ButtonOne from '../Buttons/ButtonOne';

const About = ({ content }) => {
    const { title, text, subtitle, img, button } = content;
    const { url, alt, objectFit, width, height } = destructureImageComponent(img);
    const splitTitle = title.split(`&`);

    return (
        <div id={`about`} className={`mt-20 md:mt-28 xl:mt-40`}>
            <section className={`lg:flex lg:flex-row-reverse 
            lg:items-center lg:gap-20 text-center md:text-start 
            lg:justify-between xl:justify-evenly`}>
                <h2 className={`mb-0 lg:self-start lg:pt-24 md:mb-4 
                xl:pt-32 2xl:pt-44 2xl:text-right md:ml-3 lg:ml-0 lg:mb-0`}>
                    {splitTitle[0]}
                    <div className={`h2 xl:mt-2 2xl:mt-3 3xl:mt-4 
                    inline-block lg:block`}>
                        &{splitTitle[1]}
                    </div>
                </h2>
                <div className={`mt-1 sm:mt-3 md:mt-2 lg:mt-0 xl:w-full 
                lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl`}>
                    <div>
                        <Image src={url} width={width} height={height}
                            objectFit={objectFit} priority
                            alt={alt} />
                    </div>
                    <article className={`mt-4 ml-3`}>
                        <div>
                            <h3>{subtitle}</h3>
                            <div dangerouslySetInnerHTML={{ __html: text }} />
                        </div>
                        <div className={`mt-8 flex-col sm:flex-row lg:mt-10 xl:mt-12 flex 
                        gap-5 sm:justify-center sm:mt-9 lg:w-full 
                        lg:gap-7 md:justify-start xl:gap-8`}>
                            {
                                button.map((btn, index) => {
                                    const { href: hrefButton, text: textButton } = btn;

                                    return (
                                        <ButtonOne href={hrefButton} text={textButton}
                                            classes={`w-full md:w-auto lg:w-auto sm:px-14 mt-0`}
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