import ButtonOne from '../Buttons/ButtonOne'
import Icon from '../Icon'
import { getIconComponent } from '../../utils/iconMapper';

const HeroTwo = ({ content, socials, ctaLink, externalLink = false }) => {
    const { title, text, button } = content;
    const { href, text: buttonText } = button[0];

    return (
        <div className={`p-10 bg-transparent max-w-[2000px] 
        mx-auto mt-24 lg:mt-20 pb-0`} id={`hero`}>
            <div className={`text-white text-center bg-transparent w-11/12 mx-auto
            md:flex flex-col items-center justify-center md:pt-14 mt-7 lg:w-6/12`}>
                <div className={`text-black opacity-60 uppercase font-bold mb-8 
                sm:text-lg md:text-xl lg:text-2xl lg:mb-16 tracking-wider`}>
                    Blog
                </div>
                <h1 className={`text-black bg-transparent opacity-100 text-4xl mb-7 
                    font-bold lg:text-5xl xl:text-6xl tracking-tight 
                    lg:mb-9 xl:mb-10 2xl:mb-12 2xl:text-7xl 3xl:text-8xl`}>
                    {title}
                </h1>
                <div dangerouslySetInnerHTML={{ __html: text }} className={`larger_p text-dark`} />
                <ButtonOne href={ctaLink || href} text={buttonText}
                    classes={`sm:px-28`} external={externalLink} />
            </div>
            <div className={`mb-8 mt-20 -mx-10 flex items-center 
                    justify-center md:hidden bg-transparent`}>
                <span className={`w-64 block h-[1px]`} />
                <div className={`px-5 flex gap-5 
                        text-opacity-70`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, title, hideFromHeader } = social;
                            const IconComponent = getIconComponent(icon);

                            return (
                                <a key={i} href={href}
                                    className={`${hideFromHeader && `hidden`}`}
                                    rel="noreferrer nofollow"
                                    target="_blank" aria-label={title}>
                                    <Icon icon={<IconComponent className="h-6 w-6" />} size={`xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-64 block h-[1px]`} />
            </div>
            <div className={`mt-20 hidden items-center md:flex -ml-10 
            pt-28 bg-transparent justify-center`}>
                <span className={`w-screen xl:w-4/12 block bg-dark h-[1px]`} />
                <div className={`px-10 flex gap-8`}>
                    {
                        socials.map((social, i) => {
                            const { href, icon, title, hideFromHeader } = social;
                            const IconComponent = getIconComponent(icon);

                            return (
                                <a key={i} href={href}
                                    className={`${hideFromHeader && `hidden`}`}
                                    rel="noreferrer nofollow"
                                    target="_blank" aria-label={title}>
                                    <Icon icon={<IconComponent className="h-8 w-8" />} size={`2xl`} />
                                </a>
                            )
                        })
                    }
                </div>
                <span className={`w-screen xl:w-4/12 block -mr-10 bg-dark h-[1px]`} />
            </div>
        </div>
    )
}

export default HeroTwo