import React from 'react'
import Image from 'next/image';
import ButtonOne from '../Buttons/ButtonOne';
import Heading from '../Heading';

// Normal vertical stacked view with image
const BlockNormal = ({ content }) => {
    const { title, slug, text, subtitle, position, img, buttons } = content;
    const { src, alt, width, height } = img || {};

    return (
        <div id={slug} className={`block_container`}>
            <section className={`flex flex-col 4xl:px-0 ${position === `right` ? `justify-end items-end text-right` : `max-w-6xl`}`}>
                <Heading title={title} subtitle={subtitle} />
                <Image src={src} width={width} height={height} alt={alt} className={`object-cover`} />
                <div dangerouslySetInnerHTML={{ __html: text }}
                    className={`p mt-10`} />
                <div className={`flex flex-col gap-4 lg:flex-row`}>
                    {
                        (buttons && buttons.length > 0) && buttons.map((btn, i) => {
                            const { href, text } = btn;
                            const isOdd = i % 2 !== 0 ? true : false;

                            if (href) {
                                return (
                                    <ButtonOne key={i} href={href}
                                        text={text} outline={isOdd} classes={`sm:px-14 text-center`} />
                                )
                            }
                        })
                    }
                </div>
            </section>
        </div>
    )
}

export default BlockNormal;