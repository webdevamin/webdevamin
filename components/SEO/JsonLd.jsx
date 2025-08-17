export default function JsonLd({ data }) {
  if (!data) return null;

  const items = Array.isArray(data)
    ? data
    : Object.values(data || {}).filter(Boolean);

  if (!items.length) return null;

  return (
    <>
      {items.map((item, idx) => (
        <script
          key={`jsonld-${idx}`}
          type="application/ld+json"
          // JSON-LD accepted anywhere in the document; head preferred but body is fine
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
