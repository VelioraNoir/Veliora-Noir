// src/app/layout.tsx - Updated with Playfair Display SC
import type { Metadata } from "next";
import { Inter, Playfair_Display_SC } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import "./globals.css";

// Configure fonts with Next.js optimization
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairSC = Playfair_Display_SC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Veliora Noir - Luxury Metallic Accessories",
  description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail. Experience luxury jewelry in stunning 3D.",
  keywords: "luxury accessories, metallic jewelry, premium design, sophisticated style, handcrafted accessories, 3D jewelry viewer, luxury rings, necklaces, bracelets, earrings",
  authors: [{ name: "Veliora Noir" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Veliora Noir - Luxury Metallic Accessories",
    description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail. Experience luxury jewelry in stunning 3D.",
    type: "website",
    locale: "en_US",
    siteName: "Veliora Noir",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veliora Noir - Luxury Metallic Accessories",
    description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail. Experience luxury jewelry in stunning 3D.",
  },
  alternates: {
    canonical: "https://velioranoir.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairSC.variable} scroll-smooth`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/hdri/studio_small_03_1k.hdr" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#d4af37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="bg-metallic-mesh min-h-screen antialiased">
        {/* Subtle metallic overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-metallic-platinum-100/30 pointer-events-none" />
        
        {/* Header */}
        <Header />
        
        {/* Main content with proper spacing for fixed header */}
        <div className="relative z-10 pt-20">
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
        
        {/* Subtle shine effect that moves across the page */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -inset-10 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallic-silver-200/20 to-transparent transform -skew-x-12 animate-metallic-shine" />
          </div>
        </div>
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring for 3D scenes
              if (typeof window !== 'undefined') {
                window.__VN_3D_PERFORMANCE__ = {
                  startTime: performance.now(),
                  webglSupported: !!window.WebGLRenderingContext,
                  webgl2Supported: !!window.WebGL2RenderingContext,
                };
              }
            `,
          }}
        />
      </body>
    </html>
  );
}