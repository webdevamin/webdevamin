import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'
import { destructureImageComponent, destructureSingleType, 
    destructureCollectionType, destructureCollectionTypeObject } from '../../utils/app';

const Header = ({ pages, localepages }) => {
    const [active, setActive] = useState(false);
    const links = destructureCollectionType(pages)
    const handleClick = () => setActive(!active);

    return (
        <header className={`py-3 lg:py-5 px-5 lg:px-20 
        flex justify-between items-center fixed w-full top-0 z-50 bg-light`}>
            <Image src={`/images/logo-dark.png`} width={55} height={55}
                alt={`Logo`} />
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
                        links.map((link, index) => {
                            const { href, title } = destructureCollectionTypeObject(link);
                            const isLast = index === links.length - 1;

                            return (
                                <li key={index} className={`bg-transparent z-50`}>
                                    <Link href={href}>
                                        <a className={`w-full transition-all xl:block
                                        py-3 px-8 xl:py-0 xl:px-0 border-theme 
                                        ease-linear xl:border-none relative 
                                        hover:text-theme font-semibold bg-transparent
                                        ${active ? `block` : `hidden`}
                                        ${isLast ? `border-none` : `border-b`}`}>
                                            {title}
                                        </a>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className={`flex items-center bg-transparent`}>
                    {
                        localepages.map((localepage, i) => {
                            const { locale_link, href, locale } = localepage;
                            const { name, flag } = destructureSingleType(locale_link);
                            const { url } = destructureImageComponent(flag);
                            return (
                                <li key={i}>
                                    <Link href={href} locale={locale}>
                                        <a className={`p-3 relative before:ease-linear 
                                    uppercase sm:p-4 before:absolute 
                                    before:top-0 before:left-0 transition-all 
                                    ease-linear hover:shadow-zero before:origin-left
                                    before:bottom-0 before:right-0 
                                    before:-z-10 before:transition-all
                                    before:scale-x-0 hover:before:scale-x-100 z-10 
                                    text-sm sm:text-base w-[42px] h-[42px] 
                                    sm:px-4 font-semibold tracking-wide drop-shadow-2xl 
                                    flex justify-center items-center sm:flex mt-0`}>
                                            <Image src={url} layout={`fill`} alt={name}
                                                objectFit={`contain`} />
                                        </a>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </header>
    )
}

export default Header