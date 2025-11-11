import ButtonOne from '../Buttons/ButtonOne'
import ButtonThree from '../Buttons/ButtonThree'
import { getJsonString, } from '../../utils/app';
import { getIconComponent } from '../../utils/iconMapper';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const Hero = ({ content, socials, locale }) => {
    const { title, subtitle, text, button, img, types, extra } = content;
    const { src, alt } = img;

    const parsedTitle = getJsonString(title);

    return (
        <div className={`p-10 bg-transparent max-w-[2250px] mx-auto mt-20 pb-0 xl:py-16`} id={`hero`}>
            <div className={`text-center bg-transparent md:flex md:flex-row-reverse md:justify-evenly md:items-center md:text-left md:px-12 md:gap-16 lg:px-24 xl:px-40 2xl:px-50 md:pt-14`}>
                <div className={`p-5 lg:p-0`}>
                    <Image src={src} width={524} height={381} className={`rounded-lg`} priority={true} alt={alt} style={{ objectFit: 'cover' }} />
                </div>
                <div className={`mt-7 md:w-6/12 bg-transparent`}>
                    {subtitle ? (
                        <div className='flex flex-col lg:mb-3'>
                            <h1 className='order-2 text-lg sm:text-xl font-semibold lg:text-2xl xl:text-3xl uppercase font_quicksand text-theme_darker'>
                                {parsedTitle}
                            </h1>
                            <span className='order-1 text-5xl mb-2 lg:mb-4 font-bold md:text-6xl xl:text-7xl tracking-tight 2xl:text-8xl font_mohave'>{subtitle}</span>
                        </div>
                    ) : (
                        <h1 className='bg-transparent opacity-100 xl:mb-7 font_mohave'>
                            {parsedTitle}
                        </h1>
                    )}
                    <div className={`mb-8 -mx-10 flex items-center 
                justify-center md:hidden bg-transparent`}>
                        <span className={`w-64 block bg-dark h-[1px]`} />
                        <div className={`px-5 flex gap-5 text-opacity-70`}>
                            {
                                socials.map((social, index) => {
                                    const { href, icon, title, hideFromHeader } = social;
                                    const name = typeof icon === 'string' ? icon : (icon?.name || 'globe');

                                    const IconComponent = getIconComponent(name);


                                    return (
                                        <a key={index} href={href} rel="noreferrer"
                                            target="_blank" aria-label={title}
                                            className={`${hideFromHeader && `hidden`}`}>
                                            <IconComponent className="h-6 w-6" />
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
                    <p className={`${!extra || extra === '' ? 'hidden' : 'larger_p'}`}>{extra}</p>
                    <Marquee gradient={false} className={`mt-3 max-w-2xl marque 
                    lg:mt-5 lg:mb-10 py-3`} pauseOnHover>
                        {
                            types.map((type, i) => {
                                return (
                                    <span key={i} className={`font-medium rounded-xl 
                                    px-5 py-1 mr-4 my-1 text-dark bg-light 
                                    shadow-[2px_2px_4px_#d4d4d4,-2px_-2px_4px_#ffffff]`}>
                                        {type}
                                    </span>
                                )
                            })
                        }
                    </Marquee>
                    <div className={`flex flex-col gap-4 lg:flex-row mt-7 lg:mt-10`}>
                        {locale === 'nl' ? (
                            <>
                                {/* Primary CTA: Gratis offerte (keep as is) */}
                                {button.filter(b => b.href !== '#pricing').slice(0,1).map((btn, i) => (
                                    <ButtonOne key={`primary-${i}`} href={btn.href} text={btn.text}
                                        outline={false} noMargin classes={`sm:px-14 md:text-center`} />
                                ))}

                                {/* Secondary CTA: Bel direct styled like second button */}
                                <ButtonOne
                                    href={`tel:+32470930916`}
                                    text={`Bel direct`}
                                    outline={true}
                                    noMargin
                                    classes={`sm:px-14 md:text-center`}
                                />
                            </>
                        ) : (
                            // Default (EN): keep existing two buttons as ButtonOne
                            <>
                                {button.map((btn, i) => {
                                    const { href, text } = btn;
                                    const isOdd = i % 2 !== 0;
                                    return (
                                        <ButtonOne key={i} href={href} text={text}
                                            outline={isOdd} noMargin classes={`sm:px-14 md:text-center`} />
                                    )
                                })}
                            </>
                        )}
                    </div>
                    {locale === 'nl' && (
                        <div className="mt-7 md:mt-10 ml-1.5">
                            {button.filter(b => b.href === '#pricing').map((btn, i) => (
                                <ButtonThree key={`pricing-${i}`} href={btn.href} text={btn.text} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
        pt-28 bg-transparent`}>
                <span className={`w-64 block bg-dark h-[1px]`} />
                <div className={`px-10 flex gap-8`}>
                    {
                        socials.map((social, index) => {
                            const { href, icon, title, hideFromHeader } = social;
                            const name = typeof icon === 'string' ? icon : (icon?.name || 'globe');

                            const IconComponent = getIconComponent(name);

                            return (
                                <a key={index} href={href} rel="noreferrer"
                                    target="_blank" aria-label={title}
                                    className={`${hideFromHeader && `hidden`}`}>
                                    <IconComponent className="h-8 w-8" />
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

export default Hero