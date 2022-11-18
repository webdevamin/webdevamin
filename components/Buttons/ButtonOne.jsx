import Link from 'next/link'
import React from 'react'

const ButtonOne = ({ href, text, classes, wFit, external,
    input }) => {
    const allClasses = `p-3 relative before:ease-linear
    block sm:inline-block text-dark bg-theme 
    uppercase font-bold sm:p-4 before:absolute 
    before:top-0 before:left-0 transition-all 
    ease-linear sm:shadow-bold_r hover:shadow-zero before:origin-left
    hover:before:bg-dark before:bottom-0 before:right-0 
    before:-z-10 before:bg-theme before:transition-all
    before:scale-x-0 hover:before:scale-x-100 z-10 hover:text-white 
    text-sm shadow-bold_r_md sm:text-base mt-7 
    ${wFit && `w-fit px-7 sm:px-12`}
    ${classes}`;

    if (external) {
        return (
            <a className={allClasses} rel="noreferrer"
                href={href} target="_blank">
                {text}
            </a>
        )
    }

    if (input) {
        return (
            <input type="submit" value={input.value}
                className={`${allClasses} cursor-pointer`} />
        )
    }

    return (
        <Link href={href}>
            <a className={allClasses}>
                {text}
            </a>
        </Link>
    )
}

export default ButtonOne