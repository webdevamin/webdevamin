# Project rules

## Third-party links

- On every new or updated page and in all new or updated content, add `rel="nofollow"` to every link to a third-party website. This includes links in components, HTML stored in content files, and generated content.
- For links that open in a new tab, keep `noopener noreferrer` as well: `rel="noopener noreferrer nofollow"`. Neither `noopener` nor `noreferrer` replaces `nofollow`.
- Do not add other outbound SEO endorsements, such as third-party URLs in `sameAs` structured data, unless I explicitly request them.
- Check the final link markup when changing content. `nofollow` is a signal to search engines, not a guarantee about any third-party domain authority or rating score.
