import React from 'react'

const BlockLayoutOne = ({ children, title }) => {
    return (
        <div id={title} className={`z-30 max-w-5xl mx-auto block_container`}>
            <section className={`xl:flex flex-col justify-center 
            items-center gap-16 4xl:px-0 xl:text-center`}>
                {children}
            </section>
        </div>
    )
}

export default BlockLayoutOne