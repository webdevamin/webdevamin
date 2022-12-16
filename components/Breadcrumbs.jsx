import React from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Breadcrumbs = ({ items }) => {
    return (
        <ul className={`flex items-center gap-x-2 gap-y-1
        flex-wrap lg:gap-5 md:w-fit md:mx-auto mb-4`}>
            <li className={`flex items-center justify-center gap-x-2 gap-y-1 lg:gap-5`}>
                <div className={`flex items-center`}>
                    <FontAwesomeIcon icon={faHouse} className={`text-sm md:text-base lg:text-xl`} />
                    <Link href={`/`}>
                        <a className={`ml-3 lg:ml-6 font-semibold 
                        transition-all ease-linear duration-300 
                        hover:text-theme_dark underline underline-offset-4 lg:underline-offset-8 
                        lg:text-xl text-sm md:text-base`}>
                            Home
                        </a>
                    </Link>
                </div>
                <FontAwesomeIcon icon={faAngleRight} className={`text-sm md:text-base lg:text-xl`} />
            </li>
            {
                items.map((item, i) => {
                    const { name, href } = item;

                    return (
                        <li key={i} className={`flex items-center gap-x-2 
                        lg:gap-5 justify-center gap-y-1`}>
                            {
                                href ? (
                                    <Link href={href}>
                                        <a className={`text-center font-semibold 
                                        hover:text-theme_dark transition-all 
                                        ease-linear duration-300 underline 
                                        underline-offset-4 text-sm md:text-base lg:text-xl lg:underline-offset-8`}>
                                            {name}
                                        </a>
                                    </Link>
                                ) : (
                                    <span className={`text-center text-sm md:text-base lg:text-xl 
                                    font-semibold`}>
                                        {name}
                                    </span>
                                )
                            }
                            {
                                (i < items.length - 1) && (
                                    <FontAwesomeIcon icon={faAngleRight}
                                        className={`text-sm md:text-base lg:text-xl`} />
                                )
                            }
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default Breadcrumbs