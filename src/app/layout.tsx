import type { Metadata, Viewport } from "next";
import { Space_Mono, Anton } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

// Optimize font loading with display swap and preload
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

const anton = Anton({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  fallback: ['sans-serif'],
});

export const metadata: Metadata = {
  title: "BRUTALIST·2025 | Modern Portfolio",
  description: "A raw, bold, and modern brutalist portfolio showcasing creative work with cutting-edge animations",
  keywords: "brutalist, portfolio, design, creative, web development, animation, UI/UX",
  authors: [{ name: "Ioannis Lougiakis" }],
  creator: "Ioannis Lougiakis",
  metadataBase: new URL('https://example.com'), // Replace with your actual domain
  openGraph: {
    title: "BRUTALIST·2025 | Modern Portfolio",
    description: "A raw, bold, and modern brutalist portfolio showcasing creative work with cutting-edge animations",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/og-image.jpg', // Create and add an OG image
        width: 1200,
        height: 630,
        alt: 'BRUTALIST·2025 Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BRUTALIST·2025 | Modern Portfolio",
    description: "A raw, bold, and modern brutalist portfolio showcasing creative work with cutting-edge animations",
    images: ['/twitter-image.jpg'], // Create and add a Twitter image
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  applicationName: 'BRUTALIST·2025',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceMono.variable} ${anton.variable}`} suppressHydrationWarning>
      <ClientLayout spaceMono={spaceMono.variable} anton={anton.variable}>
        {children}
      </ClientLayout>
    </html>
  );
}
