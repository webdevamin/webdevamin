import { gql } from "graphql-request";

const GET_BLOG_SLUGS = gql`
  query MyQuery() {
    blogs {
      localizations(includeCurrent: true) {
        id
        slug
        locale
      }
    }
  }
`;

const GET_PROJECT_SLUGS = gql`
  query MyQuery() {
    projects {
      localizations(includeCurrent: true) {
        id
        slug
        locale
      }
    }
  }
`;

const GET_BLOGS_BY_LANG = gql`
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
  query MyQuery($locale: [Locale!]!, $slug: String!) {
    blogs(locales: $locale, where: { slug: $slug }) {
      image {
        alt
        caption
        img {
          url
          id
        }
      }
      id
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
      date
    }
  }
`;

const GET_PROJECT_BY_SLUG = gql`
  query MyQuery($locale: [Locale!]!, $slug: String!) {
    projects(locales: $locale, where: { slug: $slug }) {
      image {
        alt
        img {
          url
          id
        }
      }
      id
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
      date
      link
    }
  }
`;

const GET_PROJECTS_BY_LANG = gql`
  query MyQuery($locale: [Locale!]!) {
    projects(locales: $locale) {
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

export {
  GET_BLOG_SLUGS,
  GET_PROJECT_SLUGS,
  GET_BLOGS_BY_LANG,
  GET_BLOG_BY_SLUG,
  GET_PROJECT_BY_SLUG,
  GET_PROJECTS_BY_LANG,
};
