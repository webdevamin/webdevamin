'use client';

import { Link } from '../../src/i18n/navigation'
import { useLocale } from 'next-intl';
import { getIconComponent } from '../../utils/iconMapper';
import ButtonThree from '../Buttons/ButtonThree';

const industries = [
    { title: 'Taxibedrijven', slug: 'taxi-website-laten-maken' },
    { title: 'Kapperszaken', slug: 'kapper-website-laten-maken' },
    { title: 'Restaurants & horeca', slug: 'restaurant-website-laten-maken' },
    { title: 'Isolatiebedrijven', slug: 'isolatiebedrijf-website-laten-maken' },
];

const Footer = ({ blogs, pages, socials }) => {
    const locale = useLocale();

    return (
        <footer className={`bg-dark px-6 py-12 w-screen left-[calc(-50vw+50%)] 
        relative sm:px-10 lg:p-12 z-30`}>
            <div className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:gap-12
            xl:grid-cols-12 max-w-8xl mx-auto xl:px-8`}>
                <div className={`text_light_all min-w-0 xl:col-span-2`}>
                    <h2 className={`text-xl mb-4`}>
                        Socials
                    </h2>
                    <ul>
                        {
                            socials.map((social, i) => {
                                const { href, icon, title, hideFromFooter } = social;

                                const IconComponent = getIconComponent(icon);

                                return (
                                    <li className={`${hideFromFooter && `hidden`}`} key={i}>
                                        <a href={href}
                                            rel="noopener noreferrer nofollow" target="_blank"
                                            className={`flex min-h-8 items-center py-1 lg:text-base`}>
                                            <div className={`flex items-center gap-3`}>
                                                <IconComponent className="h-5 w-5 shrink-0" />
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
                <div className={`text_light_all min-w-0 xl:col-span-2`}>
                    <h2 className={`text-xl mb-4`}>
                        Links
                    </h2>
                    <ul>
                        {
                            pages.map((page, i) => {
                                const { href, icon, title, hideFromHeader, subs } = page;
                                if (locale === 'nl' && href === '/industry') return null;
                                const IconComponent = getIconComponent(icon);

                                // Hide items like "Sectoren" that only act as dropdown parents (no index page)
                                const noIndex = !href || href === '#';
                                const isDropdownParent = Array.isArray(subs) && subs.length > 0;
                                if (isDropdownParent && noIndex) return null;

                                return (
                                    <li className={`${hideFromHeader && `hidden`}`}
                                        key={i}>
                                        <Link href={`${href}`} className={`flex min-h-8 items-center gap-3 py-1`}>
                                            <IconComponent className="h-5 w-5 shrink-0" />
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
                {locale === 'nl' && (
                    <div className={`min-w-0 col-span-2 sm:col-span-1 xl:col-span-3`}>
                        <h2 className={`text-xl mb-4 text-light`}>
                            Sectoren
                        </h2>
                        <ul className={`text_light_all`}>
                            {industries.map(({ title, slug }) => (
                                <li key={slug}>
                                    <Link href={`/industry/${slug}`} className={`flex min-h-8 items-center py-1 leading-relaxed lg:text-base transition-all hover:text-theme`}>
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className={`md:mt-4`}>
                            <ButtonThree href={`/industry`} color={`text_theme_all`} classes="min-h-11" text="Alle sectoren" />
                        </div>
                    </div>
                )}
                <div className={`min-w-0 col-span-2 ${locale === 'nl' ? 'sm:col-span-1 xl:col-span-5' : 'xl:col-span-8'} ${!blogs.length && `hidden`}`}>
                    <h2 className={`text-xl mb-4 text-light`}>
                        {locale === `nl` ? `Laatste blogs` : `Latest blogs`}
                    </h2>
                    <ul className={`text_light_all`}>
                        {
                            blogs.filter(blog => !['vat-exemption-not-worth-it', 'btw-vrijstelling-nadelig'].includes(blog.slug)).slice(0, 5).map((blog, i) => {
                                const { title, slug } = blog;

                                return (
                                    <li key={i}>
                                        <Link href={`/blogs/${slug}`} className={`flex min-h-8 items-center py-1 break-words leading-relaxed lg:text-base transition-all 
                                            hover:text-theme`}>
                                            {title}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className={`md:mt-4`}>
                        <ButtonThree href={`/blogs`} color={`text_theme_all`} classes="min-h-11"
                            text={locale === `nl` ? `Alle blogs` : `All blogs`} />
                    </div>
                </div>
                <div className={`text_light_all min-w-0 col-span-full border-t border-white/20 pt-8`}>
                    <h2 className={`text-xl mb-4`}>
                        {locale === `nl` ? `Overige` : `Misc`}
                    </h2>
                    <ul className={`flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8`}>
                        {locale === 'nl' && (
                            <li className={`py-1 text-sm lg:text-base min-h-8`}>
                                8310 Brugge
                            </li>
                        )}
                        <li>
                            <Link href={`/policy`} className={`inline-flex min-h-8 items-center py-1 lg:text-base transition-all hover:text-theme`}>
                                {locale === `nl` ? `Privacybeleid` : `Privacy policy`}
                            </Link>
                        </li>
                        <li>
                            <div>
                                Featured on <a href="https://startupfa.me/s/webdevamin?utm_source=webdevamin.com" target="_blank" rel="noopener noreferrer nofollow" className={`inline-flex min-h-8 items-center py-1 lg:text-base transition-all hover:text-theme`}>Startup Fame</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer
