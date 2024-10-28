import Image from 'next/image';
import Link from 'next/link'
import { Alert, Dropdown, Navbar } from "flowbite-react";
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

    return (
        <header className={`fixed w-full top-0 z-50 bg-light`}>
            <div className={`text-center m-1.5 md:m-3 ${(!isAlertVisible || !content) && `hidden`}`}>
                <Alert onDismiss={hideAlert} icon={InfoIcon}>
                    <span className='ml-4 mr-1 font-medium block' dangerouslySetInnerHTML={{ __html: content }}>
                    </span>
                </Alert>
            </div>
            <Navbar fluid>
                <Navbar.Brand href="/">
                    <Image
                        src={`/images/logo-light.png`} width={48} height={48}
                        className={`rounded-lg`} priority={true} alt={`Logo`}
                    />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    {
                        nonHiddenPages.map((page, i) => {
                            const { href, title, subs } = page;
                            const isLast = i === nonHiddenPages.length - 1;
                            const isSubsPresent = subs && subs.length > 0;

                            return (
                                <div key={i}>
                                    {
                                        isSubsPresent ? (
                                            <div className={`bg-transparent z-50 w-full transition-all xl:block lg:text-lg
                                            py-3 px-8 xl:py-0 xl:px-0 border-theme 
                                            ease-linear xl:border-none relative 
                                            hover:text-theme font-semibold ${isLast ? `border-none` : `border-b`}`}>
                                                <Dropdown inline label={`Diensten`} className='rounded-xl font-semibold'>
                                                    {
                                                        subs.map((sub, i) => {
                                                            const { title, href } = sub;

                                                            return (
                                                                <Dropdown.Item key={i} href={href}>{title}</Dropdown.Item>
                                                            )
                                                        })
                                                    }
                                                </Dropdown>
                                            </div>
                                        ) : (
                                            <Navbar.Link href={href} className={`bg-transparent z-50 w-full transition-all xl:block
                                            py-3 px-8 xl:py-0 xl:px-0 border-theme 
                                            ease-linear xl:border-none relative 
                                            hover:text-theme font-semibold ${isLast ? `border-none` : `border-b`} ${href == '/policy' && `hidden`}`}>
                                                {title}
                                            </Navbar.Link>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </Navbar.Collapse>
            </Navbar>
            <ul className={`text-white text-lg tracking-widest flex 
            gap-4 lg:gap-5 xl:gap-20 relative items-center bg-transparent`}>
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
        </header>
    )
}

export default Header