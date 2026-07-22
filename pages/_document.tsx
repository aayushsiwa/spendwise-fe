import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>SpendWise</Head>
      <body>
        <InitColorSchemeScript attribute="data" modeStorageKey="theme" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
