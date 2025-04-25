import BlockAccordion from '../components/Blocks/BlockAccordion';
import BlockCards from '../components/Blocks/BlockCards';
import BlockCardsTwo from '../components/Blocks/BlockCardsTwo';
import BlockCols from '../components/Blocks/BlockCols';
import BlockNormal from '../components/Blocks/BlockNormal';
// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

const componentMapper = {
  "block-normal": BlockNormal,
  "block-cards": BlockCards,
  "block-cards-two": BlockCardsTwo,
  "block-cols": BlockCols,
  "block-accordion": BlockAccordion
  // Add other mappings as needed
};

export {
  getJsonString, componentMapper
};
