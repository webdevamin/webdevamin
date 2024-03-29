import React from 'react'

const BlockLayoutThree = ({ children, title, bothSides }) => {
    return (
        <div id={title} className={`py-14 sm:py-16 
        md:pt-40 md:pb-16 lg:pt-48 xl:pt-64 xl:pb-24
        z-10 w-screen left-[calc(-50vw+50%)] 
        relative bg-theme_dark 
        ${bothSides ? `md:clip-path-both` : `md:clip-path`}`}>
            <div className={`w-10/12 max-w-8xl mx-auto`}>
                <section className={`page_container`}>
                    {children}
                </section>
            </div>
        </div>
    )
}

export default BlockLayoutThree