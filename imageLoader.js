const normalizeSrc = (src) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
    src,
    width,
    quality,
}) {
    // Optimize quality based on width for better performance
    const optimizedQuality = quality || (width <= 640 ? 85 : width <= 1024 ? 90 : 95);

    const params = [
        `width=${width}`,
        "format=auto",
        `quality=${optimizedQuality}`,
        "fit=scale-down", // Ensure image doesn't get upscaled
    ];

    const paramsString = params.join(",");

    // Only use Cloudflare resizing for images on our bucket domain.
    // For relative/public assets (e.g., /images/logo-light.webp) or other hosts,
    // return the original src but append width/quality so the loader varies by width.
    try {
        const url = new URL(src);
        const path = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
        if (url.hostname === "bucket.webdevamin.com") {
            return `${url.protocol}//${url.hostname}/cdn-cgi/image/${paramsString}/${path}`;
        }
        const sep = url.search && url.search.length > 0 ? "&" : "?";
        return `${url.protocol}//${url.hostname}${url.pathname}${url.search || ""}${sep}w=${width}&q=${optimizedQuality}`;
    } catch (_) {
        // Relative path (served from /public). Append width/quality params.
        const sep = src.includes("?") ? "&" : "?";
        return `${src}${sep}w=${width}&q=${optimizedQuality}`;
    }
}