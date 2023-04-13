import React from 'react'
import Image from 'next/image'
import Seo from '../components/Seo'
import { GET_PAGE } from '../graphql/queries';
import { destructureSingleType } from '../utils/app'
import { getData } from '../graphql/api';
import ButtonOne from '../components/Buttons/ButtonOne';

const Error500 = ({ pageData }) => {
    const { seo, blocks, alternates } = pageData.pages.data[0].attributes;
    const { button, img, text, title } = blocks[0];
    const { href, text: buttonText } = button[0];
    const { image, width, height, objectFit, alt } = img;
    const { url } = destructureSingleType(image);

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <div className={`flex flex-col h-full justify-center`}>
                <main className={`w-9/12 max-w-8xl m-auto text-center`}>
                    <Image src={url} objectFit={objectFit}
                        alt={alt} width={width} height={height} />
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
    const pageData = await getData(GET_PAGE,
        { "slug": "server-error", "locale": [locale] },
        false);

    return {
        props: { pageData },
    }
}