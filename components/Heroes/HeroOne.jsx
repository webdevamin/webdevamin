import React from 'react'
import ButtonOne from '../Buttons/ButtonOne'
import Icon from '../Icon'
import { getJsonString, } from '../../utils/app';
import { Facebook, Twitter, Linkedin, Instagram, Github, Youtube, Globe, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';

const HeroOne = ({ content, socials = null, ctaLink, externalLink = false,
    smallerTitle }) => {
    const { title, text, button, image } = content;
    const { src: url, objectFit, width, height, alt, disableImgSpace = false } = image;
    const parsedTitle = getJsonString(title);

    return (
        <div className={`p-10 bg-transparent max-w-[2250px] 
        mx-auto mt-20 pb-0`} id={`hero`}>
            <div className={`text-center bg-transparent
            md:flex md:flex-row-reverse md:justify-evenly 
            md:items-center md:text-left md:px-12 md:gap-16 lg:px-24 
            xl:px-40 2xl:px-50 md:pt-14`}>
                <div className={`flex items-center justify-center ${disableImgSpace ? `p-0 -mx-5` : `p-5 lg:p-0`}`}>
                    <div className="relative max-w-[500px] mx-auto">
                        <Image
                            src={url}
                            priority={true}
                            width={width}
                            height={height}
                            alt={alt}
                            className="rounded-lg h-auto"
                            style={{ objectFit: objectFit }}
                        />
                    </div>
                </div>
                <div className={`mt-7 md:w-6/12 bg-transparent`}>
                    <h1 className={`bg-transparent opacity-100 
                    ${smallerTitle && `text-3xl mb-8 
                    font-bold lg:text-4xl xl:text-5xl tracking-tight 
                    2xl:text-6xl md:mb-5`}`}>
                        {
                            (Array.isArray(parsedTitle)) ? (
                                <TypeAnimation
                                    sequence={parsedTitle}
                                    wrapper="div"
                                    className='font_mohave'
                                    cursor={true}
                                    speed={60}
                                />
                            ) : (parsedTitle)
                        }
                    </h1>
                    <div className={`mb-8 -mx-10 flex items-center 
                    justify-center md:hidden bg-transparent`}>
                        <span className={`w-64 block bg-dark h-[1px]`} />
                        <div className={`px-5 flex gap-5 text-opacity-70`}>
                            {
                                socials.map((social, i) => {
                                    const { href, icon, title, hideFromHeader } =
                                        social;
                                    const { name } = icon;
                                    
                                    const getIconComponent = (iconName) => {
                                        const iconMap = {
                                            'facebook': Facebook,
                                            'twitter': Twitter,
                                            'linkedin': Linkedin,
                                            'instagram': Instagram,
                                            'github': Github,
                                            'youtube': Youtube,
                                            'globe': Globe,
                                            'mail': Mail,
                                            'phone': Phone,
                                            'map-pin': MapPin,
                                            'external-link': ExternalLink
                                        };
                                        return iconMap[iconName] || Globe;
                                    };

                                    return (
                                        <a key={i} href={href}
                                            className={`${hideFromHeader && `hidden`}`}
                                            rel="noreferrer nofollow"
                                            target="_blank" aria-label={title}>
                                            <Icon icon={React.createElement(getIconComponent(name), { className: "h-6 w-6" })} size={`xl`} />
                                        </a>
                                    )
                                })
                            }
                        </div>
                        <span className={`w-64 block bg-dark h-[1px]`} />
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
                    <div className={`flex flex-col gap-4 lg:flex-row mt-8 lg:mt-10`}>
                        {
                            button.map((btn, i) => {
                                const { href, text } = btn;
                                const isOdd = i % 2 !== 0 ? true : false;

                                if (href) {
                                    return (
                                        <ButtonOne key={i} href={ctaLink || href}
                                            text={text} outline={isOdd} noMargin
                                            external={externalLink}
                                            classes={`sm:px-14 md:text-center`} />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
            pt-28 bg-transparent`}>
                <span className={`w-64 block bg-dark h-[1px]`} />
                <div className={`px-10 flex gap-8`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, title, hideFromHeader } = social;
                            const { name } = icon;
                            
                            const getIconComponent = (iconName) => {
                                const iconMap = {
                                    'facebook': Facebook,
                                    'twitter': Twitter,
                                    'linkedin': Linkedin,
                                    'instagram': Instagram,
                                    'github': Github,
                                    'youtube': Youtube,
                                    'globe': Globe,
                                    'mail': Mail,
                                    'phone': Phone,
                                    'map-pin': MapPin,
                                    'external-link': ExternalLink
                                };
                                return iconMap[iconName] || Globe;
                            };

                            return (
                                <a key={i} href={href}
                                    className={`${hideFromHeader && `hidden`}`}
                                    rel="noreferrer nofollow"
                                    target="_blank" aria-label={title}>
                                    <Icon icon={React.createElement(getIconComponent(name), { className: "h-8 w-8" })} size={`2xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-64 block -mr-10 bg-dark h-[1px]`} />
            </div>
        </div>
    )
}

export default HeroOne