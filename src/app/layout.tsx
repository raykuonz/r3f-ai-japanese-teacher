import type { Metadata } from "next";
import { Noto_Sans_JP, Roboto } from "next/font/google";
import "./globals.css";

export const roboto = Roboto({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export const notoSansJP = Noto_Sans_JP({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: "Japanese AI Teacher",
  description: "An AI Teacher teaching translate English to Japanese and speak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${notoSansJP.variable}`}
    >
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
