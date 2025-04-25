import BlockLayoutTwo from '../Layouts/BlockLayoutTwo'
import { Carousel } from "flowbite-react";
import Slide from '../Slide';
import Image from 'next/image';
import ButtonOne from '../Buttons/ButtonOne';
import NoContent from '../NoContent';
import { useRouter } from 'next/router';
import Heading from '../Heading';

const Blogs = ({ content, data }) => {
    const router = useRouter();
    const { title, text, button, slug } = content;
    const { href, text: buttonText } = button[0];

    return (
        <BlockLayoutTwo title={title} slug={slug} position={`right`}>
            <div className={`md:basis-5/12`}>
                <Heading title={title} noSubtitle />
                <div dangerouslySetInnerHTML={{ __html: text }} />
                <ButtonOne href={href} text={buttonText} wFit />
            </div>
            <div className={`mt-10 gap-6 h-auto md:hidden overflow-x-auto 
            overscroll-x-contain 
            ${data.length > 1 ? `flex pr-20 w-screen lg:pb-4` : `block`}`}>
                {
                    data.map((blog, i) => {
                        const { title, img: { src, alt }, date } = blog;

                        return (
                            <article key={i} className={`min-w-[75vw] sm:min-w-[53vw]`}>
                                <div className={`relative h-[calc(100vw/2.1)] sm:h-[calc(100vw/3)]`}>
                                    <Image
                                        src={src} fill={true} className={`rounded-xl`}
                                        alt={alt} style={{ objectFit: `cover` }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
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
            ${data.length ? `md:basis-7/12 hidden` : `md:basis-5/12 px-10 md:p-0`}`}>
                {
                    data.length ? (
                        <Carousel indicators={false} className={`relative`}>
                            {
                                data.map((blog, i) => {
                                    const { img: { src, alt } } = blog;

                                    return (
                                        <Slide key={i} src={src} alt={alt} />
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