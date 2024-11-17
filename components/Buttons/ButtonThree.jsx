import React from 'react'
import { fas } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonThree = ({ href, text, noLink, color, classes }) => {
    if (noLink) {
        return (
            <div className={`flex items-center mt-3 gap-2 lg:gap-3 hover:gap-4 
            transition-all lg:mt-4 ${color || `text_theme_darker_all`} ${classes}`}>
                <span className={`text-sm lg:text-base uppercase 
                drop-shadow-none flex items-center lg:gap-3 text_theme_all 
                font-semibold hover:gap-4 gap-2 hover:text_dark_all`}>
                    {text}
                </span>
                <FontAwesomeIcon icon={fas["faArrowRight"]} />
            </div>
        )
    }

    return (
        <Link href={href} className={`mt-3 flex items-center lg:gap-3 lg:text-base 
        text-sm font-semibold transition-all hover:gap-4 gap-2 drop-shadow-none
         ${color || `text_theme_darker_all hover:text_dark_all`} ${classes}`}>
            <span className={`text-sm lg:text-base uppercase drop-shadow-none`}>
                {text}
            </span>
            <FontAwesomeIcon icon={fas["faArrowRight"]} />
        </Link>
    )
}

export default ButtonThree