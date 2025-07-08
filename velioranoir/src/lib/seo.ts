// src/lib/seo.ts - NEW FILE
// SEO utilities and configuration for Veliora Noir
import type { Product } from './shopify';

// Add this alongside your imports or at the top of the file
interface MetaTag {
  name?: string;
  content?: string;
  property?: string;
  rel?: 'canonical';
  href?: string;
}


export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  jsonLd?: object;
}

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: "Veliora Noir - Luxury Metallic Accessories & Handcrafted Jewelry",
  description: "Discover our exquisite collection of handcrafted metallic accessories. Premium rings, necklaces, bracelets & earrings with timeless elegance and contemporary sophistication.",
  keywords: [
    "luxury jewelry",
    "metallic accessories", 
    "handcrafted jewelry",
    "premium rings",
    "gold necklaces",
    "silver bracelets",
    "designer earrings",
    "luxury accessories",
    "fine jewelry",
    "artisan jewelry"
  ],
  ogType: "website",
  twitterCard: "summary_large_image",
  ogImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=630&fit=crop&crop=center"
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: "Veliora Noir - Luxury Metallic Accessories & Handcrafted Jewelry",
    description: "Discover our exquisite collection of handcrafted metallic accessories. Premium rings, necklaces, bracelets & earrings with timeless elegance.",
    keywords: ["luxury jewelry", "handcrafted accessories", "premium metallic jewelry", "designer jewelry collection"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Veliora Noir",
      "description": "Luxury metallic accessories and handcrafted jewelry",
      "url": "https://velioranoir.com",
      "logo": "https://velioranoir.com/logo.png",
      "sameAs": [
        "https://instagram.com/velioranoir",
        "https://facebook.com/velioranoir"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "hello@velioranoir.com"
      }
    }
  },
  
  collections: {
    title: "Luxury Jewelry Collections - Rings, Necklaces, Bracelets & Earrings | Veliora Noir",
    description: "Browse our curated collections of luxury metallic accessories. Premium rings, elegant necklaces, sophisticated bracelets, and stunning earrings.",
    keywords: ["jewelry collections", "luxury rings", "designer necklaces", "premium bracelets", "elegant earrings"]
  },
  
  rings: {
    title: "Luxury Rings - Premium Metallic Bands & Statement Pieces | Veliora Noir", 
    description: "Discover our exquisite ring collection featuring minimalist bands to statement pieces in gold, silver, and platinum finishes.",
    keywords: ["luxury rings", "gold rings", "silver rings", "platinum rings", "designer rings", "statement rings"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Luxury Rings Collection",
      "description": "Premium metallic rings with sophisticated design",
      "url": "https://velioranoir.com/collections/rings"
    }
  },
  
  necklaces: {
    title: "Designer Necklaces - Elegant Chains & Statement Pendants | Veliora Noir",
    description: "Elegant necklaces and chains that grace the neckline with timeless beauty. Gold, silver, and platinum designs for every occasion.",
    keywords: ["designer necklaces", "luxury chains", "gold necklaces", "silver necklaces", "pendant necklaces"],
    jsonLd: {
      "@context": "https://schema.org", 
      "@type": "CollectionPage",
      "name": "Designer Necklaces Collection",
      "description": "Elegant chains and pendants with contemporary appeal",
      "url": "https://velioranoir.com/collections/necklaces"
    }
  },
  
  bracelets: {
    title: "Luxury Bracelets - Refined Wrist Accessories & Metallic Designs | Veliora Noir",
    description: "Sophisticated bracelet collection featuring metallic artistry with modern elegance. Adjustable sizing and premium finishes.",
    keywords: ["luxury bracelets", "gold bracelets", "silver bracelets", "designer wrist accessories", "metallic bracelets"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage", 
      "name": "Luxury Bracelets Collection",
      "description": "Refined wrist accessories with metallic artistry",
      "url": "https://velioranoir.com/collections/bracelets"
    }
  },
  
  earrings: {
    title: "Designer Earrings - Statement & Subtle Luxury Pieces | Veliora Noir",
    description: "From subtle studs to statement drops, our earring collection adds the perfect finishing touch to any ensemble with hypoallergenic posts.",
    keywords: ["designer earrings", "luxury earrings", "gold earrings", "silver earrings", "statement earrings", "stud earrings"],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Designer Earrings Collection", 
      "description": "Statement and subtle pieces for every occasion",
      "url": "https://velioranoir.com/collections/earrings"
    }
  },
  
  about: {
    title: "Our Story - Luxury Jewelry Brand | Veliora Noir",
    description: "Learn about Veliora Noir's mission to create accessible luxury through handcrafted metallic accessories. Our commitment to quality and elegance.",
    keywords: ["luxury jewelry brand", "handcrafted jewelry", "jewelry artisans", "luxury brand story"]
  },
  
  contact: {
    title: "Contact Us - Customer Service & Inquiries | Veliora Noir", 
    description: "Get in touch with our customer service team. Questions about our luxury jewelry collections, sizing, or custom inquiries welcome.",
    keywords: ["jewelry customer service", "luxury jewelry inquiries", "custom jewelry", "jewelry consultation"]
  }
};

// Generate JSON-LD structured data for products
export const generateProductJsonLd = (product: Product) => {
  const variant = product.variants[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.images.map(img => img.src),
    "brand": {
      "@type": "Brand", 
      "name": "Veliora Noir"
    },
    "category": product.productType || "Jewelry",
    "offers": {
      "@type": "Offer",
      "price": variant?.price || "0",
      "priceCurrency": "USD",
      "availability": variant?.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Veliora Noir"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbJsonLd = (breadcrumbs: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// SEO utility functions
export const generateMetaTags = (config: SEOConfig) => {
    const tags: MetaTag[] = [
    { name: "description", content: config.description },
    // … other tags
    { name: "description", content: config.description },
    { name: "keywords", content: config.keywords?.join(", ") || "" },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:type", content: config.ogType || "website" },
    { property: "og:image", content: config.ogImage || defaultSEO.ogImage },
    { name: "twitter:card", content: config.twitterCard || "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: config.ogImage || defaultSEO.ogImage }
  ];
 
  
  if (config.canonical) {
    tags.push({ rel: "canonical", href: config.canonical });
  }
  
  return tags;
};

// Local business structured data for contact page
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Veliora Noir",
  "description": "Luxury metallic accessories and handcrafted jewelry",
  "url": "https://velioranoir.com",
  "telephone": "",
  "email": "hello@velioranoir.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "New York",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "$50-$500"
};