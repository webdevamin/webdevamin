import Link from 'next/link'
import React from 'react'

const ButtonOne = ({ href, text, classes, wFit, external,
    input, outline, noMargin }) => {
    const allClasses = `p-3 relative before:ease-linear
    block sm:inline-block uppercase font-semibold sm:p-4 before:absolute 
    before:top-0 before:left-0 transition-all 
    ease-linear shadow-bold_r_sm md:shadow-bold_r_md hover:shadow-zero before:origin-left
    before:bottom-0 before:right-0 
    before:-z-10 before:transition-all
    before:scale-x-0 hover:before:scale-x-100 z-10 text-sm 
    shadow-bold_r_md sm:text-base tracking-wider
    ${noMargin ? `mt-0` : `mt-7`}
    ${wFit && `w-fit px-7 sm:px-12`}
    ${classes} ${outline ? `text-dark border md:border-2 border-dark bg-light` :
            `text-dark bg-theme border md:border-2 border-dark`}`;

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
        <Link href={href} className={allClasses}>
            {text}
        </Link>
    )
}

export default ButtonOne