import React from 'react'
import ButtonOne from '../Buttons/ButtonOne'
import Icon from '../Icon'
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

const HeroTwo = ({ content, socials, ctaLink, externalLink = false }) => {
    const { title, text, button } = content;
    const { href, text: buttonText } = button[0];

    return (
        <section className={`p-10 bg-transparent max-w-[2000px] 
        mx-auto mt-24 lg:mt-20 pb-0`} id={`hero`}>
            <div className={`text-white text-center bg-transparent w-11/12 mx-auto
            md:flex flex-col items-center justify-center md:pt-14 mt-7 lg:w-6/12`}>
                <div className={`opacity-60 uppercase font-bold mb-8 
                sm:text-lg md:text-xl lg:text-2xl lg:mb-16 tracking-wider`}>
                    Blog
                </div>
                <h1 className={`bg-transparent opacity-100 text-4xl mb-7 
                    font-bold lg:text-5xl xl:text-6xl tracking-tight 
                    lg:mb-9 xl:mb-10 2xl:mb-12 2xl:text-7xl 3xl:text-8xl`}>
                    {title}
                </h1>
                <div dangerouslySetInnerHTML={{ __html: text }} className={`larger_p`} />
                <ButtonOne href={ctaLink || href} text={buttonText}
                    classes={`sm:px-28`} external={externalLink} />
            </div>
            <div className={`mb-8 mt-20 -mx-10 flex items-center 
                    justify-center md:hidden bg-transparent`}>
                <span className={`w-64 block bg-theme h-[1px]`} />
                <div className={`px-5 text-theme flex gap-5 
                        text-opacity-70`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, hideFromHeader } = social
                            const { name, brands } = icon;
                            const iconRef = brands ? fab[name] : fas[name];

                            return (
                                <a key={i} href={href} rel="noreferrer nofollow"
                                    className={`${hideFromHeader && `hidden`}`}
                                    target="_blank">
                                    <Icon icon={iconRef} size={`xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-64 block bg-theme h-[1px]`} />
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
            pt-28 bg-transparent justify-center`}>
                <span className={`w-screen xl:w-4/12 block bg-dark h-[1px]`} />
                <div className={`px-10 text-theme flex gap-8`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, hideFromHeader } = social
                            const { name, brands } = icon;
                            const iconRef = brands ? fab[name] : fas[name];

                            return (
                                <a key={i} href={href} rel="noreferrer nofollow"
                                    className={`${hideFromHeader && `hidden`}`}
                                    target="_blank">
                                    <Icon icon={iconRef} size={`2xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-screen xl:w-4/12 block -mr-10 bg-dark h-[1px]`} />
            </div>
        </section>
    )
}

export default HeroTwo