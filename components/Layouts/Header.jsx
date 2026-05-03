'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from '../../src/i18n/navigation';
import useStore from '../../utils/store';
import { useLocale } from 'next-intl';

/*
 * Rendert een lichte, responsive navigatie zonder Flowbite Navbar/Dropdown,
 * zodat de header minder client-side JavaScript nodig heeft.
 */
const Header = ({ pages, alternateLangs, locales, heroBannerData }) => {
    const locale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const nonHiddenPages = pages.filter(p => !p.hideFromHeader);
    const { content } = heroBannerData || {};
    const isAlertVisible = useStore((state) => state.isAlertVisible);
    const hideAlert = useStore((state) => state.hideAlert);

    /*
     * Sluit het mobiele menu en alle dropdowns nadat een bezoeker navigeert.
     */
    const closeNavigation = () => {
        setIsMenuOpen(false);
        setOpenDropdownIndex(null);
    };

    /*
     * Toont de taalswitcher. Op desktop staat die rechts, op mobiel onderaan
     * in het menu zodat de hoofdlinks gecentreerd kunnen blijven.
     */
    const LanguageSwitcher = ({ mobile = false }) => {
        if (!alternateLangs || alternateLangs.length === 0) return null;

        return (
            <div className={mobile
                ? 'mt-2 flex items-center gap-2 border-t border-dark border-opacity-10 pt-3 md:hidden'
                : 'hidden items-center justify-end gap-2 md:flex'}
            >
                {alternateLangs.map((alternateLang) => {
                    const { href, locale: alternateLocale } = alternateLang;
                    const localeLink = locales.find((loc) => loc.lang === alternateLocale);

                    if (!localeLink) return null;

                    const { flag, alt } = localeLink;

                    return (
                        <Link
                            key={alternateLocale}
                            href={href}
                            locale={alternateLocale}
                            onClick={closeNavigation}
                            className="relative flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-white"
                        >
                            <Image
                                src={flag}
                                fill={true}
                                alt={alt}
                                priority={true}
                                loading="eager"
                                style={{ objectFit: 'contain' }}
                                sizes="40px"
                            />
                        </Link>
                    );
                })}
            </div>
        );
    };

    return (
        <header className="fixed top-0 z-50 w-full bg-light">
            {isAlertVisible && content && (
                <div className="m-1.5 text-center md:m-3">
                    <div className="flex items-center justify-center gap-3 rounded-lg bg-red-400 px-4 py-3 text-black">
                        <span
                            className="block font-medium"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                        <button
                            type="button"
                            onClick={hideAlert}
                            aria-label={locale === 'nl' ? 'Melding sluiten' : 'Close alert'}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded border border-black border-opacity-20 transition-colors hover:bg-black hover:bg-opacity-10"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <nav className="relative mx-auto grid max-w-8xl grid-cols-[auto_auto] items-center justify-between px-4 py-4 md:grid-cols-[auto_1fr_auto] lg:px-16">
                <div className="flex justify-start">
                    <Link href="/" onClick={closeNavigation} aria-label="Webdevamin home">
                        <Image
                            src="/images/logo-light.webp"
                            width={46}
                            height={46}
                            className="rounded-lg"
                            priority={true}
                            alt="Webdevamin Logo"
                        />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-expanded={isMenuOpen}
                    aria-label={locale === 'nl' ? 'Menu openen' : 'Open menu'}
                    className="inline-flex h-11 w-11 items-center justify-center rounded border border-dark border-opacity-20 text-dark transition-colors hover:bg-theme md:hidden"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                <div
                    className={`${isMenuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-t border-dark border-opacity-10 bg-light px-4 pb-5 pt-3 shadow-lg md:static md:flex md:flex-row md:items-center md:justify-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none xl:gap-10`}
                >
                    {nonHiddenPages.map((page, index) => {
                        const { href, title, subs } = page;
                        const isSubsPresent = subs && subs.length > 0;
                        const isOpen = openDropdownIndex === index;

                        if (isSubsPresent) {
                            return (
                                <div
                                    key={title}
                                    className="group relative"
                                    onMouseEnter={() => setOpenDropdownIndex(index)}
                                    onMouseLeave={() => setOpenDropdownIndex(null)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenDropdownIndex(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between gap-2 rounded px-3 py-3 text-left font-semibold text-dark transition-colors hover:bg-white hover:text-theme md:w-auto md:px-0 md:py-2 md:hover:bg-transparent"
                                        aria-expanded={isOpen}
                                    >
                                        <span>{title}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform md:group-hover:rotate-180 md:group-focus-within:rotate-180 ${isOpen ? 'rotate-180 md:rotate-0' : ''}`} />
                                    </button>
                                    <div
                                        className={`${isOpen ? 'block' : 'hidden'} static rounded-lg border border-dark border-opacity-10 bg-white p-2 shadow-md md:absolute md:left-1/2 md:top-full md:hidden md:min-w-56 md:-translate-x-1/2 md:border-0 md:bg-transparent md:p-0 md:pt-3 md:shadow-none md:group-hover:block md:group-focus-within:block`}
                                    >
                                        <div className="rounded-lg border border-dark border-opacity-10 bg-white p-2 shadow-md">
                                            {subs.map((sub) => {
                                                const { title: subTitle, href: subHref, borderTop } = sub;

                                                return (
                                                    <Link
                                                        key={subTitle}
                                                        href={subHref}
                                                        onClick={closeNavigation}
                                                        className={`block rounded px-3 py-2 text-sm font-semibold text-dark transition-colors hover:bg-theme hover:text-dark ${borderTop ? 'border-t border-dark border-opacity-10' : ''}`}
                                                    >
                                                        {subTitle}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={title}
                                href={href}
                                onClick={closeNavigation}
                                className="rounded px-3 py-3 font-semibold text-dark transition-colors hover:bg-white hover:text-theme md:px-0 md:py-2 md:hover:bg-transparent"
                            >
                                {title}
                            </Link>
                        );
                    })}

                    <LanguageSwitcher mobile />
                </div>

                <LanguageSwitcher />
            </nav>
        </header>
    );
};

export default Header;
