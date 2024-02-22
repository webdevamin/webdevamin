// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

export {
  getJsonString
};
