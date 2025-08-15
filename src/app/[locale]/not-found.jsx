import Image from 'next/image';
import ButtonOne from '../../../components/Buttons/ButtonOne';
import Header from '../../../components/Layouts/Header';
import Footer from '../../../components/Layouts/Footer';

async function getData(locale) {
    const pageData = (await import(`../../../messages/${locale}/pages/404.json`)).default;
    const pagesData = (await import(`../../../messages/${locale}/pages.json`)).default;
    const localesData = (await import(`../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../messages/${locale}/socials.json`)).default;
    const blogsData = (await import(`../../../messages/${locale}/blogs.json`)).default;

    return {
        pageData,
        pagesData,
        localesData,
        socialsData,
        blogsData,
    };
}

export default async function NotFound({ params }) {
    // This is a workaround to get the locale in the not-found page.
    // The headers contain the full URL, so we can extract the locale from it.
    // Note: This is not a standard Next.js feature and might break in future updates.
    const { headers } = require('next/headers');
    const url = headers().get('x-next-pathname');
    const locale = url.split('/')[1] || 'en'; // Default to 'en' if locale is not in URL

    const { pageData, pagesData, localesData, socialsData, blogsData } = await getData(locale);

    const { title, text, button, image } = pageData.blocks[0];
    const { href, text: btnText } = button[0];
    const { src, alt, width, height, objectFit } = image;

    return (
        <>
            <Header pages={pagesData} alternateLangs={pageData.alternateLangs} locales={localesData} />
            <div className={`flex flex-col h-full justify-center`}>
                <main className={`w-9/12 max-w-6xl m-auto flex flex-col items-center gap-1 md:gap-6`}>
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
            <Footer blogs={blogsData} pages={pagesData} socials={socialsData} />
        </>
    );
}
