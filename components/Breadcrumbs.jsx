import React from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faAngleRight } from '@fortawesome/free-solid-svg-icons'

const Breadcrumbs = ({ items }) => {
    return (
        <ul className={`flex items-center gap-x-2 gap-y-1
        flex-wrap lg:gap-5 md:w-fit md:mx-auto`}>
            <li className={`flex items-center justify-center gap-x-2 gap-y-1 
            lg:gap-5 lg:text-xl`}>
                <div className={`flex items-center`}>
                    <FontAwesomeIcon icon={faHouse} />
                    <Link href={`/`}>
                        <a className={`ml-2.5 lg:ml-4 font-semibold 
                        transition-all ease-linear duration-300
                        hover:text-theme_dark underline`}>
                            Home
                        </a>
                    </Link>
                </div>
                <FontAwesomeIcon icon={faAngleRight} />
            </li>
            {
                items.map((item, i) => {
                    const { name, href } = item;

                    return (
                        <li key={i} className={`font-semibold flex items-center gap-x-2 
                        lg:gap-5 lg:text-xl justify-center gap-y-1`}>
                            {
                                href ? (
                                    <Link href={href}>
                                        <a className={`text-center
                                        hover:text-theme_dark transition-all ease-linear 
                                        duration-300 underline`}>{name}</a>
                                    </Link>
                                ) : <span className={`text-center`}>{name}</span>
                            }
                            {
                                (i < items.length - 1) && (
                                    <FontAwesomeIcon icon={faAngleRight}
                                        className={`text-center`} />
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