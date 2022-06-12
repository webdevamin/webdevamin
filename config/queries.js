import { gql } from "graphql-request";

const GET_BLOGS = gql`
  query MyQuery($locale: [Locale!]!) {
    blogs(locales: $locale) {
      image {
        alt
        img {
          url
          id
        }
      }
      slug
      summary
      tags(locales: $locale) {
        id
        name
        slug
      }
      title
      content {
        html
      }
    }
  }
`;

const GET_BLOG_BY_SLUG = gql`
  query MyQuery($locale: [Locale!]!) {
    blogs(locales: $locale) {
      image {
        alt
        img {
          url
          id
        }
      }
      slug
      summary
      tags(locales: $locale) {
        id
        name
        slug
      }
      title
      content {
        html
      }
    }
  }
`;

export { GET_BLOGS };
