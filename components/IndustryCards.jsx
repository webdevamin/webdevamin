import { Fragment } from 'react';
import Image from 'next/image';
import { Link } from '../src/i18n/navigation';
import Heading from './Heading';
import ButtonThree from './Buttons/ButtonThree';
import { FullBleedLine } from './Layouts/BorderedSection';

/*
 * Toont sectorpagina's als vakken gescheiden door lijnen, met afbeelding, korte
 * uitleg, prijs en link. Gebruikt op het sectoroverzicht en onderaan elke
 * sectorpagina. Vanaf drie sectoren komt er op desktop een derde kolom bij.
 */
const IndustryCards = ({ content, cards }) => {
    if (!content || !cards?.length) return null;

    const { slug, title, subtitle, text, button } = content;
    const threeColumns = cards.length >= 3;

    return (
        <section id={slug} className="scroll-mt-28">
            <div className="max-w-7xl mx-auto">
                <Heading title={title} subtitle={subtitle} />
                {text && <div className="max-w-3xl" dangerouslySetInnerHTML={{ __html: text }} />}
                <div className={`relative mt-8 md:mt-10 xl:mt-12 grid grid-cols-1 md:grid-cols-2 ${threeColumns ? 'lg:grid-cols-3' : ''}`}>
                    <FullBleedLine className="absolute top-0" />
                    {cards.map(({ href, title: cardTitle, text: cardText, price, linkText, image }, index) => (
                        <Fragment key={href}>
                            {index > 0 && (
                                <FullBleedLine className={`relative col-span-full ${index % 2 === 0 ? 'md:block' : 'md:hidden'} ${threeColumns ? (index % 3 === 0 ? 'lg:block' : 'lg:hidden') : ''}`} />
                            )}
                            <article className={`flex flex-col border-dark ${index % 2 === 1 ? 'md:border-l-[0.5px]' : ''} ${threeColumns ? (index % 3 === 0 ? 'lg:border-l-0' : 'lg:border-l-[0.5px]') : ''}`}>
                                {/* Niet elke sector heeft een afbeelding in zijn JSON-bestand. */}
                                {image?.src && (
                                    <div className="relative w-full pt-[70%]">
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill={true}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-contain p-6"
                                        />
                                    </div>
                                )}
                                <div className={`flex flex-1 flex-col px-6 pb-10 lg:px-8 ${image?.src ? '' : 'pt-10'}`}>
                                    <h3 className="mb-2 text-lg sm:text-xl font-semibold normal-case text-gray-800">
                                        <Link href={href} className="transition-colors hover:text-theme_darker">
                                            {cardTitle}
                                        </Link>
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">{cardText}</p>
                                    <p className="mt-4 mb-2 text-sm sm:text-base font-semibold text-theme_darker">{price}</p>
                                    <div className="mt-auto">
                                        <ButtonThree href={href} text={linkText} />
                                    </div>
                                </div>
                            </article>
                        </Fragment>
                    ))}
                </div>
                {button && (
                    <div className="mt-8">
                        <ButtonThree href={button.href} text={button.text} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default IndustryCards;
