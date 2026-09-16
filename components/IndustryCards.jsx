import Image from 'next/image';
import { Link } from '../src/i18n/navigation';
import Heading from './Heading';
import ButtonThree from './Buttons/ButtonThree';
import LineGrid from './Layouts/LineGrid';

/*
 * Toont sectorpagina's als vakken gescheiden door lijnen, met afbeelding, korte
 * uitleg, prijs en link. Gebruikt op het sectoroverzicht en onderaan elke
 * sectorpagina. Op desktop 3 kolommen als het aantal kaarten deelbaar is door 3,
 * anders 2, zodat er bij 4 kaarten geen kaart alleen in een rij staat.
 */
const IndustryCards = ({ content, cards, bottomLine = false }) => {
    if (!content || !cards?.length) return null;

    const { slug, title, subtitle, text, button } = content;

    return (
        <section id={slug} className="scroll-mt-28">
            <div className="max-w-7xl mx-auto">
                <Heading title={title} subtitle={subtitle} />
                {text && <div className="max-w-3xl" dangerouslySetInnerHTML={{ __html: text }} />}
                {button && (
                    <div className="mt-6">
                        <ButtonThree href={button.href} text={button.text} />
                    </div>
                )}
            </div>
            {/* bottomLine: aan als er na deze sectie geen sectie met een eigen lijn volgt (zoals het rode contactblok), zodat het raster toch afgesloten is. */}
            <LineGrid
                className="mt-8 md:mt-10 xl:mt-12"
                items={cards}
                columns={{ md: 2, lg: cards.length % 3 === 0 ? 3 : 2 }}
                getKey={(card) => card.href}
                bottomLine={bottomLine}
                cellClassName="py-10"
                renderItem={({ href, title: cardTitle, text: cardText, price, linkText, image }) => (
                    <article className="flex h-full flex-col">
                        {/* Niet elke sector heeft een afbeelding in zijn JSON-bestand. */}
                        {image?.src && (
                            <div className="relative mb-6 h-40 w-full sm:h-48 xl:h-52">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-contain"
                                />
                            </div>
                        )}
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
                    </article>
                )}
            />
        </section>
    );
};

export default IndustryCards;
