import Image from 'next/image'
import React from 'react'
import ButtonOne from '../components/Buttons/ButtonOne';
import voidImg from "../public/images/void.svg";
import Header from './Layouts/Header';

const NoContent = ({ title, text, locale, imgOnly, wholePage }) => {
    const Display = () => {
        return (
            <main className={`w-9/12 max-w-8xl m-auto text-center md:mt-48`}>
                <Image src={voidImg} objectFit={`cover`}
                    alt={locale === `en` ? `Person looking at the void.` :
                        `Persoon die naar de leegte kijkt.`} width={360} height={378} />
                <div className={`text-center my-14`}>
                    <h1 className={`text-4xl mb-5`}>
                        {title}
                    </h1>
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                    <ButtonOne href={`/`} text={locale === `en` ? `To homepage` : `Naar homepagina`}
                        classes={`w-fit px-16 sm:px-16 mx-auto`} />
                </div>
            </main>
        )
    }

    if (imgOnly) {
        return (
            <Image src={voidImg} objectFit={`cover`}
                alt={locale === `en` ? `Person looking at the void.` :
                    `Persoon die naar de leegte kijkt.`} width={360} height={378} />
        )
    }

    if (wholePage) {
        return (
            <div className={`flex flex-col h-full md:block md:h-auto`}>
                <Header />
                <Display />
            </div>
        )
    }

    return <Display />
}

export default NoContent