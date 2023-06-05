import { gql } from "@apollo/client";

// Data that is (mostly) used everywhere in the website (footer, etc)

const GET_GLOBAL = gql`
  query Global($locale: I18NLocaleCode) {
    localePages {
      data {
        attributes {
          name
          flag {
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
          locale
        }
      }
    }
    pages(
      locale: $locale
      sort: "sort:asc"
      filters: { hide_link: { eq: false } }, 
      pagination: { limit: 100 }
    ) {
      data {
        attributes {
          title
          href
          icon
        }
      }
    }
    blogs(
      locale: $locale
      filters: { showcase: { eq: true } }
      sort: "date:desc", 
      pagination: { limit: 100 }
    ) {
      data {
        attributes {
          title
          img {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            objectFit
            width
            height
            alt
          }
          date
          slug
        }
      }
    }
    services(locale: $locale, pagination: { limit: 100 }) {
      data {
        attributes {
          title
          showcase
          icon {
            name
            brands
          }
        }
      }
    }
    socials(pagination: { limit: 100 }) {
      data {
        attributes {
          title
          href
          hideFromHeader
          hideFromFooter
          icon {
            name
            brands
          }
        }
      }
    }
    regions(locale: $locale, pagination: { limit: 100 }) {
      data {
        attributes {
          name
          slug
          showcase
        }
      }
    }
    contactblock(locale: $locale) {
      data {
        attributes {
          title
          text
          button {
            href
            text
            external
          }
        }
      }
    }
  }
`;

// Collection data

const GET_PAGE = gql`
query Pages($locale: I18NLocaleCode, $slug: String) {
  pages(locale: $locale, filters: { slug: { eq: $slug } }) {
    data {
      attributes {
        title
        href
        sort
        hide_link
        slug
        seo {
          title
          description
          canonical
        }
        alternates {
          hreflang
          href
        }
        localepages {
          locale
          href
          locale_link {
            data {
              attributes {
                name
                flag {
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
        blocks {
          __typename
          ... on ComponentLayoutsBlockNormalMedium {
            title
            slug
            subtitle
            text
            img {
              objectFit
              width
              height
              alt
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
          ... on ComponentLayoutsBlockNormal {
            title
            slug
            subtitle
            text
            summary
            button {
              href
              text
              label
              external
            }
            img {
              objectFit
              width
              height
              alt
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
          ... on ComponentLayoutsBlockNormalSmall {
            title
            slug
            subtitle
          }
          ... on ComponentLayoutsBlockSmallWithSubBlocks {
            title
            slug
            subtitle
            text
            subblocks {
              title
              text
              slug
            }
          }
          ... on ComponentLayoutsBlockHeading {
            title
            slug
            subtitle
          }
          ... on ComponentElementsAlert {
            title
            text
            backgroundColor
            color
          }
        }
      }
    }
  }
}
`;

const GET_SERVICES = gql`
  query Services($locale: I18NLocaleCode) {
    services(locale: $locale, pagination: { limit: 100 }) {
      data {
        attributes {
          title
          text
          showcase
          backgroundColor
          icon {
            name
            brands
          }
        }
      }
    }
  }
`;

const GET_PROJECTS = gql`
  query Projects($locale: I18NLocaleCode) {
    projects(locale: $locale, pagination: { limit: 100 }) {
      data {
        id
        attributes {
          alternates {
            href
            hreflang
          }
          seo {
            title
            description
            canonical
          }
          title
          slug
          description
          sort
          img {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            alt
          }
          showcase
          locale
        }
      }
    }
  }
`;

const GET_BLOGS = gql`
  query Blogs($locale: I18NLocaleCode) {
    blogs(locale: $locale, pagination: { limit: 100 }) {
      data {
        attributes {
          alternates {
            href
            hreflang
          }
          seo {
            title
            description
            canonical
          }
          title
          slug
          description
          img {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            alt
          }
          text
          showcase
          locale
        }
      }
    }
  }
`;

const GET_REGIONS = gql`
  query Regions($locale: I18NLocaleCode) {
    regions(locale: $locale, pagination: { limit: 100 }) {
      data {
        id
        attributes {
          name
          slug
          seo {
            title
            description
            canonical
          }
          alternates {
            hreflang
            href
          }
          hero {
            title
            text
            button {
              href
              text
              label
              external
            }
            img {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              width
              height
              alt
              objectFit
            }
          }
          contents {
            title
            subtitle
            text
            button {
              href
              text
              label
              external
            }
            slug
            summary
            img {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              width
              height
              alt
              objectFit
            }
            position
          }
          locale
        }
      }
    }
  }
`;

const GET_TESTIMONIALS = gql`
query Pages($locale: I18NLocaleCode) {
  testimonials(locale: $locale, pagination: { limit: 100 }) {
    data {
      attributes {
        name
        letter
        review
        backgroundColor
        stars
      }
    }
  }
}
`;

const GET_TECHS = gql`
query Techs {
  teches(pagination: { limit: 100 }) {
    data {
      attributes {
        name
        img {
          image {
            data {
              attributes {
                url
              }
            }
          }
          objectFit
          width
          height
          alt
        }
      }
    }
  }
}
`;

const GET_SERVICE_DETAILS = gql`
query ServiceDetails($locale: I18NLocaleCode) {
  serviceDetails(locale: $locale, pagination: { limit: 100 }, sort: "sort:asc") {
    data {
      attributes {
        title
        description
        sort
      }
    }
  }
}
`;

const GET_TYPES = gql`
query Types($locale: I18NLocaleCode) {
  types(locale: $locale, pagination: { limit: 100 }, sort: "sort:asc"){
    data {
      attributes {
        name
        sort
        bgColor
        color
      }
    }
  }
}
`;

const GET_PROJECT = gql`
  query Projects($locale: I18NLocaleCode, $slug: String) {
    projects(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          alternates {
            href
            hreflang
          }
          localepages {
            locale_link {
              data {
                attributes {
                  name
                  flag {
                    image {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
            href
            locale
          }
          seo {
            title
            description
            canonical
          }
          title
          slug
          description
          descriptionText
          technologiesText
          technologies {
            name
            image {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              objectFit
              width
              height
              alt
            }
          }
          img {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            objectFit
            width
            height
            alt
          }
          imgTwo {
            image {
              data {
                attributes {
                  url
                }
              }
            }
            objectFit
            width
            height
            alt
          }
          link
          showcase
          locale
        }
      }
    }
  }
`;

const GET_BLOG = gql`
  query Blogs($locale: I18NLocaleCode, $slug: String) {
    blogs(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        attributes {
          alternates {
            href
            hreflang
          }
          localepages {
            locale_link {
              data {
                attributes {
                  name
                  flag {
                    image {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
            href
            locale
          }
          seo {
            title
            description
            canonical
          }
          title
          slug
          description
          img {
            image {
              data {
                attributes {
                  url
                  formats
                }
              }
            }
            objectFit
            width
            height
            alt
          }
          text
          showcase
          date
        }
      }
    }
  }
`;

const GET_REGION = gql`
  query Regions($locale: I18NLocaleCode, $slug: String) {
    regions(locale: $locale, filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          slug
          seo {
            title
            description
            canonical
          }
          localepages {
            locale_link {
              data {
                attributes {
                  name
                  flag {
                    image {
                      data {
                        attributes {
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
            href
            locale
          }
          alternates {
            hreflang
            href
          }
          hero {
            title
            text
            button {
              href
              text
              label
              external
            }
            img {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              width
              height
              alt
              objectFit
            }
          }
          contents {
            title
            subtitle
            text
            button {
              href
              text
              label
              external
            }
            slug
            summary
            img {
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
              width
              height
              alt
              objectFit
            }
            position
          }
          locale
        }
      }
    }
  }
`;

const GET_LOCALES = gql`
  query Locales {
    i18NLocales {
      data {
        attributes {
          code
        }
      }
    }
  }
`;

// Single Types

const GET_SERVICE_DETAILS_BLOCK = gql`
query ServiceDetailsBlock($locale: I18NLocaleCode) {
  serviceDetailsBlock(locale: $locale) {
    data {
      attributes {
        title
        subtitle
        description
      }
    }
  }
}
`;

export {
  GET_GLOBAL,
  GET_PAGE,
  GET_SERVICES,
  GET_PROJECTS,
  GET_BLOGS,
  GET_REGIONS,
  GET_TYPES,
  GET_TESTIMONIALS,
  GET_TECHS,
  GET_SERVICE_DETAILS,
  GET_PROJECT,
  GET_BLOG,
  GET_REGION,
  GET_LOCALES,
  GET_SERVICE_DETAILS_BLOCK
};
