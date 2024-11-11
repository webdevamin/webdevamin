import BlockCards from '../components/Blocks/BlockCards';
import BlockCols from '../components/Blocks/BlockCols';
import BlockNormal from '../components/Blocks/BlockNormal';
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
  "pricing": Pricing,
  // Add other mappings as needed
};

export {
  getJsonString, componentMapper
};
