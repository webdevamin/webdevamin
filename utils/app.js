import BlockAccordion from '../components/Blocks/BlockAccordion';
import BlockCols from '../components/Blocks/BlockCols';
// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

const componentMapper = {
  "block-cols": BlockCols,
  "block-accordion": BlockAccordion
  // Add other mappings as needed
};

export {
  getJsonString, componentMapper
};
