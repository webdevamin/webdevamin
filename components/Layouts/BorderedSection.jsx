/*
 * Lijn over de volledige breedte van het scherm. `left-[calc(-50vw+50%)]` werkt
 * omdat de ouder gecentreerd staat, net als bij de Footer, en PageLayout knipt af
 * wat buiten beeld valt. De positie komt via className: `absolute top-0`,
 * `absolute bottom-0` of `relative col-span-full` voor een rij in een raster.
 */
export const FullBleedLine = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none left-[calc(-50vw+50%)] w-screen border-t-[0.5px] border-dark ${className}`}
  />
);

/*
 * Sectie met een lijn bovenaan. `[&>*]:!my-0` en `[&_.block_container]:!my-0`
 * halen de eigen marges van het blok weg, ook als het blok nog in een extra div
 * zit (zoals Services), zodat de ruimte boven en onder elke lijn gelijk is. Met
 * flushBottom loopt een raster onderaan door tot aan de lijn van de volgende sectie;
 * met flushTop begint het raster meteen onder de lijn van deze sectie.
 * Vanaf tablet tekent PageLayout de eerste lijn direct onder de hero, dus de eerste
 * sectie tekent daar geen eigen lijn en begint meteen onder die lijn. Een benoemde groep
 * (group/section) voorkomt dat de gewone `group` van CardTwo mee reageert.
 */
const BorderedSection = ({ children, line = true, flushTop = false, flushBottom = false }) => (
  // String.raw houdt de backslash in `block\_container`, anders leest Tailwind de underscore als spatie.
  <div className={String.raw`group/section relative ${flushTop ? '' : 'pt-16 md:pt-20 xl:pt-24'} ${flushBottom ? '' : 'pb-16 md:pb-20 xl:pb-24'} first:mt-12 md:first:mt-0 [&>*]:!my-0 [&_.block\_container]:!my-0`}>
    {line && <FullBleedLine className="absolute top-0 md:group-first/section:hidden" />}
    {children}
  </div>
);

export default BorderedSection;
