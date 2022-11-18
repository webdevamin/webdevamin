import React from 'react'
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo'
import { Carousel } from "flowbite-react";
import Slide from '../Slide';
import {
    destructureCollectionType,
    destructureCollectionTypeObject,
    destructureImageComponent,
} from '../../utils/app';
import Image from 'next/image';
import ButtonOne from '../Buttons/ButtonOne';
import NoContent from '../NoContent';
import { useRouter } from 'next/router';

const Blogs = ({ content, data }) => {
    const router = useRouter();
    const blogs = destructureCollectionType(data);
    const { title, text, button, slug } = content;
    const { href, text: buttonText } = button[0];

    return (
        <BlockLayoutTwo title={title} slug={slug} position={`right`}>
            <div className={`md:basis-5/12`}>
                <h2>{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: text }} />
                <ButtonOne href={href} text={buttonText} wFit />
            </div>
            <div className={`mt-10 gap-6 h-auto md:hidden overflow-x-auto 
            overscroll-x-contain 
            ${blogs.length > 1 ? `flex pr-20 w-screen pb-4` : `block`}`}>
                {
                    blogs.map((blog, index) => {
                        const { title, img, date } =
                            destructureCollectionTypeObject(blog);
                        const { url, alt } = destructureImageComponent(img);

                        return (
                            <article key={index} className={`min-w-[75vw] sm:min-w-[53vw]`}>
                                <div className={`relative h-[calc(100vw/2.1)] sm:h-[calc(100vw/3)]`}>
                                    <Image src={url} layout={`fill`} alt={alt}
                                        objectFit={`cover`} className={`rounded-xl`} />
                                </div>
                                <div className={`p-2 lg:p-1`}>
                                    <span className={`text-theme text-xs font-bold`}>
                                        {date}
                                    </span>
                                    <h3 className={`mt-2 opacity-90 leading-6 text-base`}>
                                        {title}
                                    </h3>
                                </div>
                            </article>
                        )
                    })
                }
            </div>
            <div className={`mt-10 md:flex md:mt-0 
            ${blogs.length ? `md:basis-7/12 hidden` : `md:basis-5/12 px-10 md:p-0`}`}>
                {
                    blogs.length ? (
                        <Carousel indicators={false} className={`relative`}>
                            {
                                blogs.map((blog, index) => {
                                    const { title, img } =
                                        destructureCollectionTypeObject(blog);
                                    const { url, alt } = destructureImageComponent(img);

                                    return (
                                        <Slide key={index} image={{
                                            src: url,
                                            alt: alt
                                        }} title={title} />
                                    )
                                })
                            }
                        </Carousel>
                    ) : <NoContent imgOnly locale={router.locale} />
                }
            </div>
        </BlockLayoutTwo>
    )
}

export default Blogs