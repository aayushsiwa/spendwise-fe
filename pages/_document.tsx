import { Head, Html, Main, NextScript } from 'next/document';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <title>SpendWise</title>
      </Head>
      <body>
        <InitColorSchemeScript attribute="data" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
