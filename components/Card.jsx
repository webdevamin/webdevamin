import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import React from "react";
import Image from 'next/image';
import { useTranslations } from "next-intl";

const Card = ({ item, prefixLink }) => {
    const { title, image, slug } = item;
    const { alt, img } = image;
    const link = prefixLink + slug;

    const g = useTranslations('general');

    return (
        <article className="card">
            <div className='image_container'>
                <Image src={img.url} alt={alt}
                    layout="fill" objectFit='cover'
                    className='radius-md' priority />
            </div>
            <div className='card_footer'>
                <h3>{title}</h3>
                <Link href={link}>
                    <a className='link'>
                        <span>{g('readMore')}</span>
                        <FontAwesomeIcon icon={faArrowRightLong} size={'xs'} />
                    </a>
                </Link>
            </div>
        </article>
    )
}

export default Card;