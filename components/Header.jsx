import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Hero from './Hero';
import { useRouter } from 'next/router';

const Header = () => {
    const router = useRouter();
    const { pathname } = router;

    const t = useTranslations('header');
    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    }

    return (
        <>
            <header>
                <h1 className="logo">AI</h1>
                <div className="header_right">
                    <input className="menu-btn" type="checkbox" id="menu-btn" onClick={handleClick} />
                    <label className="menu-icon h_button" htmlFor="menu-btn">
                        <span className="navicon"></span>
                    </label>
                    <div>
                        <Link href={pathname} locale={t('lang.switchLangLink')}>
                            <a className="right_a h_button">{t('lang.switchLangText')}</a>
                        </Link>
                    </div>
                </div>
                <ul className={active ? "menu open_menu" : "menu"}>
                    <li>
                        <Link href='/'>
                            <a>{t('nav.home')}</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/blogs'>
                            <a>{t('nav.blogs')}</a>
                        </Link>
                    </li>
                </ul>
            </header>
        </>
    );
};

export default Header;