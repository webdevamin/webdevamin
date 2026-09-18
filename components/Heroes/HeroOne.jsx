import ButtonOne from '../Buttons/ButtonOne'
import ButtonThree from '../Buttons/ButtonThree'
import Icon from '../Icon'
import { getJsonString, } from '../../utils/app';
import { getIconComponent } from '../../utils/iconMapper';
import Image from 'next/image';
import HeroTitleAnimation from './HeroTitleAnimation';
import Breadcrumbs from '../SEO/Breadcrumbs';

const HeroOne = ({ content, socials = null, ctaLink, externalLink = false,
    smallerTitle, imageMaxWidth = 'max-w-[600px]', breadcrumbItems, breadcrumbLocale }) => {
    const { title, text, button, image } = content;
    const { src: url, objectFit, width, height, alt, disableImgSpace = false } = image;
    const parsedTitle = getJsonString(title);

    const mainButtons = button.filter(b => !b.external || b.prominent).slice(0, 2);
    const linkButtons = button.filter(b => b.external && !b.prominent);
    const hasProminentContact = mainButtons.some(b => b.prominent);

    return (
        <div className={`p-10 bg-transparent max-w-[2250px] 
        mx-auto mt-20 pb-0`} id={`hero`}>
            <div className={`text-center bg-transparent md:grid md:grid-cols-2
            md:items-center md:text-left md:px-12 md:gap-x-16 lg:px-24
            xl:px-40 2xl:px-50 ${breadcrumbItems?.length ? 'md:pt-6' : 'md:pt-14'}`}>
                {breadcrumbItems?.length > 0 && (
                    <Breadcrumbs items={breadcrumbItems} locale={breadcrumbLocale} className="mb-6 md:col-start-1 md:mb-0" />
                )}
                <div className={`flex items-center justify-center md:col-start-2 md:row-span-2 ${disableImgSpace ? `p-0 -mx-5` : `p-5 lg:p-0`}`}>
                    <div className={`relative ${imageMaxWidth} mx-auto`}>
                        <Image
                            src={url}
                            priority={true}
                            width={width}
                            height={height}
                            alt={alt}
                            className="rounded-lg h-auto"
                            style={{ objectFit: objectFit }}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 600px"
                        />
                    </div>
                </div>
                <div className={`mt-7 md:col-start-1 md:mt-14 bg-transparent`}>
                    <h1 className={`bg-transparent opacity-100 
                    ${smallerTitle && `text-3xl mb-8 
                    font-bold lg:text-4xl xl:text-5xl tracking-tight 
                    2xl:text-6xl md:mb-5`}`}>
                        {
                            (Array.isArray(parsedTitle)) ? (
                                <HeroTitleAnimation sequence={parsedTitle} />
                            ) : (parsedTitle)
                        }
                    </h1>
                    <div className={`mb-8 -mx-10 flex items-center 
                    justify-center md:hidden bg-transparent`}>
                        <span className={`flex-1 border-t-[0.5px] border-dark`} />
                        <div className={`px-5 flex gap-5 text-opacity-70`}>
                            {
                                socials.map((social, i) => {
                                    const { href, icon, title, hideFromHeader } = social;
                                    const IconComponent = getIconComponent(icon);

                                    return (
                                        <a key={i} href={href}
                                            className={`${hideFromHeader && `hidden`}`}
                                            rel="noopener noreferrer nofollow"
                                            target="_blank" aria-label={title}>
                                            <Icon icon={<IconComponent className="h-6 w-6" />} size={`xl`} />
                                        </a>
                                    )
                                })
                            }
                        </div>
                        <span className={`flex-1 border-t-[0.5px] border-dark`} />
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
                    <div className={`flex flex-col gap-4 ${hasProminentContact ? '2xl:flex-row' : 'lg:flex-row'} mt-8 lg:mt-10`}>
                        {
                            mainButtons.map((btn, i) => {
                                const { href, text, external = false } = btn;
                                const isOdd = i % 2 !== 0 ? true : false;

                                if (href) {
                                    return (
                                        <ButtonOne key={i} href={ctaLink || href}
                                            text={text} outline={isOdd} noMargin
                                            external={externalLink || external}
                                            classes={`${hasProminentContact ? 'sm:px-6' : 'sm:px-14'} md:text-center`} />
                                    )
                                }
                            })
                        }
                    </div>
                    {linkButtons.length > 0 && (
                        <div className="mt-5 md:mt-7 ml-1.5 flex flex-col gap-2">
                            {linkButtons.map((btn, i) => (
                                <ButtonThree key={`link-${i}`} href={btn.href} text={btn.text} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
            pt-28 bg-transparent`}>
                <div className={`pl-[18.5rem] pb-6 flex gap-8`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, title, hideFromHeader } = social;
                            const IconComponent = getIconComponent(icon);

                            return (
                                <a key={i} href={href}
                                    className={`${hideFromHeader && `hidden`}`}
                                    rel="noopener noreferrer nofollow"
                                    target="_blank" aria-label={title}>
                                    <Icon icon={<IconComponent className="h-8 w-8" />} size={`2xl`} />
                                </a>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default HeroOne
