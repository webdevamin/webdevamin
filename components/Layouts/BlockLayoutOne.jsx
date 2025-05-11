import React from 'react'

const BlockLayoutOne = ({ children, slug, includeMaxWidth = true, textCenter = true, right = false }) => {
    return (
        <div id={slug} className={`z-30 ${includeMaxWidth ? `max-w-5xl mx-auto` : ``} block_container`}>
            <div className={`xl:flex flex-col justify-center 
            items-center gap-16 4xl:px-0 ${textCenter ? `xl:text-center` : right ? `xl:text-right` : ``}`}>
                {children}
            </div>
        </div>
    )
}

export default BlockLayoutOne