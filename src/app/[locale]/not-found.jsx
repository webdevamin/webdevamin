import Image from 'next/image';
import ButtonOne from '../../../components/Buttons/ButtonOne';
import { getLocale } from 'next-intl/server';

async function getData(locale) {
    const pageData = (await import(`../../../messages/${locale}/pages/404.json`)).default;
    const localesData = (await import(`../../../messages/${locale}/locales.json`)).default;

    return {
        pageData,
        localesData,
    };
}

export default async function NotFound() {
    const locale = await getLocale();
    const { pageData } = await getData(locale);

    const { title, text, button, image } = pageData.blocks[0];
    const { href, text: btnText } = button[0];
    const { src, alt, width, height, objectFit } = image;

    return (
        <>
            <div className={`flex flex-col h-screen justify-center px-10`}>
                <main className={`w-full max-w-6xl m-auto flex flex-col items-center gap-1 md:gap-6`}>
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
                            classes={`w-full md:w-auto px-16 sm:px-16 mx-auto`} />
                    </div>
                </main>
            </div>
        </>
    );
}
