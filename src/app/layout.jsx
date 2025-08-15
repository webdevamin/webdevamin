export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
