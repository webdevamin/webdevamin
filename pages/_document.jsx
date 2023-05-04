import Document, { Html, Head, Main, NextScript } from 'next/document'
import { FB_PIXEL_ID } from "../utils/fbpixel";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <noscript>
                        <img height="1" width="1" style={{ display: 'none' }}
                            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} />
                    </noscript>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Mohave:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument