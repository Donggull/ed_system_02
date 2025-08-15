import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design System Generator - 디자인 시스템 생성기",
  description: "Next.js와 Tailwind CSS를 사용하여 완전한 디자인 시스템을 생성하고 관리하는 도구입니다. 컴포넌트 라이브러리, 테마 에디터, 코드 내보내기 기능을 제공합니다.",
  keywords: ["design system", "component library", "tailwind css", "next.js", "react", "디자인 시스템", "컴포넌트"],
  authors: [{ name: "Design System Generator" }],
  creator: "Design System Generator",
  publisher: "Design System Generator",
  openGraph: {
    title: "Design System Generator",
    description: "완전한 디자인 시스템을 생성하고 관리하는 도구",
    url: "https://ed-system.vercel.app",
    siteName: "Design System Generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Design System Generator",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design System Generator",
    description: "완전한 디자인 시스템을 생성하고 관리하는 도구",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
