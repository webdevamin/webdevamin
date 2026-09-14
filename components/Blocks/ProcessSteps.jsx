import { Fragment } from 'react';
import Heading from '../Heading';
import BorderedSection, { FullBleedLine } from '../Layouts/BorderedSection';
import { renderIcon } from '../../utils/iconMapper';

/*
 * Rendert de korte processectie zodat bezoekers snel begrijpen wat er gebeurt
 * nadat ze een offerte of pakket aanvragen. De stappen staan in vakken met lijnen.
 */
const ProcessSteps = ({ content }) => {
  if (!content?.items?.length) return null;

  const { title, subtitle, items } = content;

  return (
    <BorderedSection flushBottom>
      <section id="process">
        <div className="max-w-7xl mx-auto">
          <Heading title={title} subtitle={subtitle} />
          <div className="relative mt-6 md:mt-8 xl:mt-10 grid grid-cols-1 lg:grid-cols-3">
            <FullBleedLine className="absolute top-0" />
            {items.map((item, index) => (
              <Fragment key={item.title}>
                {index > 0 && <FullBleedLine className="relative col-span-full lg:hidden" />}
                <div className={`flex flex-col items-center text-center px-6 py-10 lg:px-8 border-dark ${index > 0 ? 'lg:border-l-[0.5px]' : ''} ${index === 0 ? 'lg:pl-0' : ''} ${index === items.length - 1 ? 'lg:pr-0' : ''}`}>
                  <div className="rounded-full bg-theme bg-opacity-5 p-3 sm:p-4 lg:p-5 mb-3 lg:mb-4">
                    <div className="text-theme_dark">
                      {renderIcon(item.icon, { className: 'h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9' })}
                    </div>
                  </div>
                  <div className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Stap {index + 1}
                  </div>
                  <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 break-words">
                    {item.text}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </BorderedSection>
  );
};

export default ProcessSteps;
