import { Fragment } from 'react';
import Heading from '../Heading';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import { PricingCard } from '../Cards/PricingCard';
import BorderedSection, { FullBleedLine } from '../Layouts/BorderedSection';

/*
 * Rendert de pricing-sectie volledig vanuit data, inclusief positionering,
 * aanbevolen badge en een extra groeiblok onder de pakketten.
 */
const PricingGrid = ({ content }) => {
  const { title, subtitle, text, highlight, items, growthTitle, growthText, growthNote } = content;
  const hasSingleTier = Array.isArray(items) && items.length === 1;
  // Drie pakketten passen op desktop op één rij; vier staan in twee rijen van twee, anders worden ze te smal.
  const threeInRow = items?.length === 3;

  return (
    <BorderedSection>
      <BlockLayoutOne title={title} slug={`pricing`} includeMaxWidth={false} position={`right`}>
        <div className="w-full">
          <div className="4xl:pl-5 4xl:pr-12">
            <div className="max-w-7xl ml-auto lg:text-right">
              <div className='mb-10'>
                <Heading title={title} subtitle={subtitle} />
                <h4 className='-mt-2 text-lg font-bold font_quicksand bg-theme
                            text-white px-4 py-2 mb-7 inline-block uppercase
                            md:text-xl lg:text-2xl xl:text-3xl xl:px-5 xl:py-3'>{highlight}</h4>
                <div dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            </div>
          </div>
          {/* Het raster staat buiten de 4xl-padding, zodat het gecentreerd blijft voor de lijnen. */}
          {(items && items.length > 0) && (
            <div className={`relative mt-12 lg:mt-16 grid grid-cols-1 text-left ${hasSingleTier ? '' : `md:grid-cols-2 ${threeInRow ? 'xl:grid-cols-3' : ''}`}`}>
              <FullBleedLine className="absolute top-0" />
              {items.map((item, index) => {
                const {
                  title,
                  price,
                  currency,
                  period,
                  tagline,
                  microcopy,
                  badge,
                  limitLabel,
                  description,
                  features,
                  excludedFeatures,
                  buttonText,
                  buttonHref,
                  popular,
                } = item;

                // Geen binnenruimte aan de buitenrand van het raster: links in de linkerkolom, rechts in de rechterkolom.
                // `!` is nodig omdat PricingCard zelf `lg:p-10` zet, dat anders zou winnen.
                let edgeClasses = '';
                if (!hasSingleTier) {
                  edgeClasses = index % 2 === 0 ? 'md:!pl-0' : 'md:!pr-0';
                  if (threeInRow) {
                    if (index === 1) edgeClasses += ' xl:!pr-10';
                    if (index === 2) edgeClasses += ' xl:!pl-10 xl:!pr-0';
                  }
                }

                return (
                  <Fragment key={index}>
                    {/* Rijlijn tussen pakketten: op gsm voor elk pakket, vanaf tablet om de twee. */}
                    {index > 0 && (
                      <FullBleedLine className={`relative col-span-full ${index % 2 === 1 ? 'md:hidden' : ''} ${threeInRow ? 'xl:hidden' : ''}`} />
                    )}
                    <div className={`border-dark ${index % 2 === 1 ? 'md:border-l-[0.5px]' : ''} ${threeInRow && index > 0 ? 'xl:border-l-[0.5px]' : ''}`}>
                      <PricingCard
                        title={title}
                        price={price}
                        currency={currency}
                        period={period}
                        tagline={tagline}
                        microcopy={microcopy}
                        badge={badge}
                        limitLabel={limitLabel}
                        description={description}
                        features={features}
                        excludedFeatures={excludedFeatures}
                        buttonText={buttonText}
                        buttonHref={buttonHref}
                        popular={popular}
                        plain
                        className={edgeClasses}
                      />
                    </div>
                  </Fragment>
                );
              })}
              <FullBleedLine className="absolute bottom-0" />
            </div>
          )}
          {(growthTitle || growthText || growthNote) && (
            <div className="4xl:pl-5 4xl:pr-12">
              <div className="max-w-7xl ml-auto lg:text-right">
                <div className="mt-10 pt-5 rounded-3xl lg:ml-auto lg:max-w-4xl">
                  {growthTitle && (
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                      {growthTitle}
                    </h3>
                  )}
                  {growthText && (
                    <p className="text-base leading-7 text-slate-600">
                      {growthText}
                    </p>
                  )}
                  {growthNote && (
                    <div className="mt-6">
                      <span className="inline-block bg-theme px-4 py-2
                      text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white">
                        {growthNote}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </BlockLayoutOne>
    </BorderedSection>
  );
};

export default PricingGrid;
