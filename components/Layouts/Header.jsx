import Image from 'next/image';
import Link from 'next/link'
import { Alert, Dropdown, Navbar } from "flowbite-react";
import useStore from '../../utils/store';
import { useLocale } from 'next-intl';

const Header = ({ pages, alternateLangs, locales, heroBannerData }) => {
    const locale = useLocale();
    const nonHiddenPages = pages.filter(p => !p.hideFromHeader);
    const { content } = heroBannerData || {};
    const isAlertVisible = useStore((state) => state.isAlertVisible);
    const hideAlert = useStore((state) => state.hideAlert);

    return (
        <header className={`fixed w-full top-0 z-50 bg-light`}>
            <div className={`text-center m-1.5 md:m-3 ${(!isAlertVisible || !content) && `hidden`}`}>
                <Alert onDismiss={hideAlert} className='bg-red-400 alert_component'>
                    <span className='ml-4 mr-1 font-medium block' dangerouslySetInnerHTML={{ __html: content }}>
                    </span>
                </Alert>
            </div>
            <div>
                <Navbar fluid className='bg-transparent p-4'>
                    <Link href={`/`}>
                        <Image
                            src={`/images/logo-light.png`} width={46} height={46}
                            className={`rounded-lg`} priority={true} alt={`Logo`}
                        />
                    </Link>
                    <Navbar.Toggle />
                    <Navbar.Collapse className='header_navbar'>
                        {
                            nonHiddenPages.map((page, i) => {
                                const { href, title, subs } = page;
                                const isLast = i === nonHiddenPages.length - 1;
                                const isSubsPresent = subs && subs.length > 0;
                                const pageLocale = locale !== `en` ? `${locale}${href}` : `${href}`;

                                return (
                                    <div key={i}>
                                        {
                                            isSubsPresent ? (
                                                <div className={`dropdown_wrapper w-full transition-all xl:block lg:text-lg border-theme 
                                            ease-linear md:border-none relative 
                                            hover:text-theme font-semibold ${isLast ? `border-none` : `border-b`}`}>
                                                    <Dropdown inline label={(<span className='pr-1'>{title}</span>)} className='rounded-xl font-semibold z-[9999] full_width'>
                                                        {
                                                            subs.map((sub, i) => {
                                                                const { title, href } = sub;

                                                                const pageLocale = locale !== `en` ? `/${locale}${href}` : `/${href}`;

                                                                return (
                                                                    <Dropdown.Item key={i} href={pageLocale}>{title}</Dropdown.Item>
                                                                )
                                                            })
                                                        }
                                                    </Dropdown>
                                                </div>
                                            ) : (
                                                <Link href={pageLocale} className={`block md:p-0 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white z-50 w-full transition-all xl:block py-3 px-8 xl:py-0 xl:px-0 border-theme ease-linear xl:border-none relative hover:text-theme font-semibold ${isLast ? `border-none` : `border-b`} ${href == '/policy' && `hidden`}`}>
                                                    {title}
                                                </Link>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </Navbar.Collapse>
                    <Navbar.Collapse className='px-8 md:px-0'>
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
                                    text-sm sm:text-base w-[40px] h-[40px] 
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
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </header>
    )
}

export default Header