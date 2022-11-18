import React from 'react'

const PageLayout = ({ children }) => {
    return (
        <div className={`overflow-x-hidden`}>
            <main className={`relative container`}>
                <div className={`hidden xl:block w-[0.5px] bg-dark h-full 
            absolute z-20`} />
                <div className={`page_container`}>
                    {children}
                </div>
                <div className={`hidden xl:block w-[0.5px] bg-dark h-full 
            absolute top-0 right-0 z-20`} />
            </main>
        </div>
    )
}

export default PageLayout