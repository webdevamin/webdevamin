import BlockAccordion from '../components/Blocks/BlockAccordion';
import BlockCards from '../components/Blocks/BlockCards';
import BlockCols from '../components/Blocks/BlockCols';
import BlockNormal from '../components/Blocks/BlockNormal';
import BlockTimeline from '../components/Blocks/BlockTimeline';
import Pricing from '../components/Pricing';
// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

const componentMapper = {
  "block-normal": BlockNormal,
  "block-cards": BlockCards,
  "block-cols": BlockCols,
  "block-timeline": BlockTimeline,
  "block-accordion": BlockAccordion,
  "pricing": Pricing,
  // Add other mappings as needed
};

export {
  getJsonString, componentMapper
};
