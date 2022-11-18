import React from 'react'
import Image from 'next/image'
import Header from '../components/Layouts/Header'
import Seo from '../components/Seo'
import { GET_SERVER_ERRORPAGE } from '../graphql/queries';
import { destructureSingleType } from '../utils/app'
import { getData } from '../graphql/api';
import ButtonOne from '../components/Buttons/ButtonOne';

const Error500 = ({ data }) => {
    const { seo, alternates, block } = destructureSingleType(data.serverErrorpage);
    const { title, text, img, button } = block;
    const { href, text: buttonText } = button[0];
    const { image, width, height, objectFit, alt } = img;
    const { url } = destructureSingleType(image);

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <div className={`flex flex-col h-full md:block md:h-auto`}>
                <Header />
                <main className={`w-9/12 max-w-8xl m-auto text-center md:mt-48`}>
                    <Image src={url} objectFit={objectFit}
                        alt={alt}
                        width={width} height={height} />
                    <div className={`text-center my-14`}>
                        <h1 className={`text-4xl mb-5`}>
                            {title}
                        </h1>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                        <ButtonOne href={href} text={buttonText}
                            classes={`w-fit px-16 sm:px-16 mx-auto`} />
                    </div>
                </main>
            </div>
        </>
    )
}

export default Error500

export async function getStaticProps({ locale }) {
    const data = await getData(GET_SERVER_ERRORPAGE, { locale: [locale] }, false);

    return {
        props: { data },
    }
}