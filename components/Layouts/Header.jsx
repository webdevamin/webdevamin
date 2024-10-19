import Image from 'next/image';
import Link from 'next/link'
import { Alert } from "flowbite-react";
import useStore from '../../utils/store';
import { useState } from 'react';
import Icon from '../Icon';
import { fas } from "@fortawesome/free-solid-svg-icons";

const Header = ({ pages, alternateLangs, locales, heroBannerData }) => {
    const nonHiddenPages = pages.filter(p => !p.hideFromHeader);
    const { content } = heroBannerData || {};

    const [active, setActive] = useState(false);
    const isAlertVisible = useStore((state) => state.isAlertVisible);
    const hideAlert = useStore((state) => state.hideAlert);

    const InfoIcon = () => {
        return <Icon icon={fas[`faCircleInfo`]} size={`lg`} />
    }

    const handleClick = () => setActive(!active);

    console.log(content)
    return (
        <header className={`fixed w-full top-0 z-50 bg-light`}>
            <div className={`text-center m-1.5 md:m-3 ${(!isAlertVisible || !content) && `hidden`}`}>
                <Alert onDismiss={hideAlert} icon={InfoIcon}>
                    <span className='ml-3 font-medium' dangerouslySetInnerHTML={{ __html: content }}>
                    </span>
                </Alert>
            </div>
            <div className={`py-3 lg:py-5 px-5 lg:px-20 
        flex justify-between items-center`}>
                <Link href={`/`}>
                    <Image
                        src={`/images/logo-light.png`} width={48} height={48}
                        className={`rounded-lg`} priority={true} alt={`Logo`}
                    />
                </Link>
                <nav className={`text-white text-lg tracking-widest flex 
            gap-4 lg:gap-5 xl:gap-20 relative items-center bg-transparent`}>
                    <div className={`block xl:hidden`}>
                        <input className={`menu-btn hidden`}
                            type="checkbox" id="menu-btn" onClick={handleClick} />
                        <label className={`relative select-none cursor-pointer 
                    flex justify-center items-center rounded-xl
                    w-11 h-11 p-2.5 pb-[11px] border border-dark`}
                            htmlFor="menu-btn">
                            <span className={`bg-dark h-[1.75px] relative 
                        transition-all w-6 after:bg-dark after:block 
                        after:h-full after:absolute after:transition-all 
                        after:w-full ${active ? `rotate-45 after:-rotate-90 
                        after:top-[0.5px] bottom-[0px]`
                                    : `after:top-[8px] bottom-[2.5px]`}`} />
                        </label>
                    </div>
                    <ul className={`absolute bg-light top-16 right-0 w-64 text-base
                shadow-2xl xl:shadow-none rounded-lg transition-all ease-linear z-50 max-h-min
                xl:static xl:flex xl:rounded-none xl:w-auto xl:gap-14 
                items-center ${active ? `max-h-96` : `max-h-0`}`}>
                        {
                            nonHiddenPages.map((page, i) => {
                                const { href, title } = page;
                                const isLast = i === nonHiddenPages.length - 1;

                                return (
                                    <li key={i} className={`bg-transparent z-50 ${href == '/policy' && `hidden`}`}>
                                        <Link href={href} className={`w-full transition-all xl:block
                                        py-3 px-8 xl:py-0 xl:px-0 border-theme 
                                        ease-linear xl:border-none relative 
                                        hover:text-theme font-semibold bg-transparent
                                        ${active ? `block` : `hidden`}
                                        ${isLast ? `border-none` : `border-b`}`}>
                                            {title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <ul className={`flex items-center bg-transparent`}>
                        {
                            alternateLangs.map((alternateLang, i) => {
                                const { href, locale } = alternateLang;

                                const localeLink = locales.find((loc) => {
                                    return loc.lang == locale;
                                })

                                const { flag, alt } = localeLink;

                                return (
                                    <li key={i}>
                                        <Link href={href} locale={locale} className={`p-3 relative before:ease-linear 
                                    uppercase sm:p-4 before:absolute 
                                    before:top-0 before:left-0 transition-all 
                                    ease-linear hover:shadow-zero before:origin-left
                                    before:bottom-0 before:right-0 
                                    before:-z-10 before:transition-all
                                    before:scale-x-0 hover:before:scale-x-100 z-10 
                                    text-sm sm:text-base w-[42px] h-[42px] 
                                    sm:px-4 font-semibold tracking-wide drop-shadow-2xl 
                                    flex justify-center items-center sm:flex mt-0`}>
                                            <Image
                                                src={flag} fill={true} alt={alt}
                                                style={{ objectFit: `contain` }}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header