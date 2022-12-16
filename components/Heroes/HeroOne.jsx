import React from 'react'
import ButtonOne from '../Buttons/ButtonOne'
import Icon from '../Icon'
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent
} from '../../utils/app';
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import Breadcrumbs from '../Breadcrumbs';

const HeroOne = ({ content, socialsRaw, ctaLink, externalLink = false,
    smallerTitle, disableImgSpace, breadcrumbs }) => {
    const socials = socialsRaw ? destructureCollectionType(socialsRaw) : null;
    const { title, text, button, img } = content;
    const { href, text: buttonText } = button[0];
    const { url, objectFit, width, height, alt } = destructureImageComponent(img);

    return (
        <div className={`p-10 bg-transparent max-w-[2250px] 
        mx-auto mt-20 pb-0`} id={`hero`}>
            <div className={`text-white text-center bg-transparent
            md:flex md:flex-row-reverse md:justify-evenly 
            md:items-center md:text-left md:px-12 md:gap-16 lg:px-24 
            xl:px-40 2xl:px-50 md:pt-14`}>
                <div className={disableImgSpace ? `p-0 -mx-5` : `p-5 lg:p-0`}>
                    <Image src={url} width={width} height={height} priority
                        alt={alt} objectFit={objectFit} className={`rounded-lg`} />
                </div>
                <section className={`mt-7 md:w-6/12 bg-transparent`}>
                    <h1 className={`bg-transparent opacity-100 
                    ${smallerTitle && `text-3xl mb-8 
                    font-bold lg:text-4xl xl:text-5xl tracking-tight 
                    2xl:text-6xl`}`}>
                        {title}
                    </h1>
                    <div className={`mb-8 -mx-10 flex items-center 
                    justify-center md:hidden bg-transparent`}>
                        <span className={`w-64 block bg-theme h-[1px]`} />
                        <div className={`px-5 text-theme flex gap-5 text-opacity-70`}>
                            {
                                socials.map((social, index) => {
                                    const { href, icon, title } =
                                        destructureCollectionTypeObject(social);
                                    const { name, brands } = icon;
                                    const iconRef = brands ? fab[name] : fas[name];

                                    return (
                                        <a key={index} href={href} rel="noreferrer"
                                            target="_blank" aria-label={title}>
                                            <Icon icon={iconRef} size={`xl`} />
                                        </a>
                                    )
                                })
                            }
                        </div>
                        <span className={`w-64 block bg-theme h-[1px]`} />
                    </div>
                    {
                        (text.startsWith(`<`) && text.endsWith(`>`)) ? (
                            <div className={`larger_p`}
                                dangerouslySetInnerHTML={{ __html: text }} />
                        ) : (
                            <div className={`larger_p`}>
                                <p>{text}</p>
                            </div>
                        )
                    }
                    <ButtonOne href={ctaLink || href} text={buttonText}
                        classes={`sm:px-20 mt-8`} external={externalLink} />
                </section>
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
            pt-28 bg-transparent`}>
                <span className={`w-64 block bg-dark h-[1px]`} />
                <div className={`px-10 text-theme flex gap-8`}>
                    {
                        socials.map((social, index) => {
                            const { href, icon, title } =
                                destructureCollectionTypeObject(social);
                            const { name, brands } = icon;
                            const iconRef = brands ? fab[name] : fas[name];

                            return (
                                <a key={index} href={href} rel="noreferrer"
                                    target="_blank" aria-label={title}>
                                    <Icon icon={iconRef} size={`2xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-64 block -mr-10 bg-dark h-[1px]`} />
            </div>
            {
                breadcrumbs && (
                    <div className={`mt-12 md:mt-16 lg:mt-28 
                    -mb-6 md:-mb-16 xl:-mb-30`}>
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                )
            }
        </div>
    )
}

export default HeroOne