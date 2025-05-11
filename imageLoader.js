const normalizeSrc = (src) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
    src,
    width,
    quality,
}) {
    // Only return raw src for true local development (localhost)
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        return src;
    }

    let domain;

    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "webdevamin.com") {
            domain = "https://webdevamin.com";
        } else if (host.endsWith(".pages.dev")) {
            domain = `https://${host}`;
        } else {
            // fallback for other environments
            domain = `https://${host}`;
        }
    } else {
        // fallback for SSR, use production domain
        domain = "https://webdevamin.com";
    }

    const params = [];
    if (width) {
        params.push(`width=${width}`);
    }
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(",");
    return `${domain}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}