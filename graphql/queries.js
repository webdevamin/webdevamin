import { gql } from "@apollo/client";

// Data that is (mostly) used everywhere in the website (footer, etc)

const GET_GLOBAL = gql`
  query Global($locale: I18NLocaleCode) {
    blogs(
      locale: $locale
      filters: { showcase: { eq: true } }
      sort: "date:desc"
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
    services(locale: $locale) {
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
    socials {
      data {
        attributes {
          title
          href
          icon {
            name
            brands
          }
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
          }
        }
      }
    }
  }
`;

// Data that is used for specific pages

const GET_HOMEPAGE = gql`
  query Homepage($locale: I18NLocaleCode) {
    homepage(locale: $locale) {
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
          hero {
            title
            text
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
            button {
              href
              text
            }
          }
          about {
            title
            subtitle
            text
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
            button {
              href
              text
            }
          }
          projects {
            title
            slug
            text
            button {
              href
              text
            }
          }
          blogs {
            title
            slug
            text
            button {
              href
              text
            }
          }
          testimonials {
            title
            slug
            text
          }
        }
      }
    }
    projects(locale: $locale, filters: { showcase: { eq: true } }) {
      data {
        attributes {
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
        }
      }
    }
    testimonials(locale: $locale) {
      data {
        attributes {
          letter
          name
          review
          backgroundColor
        }
      }
    }
  }
`;

const GET_ABOUTPAGE = gql`
  query Aboutpage($locale: I18NLocaleCode) {
    aboutpage(locale: $locale) {
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
          hero {
            title
            subtitle
            text
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
            button {
              href
              text
            }
          }
          expertise {
            title
            subtitle
            text
            slug
          }
          who {
            title
            subtitle
            text
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
              objectFit
              width
              height
              alt
            }
            button {
              href
              text
            }
          }
          why {
            title
            subtitle
            slug
            text
            summary
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
          what {
            title
            subtitle
            slug
            text
            subBlock {
              title
              text
            }
          }
        }
      }
    }
  }
`;

const GET_PROJECTSPAGE = gql`
  query Projectspage($locale: I18NLocaleCode) {
    projectspage(locale: $locale) {
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
          hero {
            title
            text
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
            button {
              href
              text
            }
            slug
          }
          top {
            title
            slug
            subtitle
          }
          all {
            title
            slug
            subtitle
          }
        }
      }
    }
  }
`;

const GET_BLOGSPAGE = gql`
  query Blogspage($locale: I18NLocaleCode) {
    blogspage(locale: $locale) {
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
          hero {
            title
            text
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
            button {
              href
              text
            }
            slug
          }
          top {
            title
            slug
            subtitle
          }
          all {
            title
            slug
            subtitle
          }
          noBlogs {
            title
            text
          }
        }
      }
    }
  }
`;

const GET_CONTACTPAGE = gql`
  query Contactpage($locale: I18NLocaleCode) {
    contactpage(locale: $locale) {
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
          hero {
            title
            text
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
            button {
              href
              text
            }
            slug
          }
          form {
            title
            slug
            subtitle
            text
          }
          successMessage {
            title
            text
            backgroundColor
          }
          clientErrorMessage {
            title
            text
            backgroundColor
          }
          serverErrorMessage {
            title
            text
            backgroundColor
          }
        }
      }
    }
  }
`;

const GET_CLIENT_ERRORPAGE = gql`
  query ClientErrorPage($locale: I18NLocaleCode) {
    clientErrorpage(locale: $locale) {
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
          block {
            title
            text
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
              objectFit
              alt
            }
            button {
              href
              text
            }
          }
        }
      }
    }
  }
`;

const GET_SERVER_ERRORPAGE = gql`
  query ServerErrorPage($locale: I18NLocaleCode) {
    serverErrorpage(locale: $locale) {
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
          block {
            title
            text
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
              objectFit
              alt
            }
            button {
              href
              text
            }
          }
        }
      }
    }
  }
`;

// Collection data

const GET_SERVICES = gql`
  query Services($locale: I18NLocaleCode) {
    services(locale: $locale) {
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
    projects(locale: $locale) {
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
    blogs(locale: $locale) {
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

export {
  GET_GLOBAL,
  GET_HOMEPAGE,
  GET_ABOUTPAGE,
  GET_PROJECTSPAGE,
  GET_BLOGSPAGE,
  GET_CONTACTPAGE,
  GET_CLIENT_ERRORPAGE,
  GET_SERVER_ERRORPAGE,
  GET_SERVICES,
  GET_PROJECTS,
  GET_BLOGS,
  GET_PROJECT,
  GET_BLOG,
  GET_LOCALES,
};
