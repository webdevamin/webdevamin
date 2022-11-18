import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

const CardOne = ({ initial, title, bgColor, text, icon }) => {
    const { name, brands } = icon || {};
    const iconRef = brands ? fab[name] : fas[name];

    return (
        <article className={`shadow-xl border border-dark 
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
                            <div className={`text_light_all`}>
                                <FontAwesomeIcon icon={iconRef} />
                            </div>
                        )}
                    </div>
                )
            }
            <div className={`mt-7 md:mt-9 mb-4 text-center`}>
                <h3 className={`text-lg xl:text-lg capitalize 
                xl:mb-3`}>
                    {title}
                </h3>
                <div className={`smaller_p`}
                    dangerouslySetInnerHTML={{ __html: text }} />
            </div>
        </article>
    )
}

export default CardOne