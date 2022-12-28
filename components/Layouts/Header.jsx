import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'
import { destructureImageComponent, destructureSingleType } from '../../utils/app';

const Header = ({ nav, localepages }) => {
    const [active, setActive] = useState(false);
    const { links } = destructureSingleType(nav);
    const handleClick = () => setActive(!active);

    return (
        <header className={`py-3 md:py-5 px-5 md:px-20 
        flex justify-between items-center fixed w-full top-0 z-50 bg-light`}>
            <Image src={`/images/logo-dark.png`} width={55} height={55}
                alt={`My logo but with light background and dark font`} />
            <nav className={`text-white text-lg tracking-widest flex 
            gap-4 md:gap-20 relative items-center bg-transparent`}>
                <div className={`block md:hidden`}>
                    <input className={`menu-btn hidden`}
                        type="checkbox" id="menu-btn" onClick={handleClick} />
                    <label className={`relative select-none cursor-pointer 
                    flex justify-center items-center rounded-xl
                    w-11 h-11 p-2.5 border border-dark`}
                        htmlFor="menu-btn">
                        <span className={`bg-dark h-[2px] relative 
                        transition-all w-5 before:bg-dark before:block 
                        before:top-[5px] after:-top-[5px]
                        before:h-full before:absolute before:transition-all
                        before:w-full after:bg-dark after:h-full 
                        after:absolute after:transition-all
                        after:w-full ${active && `before:-rotate-90 rotate-45
                        before:top-[0.5px] after:top-0`}`} />
                    </label>
                </div>
                <ul className={`absolute bg-light top-16 right-0 w-64 text-base
                shadow-2xl rounded-lg transition-all ease-linear z-50 max-h-min
                md:static md:flex md:rounded-none md:w-auto md:gap-8 lg:gap-10 
                items-center ${active ? `max-h-96` : `max-h-0`}`}>
                    {
                        links.map((link, index) => {
                            const { href, text } = link;
                            const isLast = index === links.length - 1;

                            return (
                                <li key={index} className={`bg-transparent z-50`}>
                                    <Link href={href}>
                                        <a className={`w-full transition-all md:block
                                        py-3 px-8 md:py-0 md:px-0 border-theme 
                                        ease-linear md:border-none relative 
                                        after:transition-all after:ease-linear
                                        after:h-0 after:w-0 after:hidden after:md:inline
                                        hover:text-theme hover:after:h-1 
                                        hover:after:w-1 hover:after:rounded-full 
                                        hover:after:bg-theme hover:after:absolute 
                                        hover:after:left-1/2 font-semibold
                                        hover:after:top-8 bg-transparent
                                        ${active ? `block` : `hidden`}
                                        ${isLast ? `border-none` : `border-b`}`}>
                                            {text}
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
                            const { name, flag } =
                                destructureSingleType(locale_link);
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