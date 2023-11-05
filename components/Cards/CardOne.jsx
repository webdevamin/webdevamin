import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Image from 'next/image';
import starsImage from '../../public/images/star.png';
import { useRouter } from 'next/router';

const CardOne = ({ initial, title, bgColor, text, icon, count }) => {
    const router = useRouter();
    const { name, brands } = icon || {};
    const iconRef = brands ? fab[name] : fas[name];

    return (
        <article className={`shadow-md border border-dark 
        xl:border-opacity-10 border-opacity-20 rounded-2xl p-6 relative 
        flex-1 xl:flex xl:flex-row`}>
            {
                (initial || icon) && (
                    <div className={`p-5 w-14 h-14 md:w-16 md:h-16
                    rounded-full font-bold flex items-center justify-center 
                    mx-auto absolute left-0 right-0 -top-[11%] shadow-bold_r_sm 
                    text-dark text-lg md:-top-[13%]`}
                        style={{ backgroundColor: `${bgColor}` }}>
                        {initial && <span>{initial}</span>}
                        {icon && (
                            <div>
                                <FontAwesomeIcon icon={iconRef} />
                            </div>
                        )}
                    </div>
                )
            }
            <div className={`mt-7 md:mt-6 mb-4 text-center`}>
                <h3 className={`text-lg xl:text-lg capitalize mb-0`}>
                    {title}
                </h3>
                <div className={`mb-4 mt-1.5 lg:mt-2 flex justify-center`}>
                    {
                        [...Array(count)].map((num, i) => {
                            return (
                                <div key={i}
                                    className={`${!count ? `hidden` : `inline`}`}>
                                    <Image
                                        src={starsImage}
                                        width={11} height={11}
                                        alt={router.locale === `en` ?
                                            `${count} stars review` :
                                            `${count} sterren review`}
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                <div dangerouslySetInnerHTML={{ __html: text }}
                    className={`smaller_p`} />
            </div>
        </article>
    )
}

export default CardOne