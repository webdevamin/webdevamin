import Link from "next/link";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

const Header = () => {
    const router = useRouter();
    const { pathname } = router;

    const t = useTranslations('header');

    const [active, setActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { systemTheme, theme, setTheme } = useTheme();

    const handleClick = () => setActive(!active);

    useEffect(() => {
        setMounted(true);
    }, [])


    const renderThemeChanger = () => {
        if (!mounted) return null;

        const currentTheme = theme === 'system' ? systemTheme : theme;

        if (currentTheme === 'dark') {
            return (
                <div>
                    <a className="right_a h_button" onClick={() => setTheme('light')}>
                        <FontAwesomeIcon icon="fa-solid fa-sun" role={"button"} />
                    </a>
                </div>
            )
        }

        return (
            <div>
                <a className="right_a h_button" onClick={() => setTheme('dark')}>
                    <FontAwesomeIcon icon="fa-solid fa-moon" role={"button"} />
                </a>
            </div>
        )
    }

    return (
        <>
            <header>
                <Link href={'/'}>
                    <a><h1 className="logo">AI</h1></a>
                </Link>
                <div className="header_right">
                    <input className="menu-btn" type="checkbox" id="menu-btn" onClick={handleClick} />
                    <label className="menu-icon h_button" htmlFor="menu-btn">
                        <span className="navicon"></span>
                    </label>
                    {renderThemeChanger()}
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