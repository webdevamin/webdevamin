'use client';

import { Link } from '../../src/i18n/navigation'
import { useLocale } from 'next-intl';
import { getIconComponent } from '../../utils/iconMapper';
import ButtonThree from '../Buttons/ButtonThree';

const Footer = ({ blogs, pages, socials, followExternalLinks }) => {
    const locale = useLocale();

    return (
        <footer className={`bg-dark p-10 w-screen left-[calc(-50vw+50%)] 
        relative md:p-12 z-30`}>
            <div className={`justify-between gap-10 sm:gap-12 grid 
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-16 xl:flex max-w-8xl mx-auto lg:px-16`}>
                <div className={`text_light_all`}>
                    <h2 className={`text-xl mb-2`}>
                        Socials
                    </h2>
                    <ul>
                        {
                            socials.map((social, i) => {
                                const { href, icon, title, hideFromFooter } = social;

                                const IconComponent = getIconComponent(icon);

                                return (
                                    <li className={`pt-2 ${hideFromFooter && `hidden`}`} key={i}>
                                        <a href={href}
                                            rel={`${followExternalLinks ? `noopener noreferrer` :
                                                `noopener noreferrer nofollow`}`} target="_blank"
                                            className={`lg:text-base`}>
                                            <div className={`flex items-center gap-3`}>
                                                <IconComponent className="h-5 w-5" />
                                                <span className={`lg:text-base transition-all hover:text-theme`}>
                                                    {title}
                                                </span>
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className={`text_light_all`}>
                    <h2 className={`text-xl mb-2`}>
                        Links
                    </h2>
                    <ul>
                        {
                            pages.map((page, i) => {
                                const { href, icon, title, hideFromHeader, subs } = page;
                                const IconComponent = getIconComponent(icon);

                                // Hide items like "Branches" that only act as dropdown parents (no index page)
                                const noIndex = !href || href === '#';
                                const isDropdownParent = Array.isArray(subs) && subs.length > 0;
                                if (isDropdownParent && noIndex) return null;

                                return (
                                    <li className={`pt-2 ${hideFromHeader && `hidden`}`}
                                        key={i}>
                                        <Link href={`${href}`} className={`flex items-center gap-3`}>
                                            <IconComponent className="h-5 w-5" />
                                            <span className={`lg:text-base transition-all 
                                                hover:text-theme`}>
                                                {title}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className={`border-b border-b-white sm:border-none pb-8 sm:py-0 col-span-2 sm:col-span-1 ${!blogs.length && `hidden`}`}>
                    <h2 className={`text-xl mb-2 text-light`}>
                        {locale === `nl` ? `Laatste blogs` : `Latest blogs`}
                    </h2>
                    <ul className={`text_light_all`}>
                        {
                            blogs.map((blog, i) => {
                                const { title, slug } = blog;

                                return (
                                    <li className={`pt-2`} key={i}>
                                        <Link href={`/blogs/${slug}`} className={`lg:text-base transition-all 
                                            hover:text-theme`}>
                                            {title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className={`md:mt-4`}>
                        <ButtonThree href={`/blogs`} color={`text_theme_all`}
                            text={locale === `nl` ? `Alle blogs` : `All blogs`} />
                    </div>
                </div>
                <div className={`text_light_all`}>
                    <h2 className={`text-xl mb-2`}>
                        {locale === `nl` ? `Overige` : `Misc`}
                    </h2>
                    <ul className={`flex items-center gap-x-3 flex-wrap sm:gap-0 sm:block`}>
                        {locale === 'nl' && (
                            <li className={`pt-3 sm:pt-2`}>
                                Adres: Rodenonnenstraat 21, <strong>8000 Brugge</strong>
                            </li>
                        )}
                        <li className={`pt-3 sm:pt-2`}>
                            <Link href={`/policy`} className={`lg:text-base transition-all hover:text-theme`}>
                                {locale === `nl` ? `Privacybeleid` : `Privacy policy`}
                            </Link>
                        </li>
                        <li className={`pt-3 sm:pt-2`}>
                            <div>
                                Featured on <a href="https://startupfa.me/s/webdevamin?utm_source=webdevamin.com" target="_blank" className={`lg:text-base transition-all hover:text-theme`}>Startup Fame</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer