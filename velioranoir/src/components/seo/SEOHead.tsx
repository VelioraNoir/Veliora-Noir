// src/components/seo/SEOHead.tsx - NEW FILE
import Head from 'next/head';
import { SEOConfig, defaultSEO } from '../../lib/seo';

interface SEOHeadProps {
  config?: Partial<SEOConfig>;
  jsonLd?: object | object[];
}

export default function SEOHead({ config = {}, jsonLd }: SEOHeadProps) {
  const seoConfig = { ...defaultSEO, ...config };
  
  const canonical = seoConfig.canonical || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      {seoConfig.keywords && (
        <meta name="keywords" content={seoConfig.keywords.join(', ')} />
      )}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={seoConfig.ogType || 'website'} />
      <meta property="og:title" content={seoConfig.title} />
      <meta property="og:description" content={seoConfig.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Veliora Noir" />
      <meta property="og:locale" content="en_US" />
      {seoConfig.ogImage && (
        <>
          <meta property="og:image" content={seoConfig.ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={seoConfig.title} />
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={seoConfig.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.description} />
      {seoConfig.ogImage && (
        <meta name="twitter:image" content={seoConfig.ogImage} />
      )}
      
      {/* Additional Meta Tags for Luxury Brand */}
      <meta name="author" content="Veliora Noir" />
      <meta name="application-name" content="Veliora Noir" />
      <meta name="theme-color" content="#d4af37" />
      <meta name="apple-mobile-web-app-title" content="Veliora Noir" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Luxury Brand Specific Meta */}
      <meta name="product-type" content="Luxury Jewelry" />
      <meta name="price-range" content="$50-$500" />
      <meta name="target-audience" content="Luxury consumers, jewelry enthusiasts" />
      
      {/* Preload Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
          }}
        />
      )}
    </Head>
  );
}