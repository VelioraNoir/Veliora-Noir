// src/app/layout.tsx - FIXED WITH NO HORIZONTAL OVERFLOW
import type { Metadata } from "next";
import { Inter, Playfair_Display_SC } from 'next/font/google';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import Script from 'next/script';
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
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    title: "Veliora Noir - Luxury Metallic Accessories",
    description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail. Experience luxury jewelry in stunning 3D.",
    type: "website",
    locale: "en_US",
    siteName: "Veliora Noir",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=630&fit=crop&crop=center",
        width: 1200,
        height: 630,
        alt: "Veliora Noir Luxury Jewelry Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Veliora Noir - Luxury Metallic Accessories",
    description: "Discover our exquisite collection of premium metallic accessories crafted with unparalleled attention to detail. Experience luxury jewelry in stunning 3D.",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=630&fit=crop&crop=center"]
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
  // Get environment variables for tracking
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const HUBSPOT_PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  return (
    <html lang="en" className={`${inter.variable} ${playfairSC.variable} scroll-smooth`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/hdri/studio_small_03_1k.hdr" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Analytics preconnects for faster loading */}
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#d4af37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Google Tag Manager - Head */}
        {GTM_ID && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}

        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true,
                    custom_map: {
                      'custom_parameter_1': 'jewelry_type',
                      'custom_parameter_2': 'customer_segment'
                    }
                  });
                `,
              }}
            />
          </>
        )}

        {/* Facebook Pixel */}
        {FACEBOOK_PIXEL_ID && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FACEBOOK_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* TikTok Pixel */}
        {TIKTOK_PIXEL_ID && (
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function (w, d, t) {
                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
                  ttq.load('${TIKTOK_PIXEL_ID}');
                  ttq.page();
                }(window, document, 'ttq');
              `,
            }}
          />
        )}

        {/* HubSpot Tracking */}
        {HUBSPOT_PORTAL_ID && (
          <Script
            id="hubspot-tracking"
            src={`//js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`}
            strategy="afterInteractive"
            async
            defer
          />
        )}
      </head>
      
      <body className="bg-metallic-mesh min-h-screen antialiased overflow-x-hidden">
        {/* Google Tag Manager - Body (noscript fallback) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* Facebook Pixel - noscript fallback */}
        {FACEBOOK_PIXEL_ID && (
          <noscript>
  <img
    height="1"
    width="1"
    style={{ display: 'none' }}
    src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
    alt=""
  />
</noscript>
        )}

        {/* Subtle metallic overlay for depth - FIXED: no horizontal overflow */}
        <div className="fixed inset-0 bg-gradient-to-br from-white/50 via-transparent to-metallic-platinum-100/30 pointer-events-none overflow-hidden" />
        
        {/* Header */}
        <Header />
        
        {/* Main content with proper spacing for fixed header - FIXED: no horizontal overflow */}
        <div className="relative z-10 pt-20 overflow-x-hidden">
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
        
        {/* CART DRAWER - NOW AVAILABLE ON ALL PAGES */}
        <CartDrawer />
        
        {/* Subtle shine effect - FIXED: contained properly */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metallic-silver-200/20 to-transparent transform -skew-x-12 animate-metallic-shine" />
          </div>
        </div>
        
        {/* Analytics Initialization */}
        <Script
          id="analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize analytics tracking
              window.__VN_ANALYTICS__ = {
                initialized: false,
                events: []
              };

              // Performance monitoring for 3D scenes
              window.__VN_3D_PERFORMANCE__ = {
                startTime: performance.now(),
                webglSupported: !!window.WebGLRenderingContext,
                webgl2Supported: !!window.WebGL2RenderingContext,
              };

              // Track performance metrics
              window.addEventListener('load', function() {
                if (window.gtag) {
                  const loadTime = performance.now() - window.__VN_3D_PERFORMANCE__.startTime;
                  window.gtag('event', 'page_load_time', {
                    event_category: 'performance',
                    value: Math.round(loadTime),
                    event_label: 'initial_load'
                  });
                }
              });

              // Track luxury customer behavior patterns
              let luxuryEngagementScore = 0;
              const trackLuxuryEngagement = () => {
                luxuryEngagementScore++;
                if (luxuryEngagementScore === 5 && window.gtag) {
                  window.gtag('event', 'high_engagement', {
                    event_category: 'luxury_behavior',
                    event_label: 'engaged_browser'
                  });
                }
              };

              // Track luxury indicators
              document.addEventListener('click', function(e) {
                const target = e.target.closest('[data-luxury-action]');
                if (target) {
                  trackLuxuryEngagement();
                  const action = target.getAttribute('data-luxury-action');
                  if (window.gtag) {
                    window.gtag('event', 'luxury_interaction', {
                      event_category: 'luxury_behavior',
                      event_label: action
                    });
                  }
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}