import ButtonOne from '../Buttons/ButtonOne';
import Heading from '../Heading';
import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import { PricingCard } from '../Cards/PricingCard';
import BorderedSection from '../Layouts/BorderedSection';
import LineGrid from '../Layouts/LineGrid';

/*
 * Rendert de pricing-sectie volledig vanuit data, inclusief positionering,
 * aanbevolen badge en een extra groeiblok onder de pakketten.
 */
const PricingGrid = ({ content, onCalculate }) => {
  const { title, subtitle, text, highlight, items, growthTitle, growthText, growthNote, button } = content;
  const hasSingleTier = Array.isArray(items) && items.length === 1;
  const hasGrowth = Boolean(growthTitle || growthText || growthNote);
  // Drie pakketten passen op desktop op één rij; vier staan in twee rijen van twee, anders worden ze te smal.
  const columns = hasSingleTier ? {} : { md: 2, xl: items?.length === 3 ? 3 : 2 };

  return (
    // Zonder groeiblok eindigt de sectie met het raster, en sluit de lijn van de volgende sectie het af.
    <BorderedSection flushBottom={!hasGrowth}>
      <BlockLayoutOne title={title} slug={`pricing`} includeMaxWidth={false} position={`right`}>
        <div className="w-full">
          <div className="4xl:pl-5 4xl:pr-12">
            <div className="max-w-7xl ml-auto lg:text-right">
              <div className='mb-10'>
                <Heading title={title} subtitle={subtitle} />
                <h4 className='-mt-2 text-lg font-bold font_quicksand bg-theme
                            text-white px-4 py-2 mb-7 inline-block uppercase
                            md:text-xl lg:text-2xl xl:text-3xl xl:px-5 xl:py-3'>{highlight}</h4>
                <div className="section_content" dangerouslySetInnerHTML={{ __html: text }} />
                {button && <ButtonOne href={button.href} text={button.text} onClick={onCalculate} />}
              </div>
            </div>
          </div>
          {/* Het raster staat buiten de 4xl-padding, zodat het van zijlijn tot zijlijn kan lopen. */}
          {(items && items.length > 0) && (
            <LineGrid
              className="mt-12 lg:mt-16 text-left"
              items={items}
              columns={columns}
              bottomLine={hasGrowth}
              cellClassName={(item) => (item.popular ? 'border-t-[3px] border-t-theme' : '')}
              renderItem={(item) => {
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

                return (
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
                    onCalculate={onCalculate}
                    popular={popular}
                    plain
                  />
                );
              }}
            />
          )}
          {hasGrowth && (
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
