import { Fragment } from 'react';
import { FullBleedLine } from './BorderedSection';

// Letterlijke klassen per breekpunt, anders vindt Tailwind ze niet.
const GRID_COLUMNS = {
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' },
};
// [eerste vak van een rij, andere vakken]
const ROW_LINE = {
  md: ['md:block', 'md:hidden'],
  lg: ['lg:block', 'lg:hidden'],
  xl: ['xl:block', 'xl:hidden'],
};
const LEFT_LINE = {
  md: ['md:border-l-0', 'md:border-l-[0.5px]'],
  lg: ['lg:border-l-0', 'lg:border-l-[0.5px]'],
  xl: ['xl:border-l-0', 'xl:border-l-[0.5px]'],
};
const EDGE_PADDING = {
  md: { left: ['md:pl-0', 'md:pl-8'], right: ['md:pr-0', 'md:pr-8'] },
  lg: { left: ['lg:pl-0', 'lg:pl-8'], right: ['lg:pr-0', 'lg:pr-8'] },
};

/*
 * Raster met vakken gescheiden door lijnen. Gebruik dit voor elke rij kaarten of
 * vakken, zodat elke kolom even breed is en links en rechts even veel ruimte heeft.
 *
 * - Vanaf xl toont PageLayout de zijlijnen. Het raster loopt dan van zijlijn tot
 *   zijlijn: `.page_container` is op xl 11/12 van de container (globals.scss), dus
 *   aan elke kant 1/22 van zijn eigen breedte. Alle vakken krijgen dezelfde padding.
 * - Onder xl zijn er geen zijlijnen. De buitenste vakken hebben daar geen
 *   buitenpadding, zodat de inhoud gelijk loopt met de rest van de pagina.
 * - De ouder moet even breed zijn als de pagina-inhoud, bijvoorbeeld een section
 *   direct in BorderedSection. In een smallere div (zoals max-w-7xl) klopt het niet.
 * - Eindigt de sectie met dit raster: BorderedSection flushBottom en geen bottomLine,
 *   dan sluit de lijn van de volgende sectie het raster af. Staat er nog iets onder
 *   het raster: bottomLine aan.
 *
 * columns: kolommen per breekpunt, bv. { md: 2, lg: 3 }. Een ontbrekend breekpunt
 * neemt het vorige over; op gsm is het altijd 1 kolom.
 */
const LineGrid = ({
  items,
  columns = {},
  renderItem,
  getKey = (item, index) => index,
  cellClassName = '',
  topLine = true,
  bottomLine = false,
  className = '',
}) => {
  const counts = { md: columns.md || 1 };
  counts.lg = columns.lg || counts.md;
  counts.xl = columns.xl || counts.lg;

  return (
    <div className={`relative grid grid-cols-1 ${GRID_COLUMNS.md[counts.md]} ${GRID_COLUMNS.lg[counts.lg]} ${GRID_COLUMNS.xl[counts.xl]} xl:-mx-[calc(100%/22)] ${className}`}>
      {topLine && <FullBleedLine className="absolute top-0" />}
      {items.map((item, index) => {
        const startsRow = (bp) => (index % counts[bp] === 0 ? 0 : 1);
        const rowLine = ['md', 'lg', 'xl'].map((bp) => ROW_LINE[bp][startsRow(bp)]).join(' ');
        const leftLine = ['md', 'lg', 'xl'].map((bp) => LEFT_LINE[bp][startsRow(bp)]).join(' ');
        const edgePadding = ['md', 'lg'].map((bp) => {
          const column = index % counts[bp];
          return `${EDGE_PADDING[bp].left[column === 0 ? 0 : 1]} ${EDGE_PADDING[bp].right[column === counts[bp] - 1 ? 0 : 1]}`;
        }).join(' ');
        const extra = typeof cellClassName === 'function' ? cellClassName(item, index) : cellClassName;

        return (
          <Fragment key={getKey(item, index)}>
            {index > 0 && (
              <>
                <FullBleedLine className="relative col-span-full md:hidden" />
                <FullBleedLine className={`relative col-span-full hidden ${rowLine}`} />
              </>
            )}
            <div className={`border-dark px-0 ${edgePadding} xl:px-12 ${leftLine} ${extra}`}>
              {renderItem(item, index)}
            </div>
          </Fragment>
        );
      })}
      {bottomLine && <FullBleedLine className="absolute bottom-0" />}
    </div>
  );
};

export default LineGrid;
