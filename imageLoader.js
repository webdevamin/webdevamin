const normalizeSrc = (src) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
    src,
    width,
    quality,
}) {
    const params = [];
    if (width) {
        params.push(`width=${width}`);
    }
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(",");
    return `${process.env.NEXT_PUBLIC_URL}/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
}