import BlockAccordion from '../components/Blocks/BlockAccordion';
// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

const componentMapper = {
  "block-accordion": BlockAccordion
  // Add other mappings as needed
};

export {
  getJsonString, componentMapper
};
