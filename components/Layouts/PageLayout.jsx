import CookieConsent from '../CookieConsent'

const PageLayout = ({ children, allowSticky = false }) => {
    return (
        <>
            <div className={allowSticky ? 'overflow-x-clip' : 'overflow-x-hidden'}>
                {/* Eerste lijn van het paginaraster, direct onder de hero. Deze div is altijd even breed als het scherm, ook bij uitzoomen. */}
                <div aria-hidden="true" className={`hidden md:block border-t-[0.5px] border-dark`} />
                <main className={`relative container`}>
                    <div className={`hidden xl:block w-[0.5px] bg-dark h-full absolute z-20`} />
                    <div className={`page_container`}>
                        {children}
                    </div>
                    <div className={`hidden xl:block w-[0.5px] bg-dark h-full absolute top-0 right-0 z-20`} />
                </main>
            </div>
            <CookieConsent />
        </>
    )
}

export default PageLayout