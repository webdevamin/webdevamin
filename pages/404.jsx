import Image from 'next/image'
import React from 'react'
import Seo from '../components/Seo'
import ButtonOne from '../components/Buttons/ButtonOne';

const Error404 = ({ pageData }) => {
    const { seo, alternates, blocks } = pageData;
    const { title, text, button, image } = blocks[0];
    const { href, text: btnText } = button[0];
    const { src, alt, width, height, objectFit } = image;

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <div className={`flex flex-col h-full justify-center`}>
                <main className={`w-9/12 max-w-8xl m-auto flex flex-col items-center gap-1 md:gap-6`}>
                    <Image
                        src={src} width={width} height={height} alt={alt}
                        style={{ objectFit: objectFit }} priority={true}
                    />
                    <div className={`text-center my-14`}>
                        <h1 className={`text-4xl mb-5`}>
                            {title}
                        </h1>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        <ButtonOne href={href} text={btnText}
                            classes={`w-fit px-16 sm:px-16 mx-auto`} />
                    </div>
                </main>
            </div>
        </>
    )
}

export default Error404

export async function getStaticProps({ locale }) {
    return {
        props: {
            pageData: (await import(`../lang/${locale}/pages/404.json`)).default,
        },
    }
}