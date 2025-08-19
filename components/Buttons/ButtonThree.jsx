import React from 'react'
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

const ButtonThree = ({ href, text, noLink, color, classes, target, rel }) => {
    const isExternalLink = href?.startsWith('http');

    // Create external link props
    const externalProps = isExternalLink ? {
        target: target || "_blank",
        rel: rel || "noopener noreferrer"
    } : {};

    if (noLink) {
        return (
            <div className={`flex items-center mt-3 gap-2 lg:gap-3 hover:gap-4 
            transition-all lg:mt-4 ${color || `text_theme_darker_all`} ${classes}`}>
                <span className={`text-sm lg:text-base uppercase 
                drop-shadow-none flex items-center lg:gap-3 text_theme_all 
                font-semibold hover:gap-4 gap-2 hover:text_dark_all`}>
                    {text}
                </span>
                <ArrowRight className="h-4 w-4" />
            </div>
        )
    }

    // Use regular Link for internal links, or a tag for external links
    if (isExternalLink) {
        return (
            <a
                href={href}
                {...externalProps}
                className={`mt-3 flex items-center lg:gap-3 lg:text-base 
                text-sm font-semibold transition-all hover:gap-4 gap-2 drop-shadow-none
                ${color || `text_theme_darker_all hover:text_dark_all`} ${classes}`}
            >
                <span className="uppercase drop-shadow-none">{text}</span>
                <ExternalLink className="h-3 w-3" />
            </a>
        )
    }

    return (
        <Link href={href} className={`mt-3 flex items-center lg:gap-3 lg:text-base 
        text-sm font-semibold transition-all hover:gap-4 gap-2 drop-shadow-none
        ${color || `text_theme_darker_all hover:text_dark_all`} ${classes}`}>
            <span className="uppercase drop-shadow-none">{text}</span>
            <ArrowRight className="h-4 w-4" />
        </Link>
    )
}

export default ButtonThree