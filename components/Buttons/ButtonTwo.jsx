import Link from 'next/link'
import React from 'react'

const ButtonTwo = ({ href, text, classes }) => {
    return (
        <Link href={href}>
            <a className={`p-3 relative before:ease-linear
            block sm:inline-block text-white bg-theme_dark border md:border-2 
            uppercase font-semibold sm:p-4 before:absolute border-white
            before:top-0 before:left-0 transition-all before:origin-left
            hover:before:bg-white before:bottom-0 before:right-0 
            before:-z-10 before:bg-theme_dark before:transition-all
            before:scale-x-0 hover:before:scale-x-100 z-10 tracking-wider
            text-sm sm:text-base mt-7 hover:text-dark ease-linear 
            ${classes}`}>
                {text}
            </a>
        </Link>
    )
}

export default ButtonTwo