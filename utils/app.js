// General app related

const getJsonString = (string) => {
  try { return JSON.parse(string) }
  catch (error) { return string; }
}

// Formatting/destructuring data from Strapi

const destructureSingleType = (singleType) => {
  return singleType && singleType.data ? singleType.data.attributes : {};
};

const destructureImageComponent = (img, format) => {
  if (format) {
    const { url, width, height } =
      img.image.data.attributes.formats[format] || {};
    const { objectFit, alt } = img;

    return { url, width, height, objectFit, alt };
  }

  const { image, objectFit, width, height, alt } = img || {};
  const { url } = image ? image.data.attributes : {};

  return { url, objectFit, width, height, alt };
};

const destructureCollectionType = (collectionType) => {
  return collectionType.data;
};

const destructureCollectionTypeObject = (data, first) => {
  return first ?
    (destructureCollectionType(data))[0].attributes
    : data.attributes;
};

const destructureLocales = (object) => {
  const { data: rawLocales } = object.i18NLocales;
  const locales = rawLocales.map((rawLocale) => rawLocale.attributes.code);

  return locales;
};

export {
  destructureSingleType,
  destructureCollectionType,
  destructureCollectionTypeObject,
  destructureImageComponent,
  destructureLocales,
  getJsonString
};
