# Project rules

## Third-party links

- On every new or updated page and in all new or updated content, add `rel="nofollow"` to every link to a third-party website. This includes links in components, HTML stored in content files, and generated content.
- For links that open in a new tab, keep `noopener noreferrer` as well: `rel="noopener noreferrer nofollow"`. Neither `noopener` nor `noreferrer` replaces `nofollow`.
- Do not add other outbound SEO endorsements, such as third-party URLs in `sameAs` structured data, unless I explicitly request them.
- Check the final link markup when changing content. `nofollow` is a signal to search engines, not a guarantee about any third-party domain authority or rating score.

## Social images

- When creating a public page, follow `SOCIAL_IMAGES.md`. Add its localized content with SEO title, description and canonical URL in the existing content structure, and use the shared social-image metadata helper in its page metadata. This is part of creating the page, not a separate task for the user.
- All localized page JSON files, blogs and registered industries enter the social-image registry automatically during builds. Do not add a separate OG registration step. Missing dedicated artwork uses `public/images/social-card-template.jpg`, so a new page receives a card with its own text immediately.
- Dedicated artwork is optional. When preparing it from the master reference, keep it text-free. Translations can share artwork.
- Every illustrated human must be faceless: a smooth, blank skin-toned face with no eyes, eyebrows, nose, mouth or other facial features. This includes background people, side profiles, reflections and portraits on screens. Do not substitute blurring or masks for a blank face. Apply this rule to all new or edited illustrations.
- Keep headlines, descriptions and prices in content, not in the artwork. Builds render the final cards automatically; do not add image-model calls to the build.
- When changing artwork, increment its `seo.socialImage.artworkVersion` for all pages using it, or bump `SOCIAL_IMAGE_DESIGN_VERSION` for a shared design or font change.
