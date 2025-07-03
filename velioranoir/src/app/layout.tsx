import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velio Ranoir - Luxury Metallic Accessories",
  description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail.",
  keywords: "luxury accessories, metallic jewelry, premium design, sophisticated style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-metallic-mesh min-h-screen">
        {/* Subtle metallic overlay for depth */}
        <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-metallic-platinum-100/30 pointer-events-none" />
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle shine effect that moves across the page */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -inset-10 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallic-silver-200/20 to-transparent transform -skew-x-12 animate-metallic-shine" />
          </div>
        </div>
      </body>
    </html>
  );
}