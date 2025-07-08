// src/components/seo/PerformanceOptimizations.tsx - NEW FILE
'use client';

import { useEffect } from 'react';

export default function PerformanceOptimizations() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload hero images
      const heroImages = [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=600&fit=crop&crop=center'
      ];

      heroImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      // Lazy load collection images
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('blur-sm');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    };

    // Optimize Core Web Vitals
    const optimizeWebVitals = () => {
      // Reduce layout shift by setting image dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.naturalWidth && imgElement.naturalHeight) {
          imgElement.setAttribute('width', imgElement.naturalWidth.toString());
          imgElement.setAttribute('height', imgElement.naturalHeight.toString());
        }
      });

      // Optimize font loading
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.body.classList.add('fonts-loaded');
        });
      }
    };

    // Critical resource hints
    const addResourceHints = () => {
      const hints = [
        { rel: 'dns-prefetch', href: '//images.unsplash.com' },
        { rel: 'dns-prefetch', href: '//cdn.shopify.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
      ];

      hints.forEach(hint => {
        const existing = document.querySelector(`link[href="${hint.href}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = hint.rel;
          link.href = hint.href;
          if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
          document.head.appendChild(link);
        }
      });
    };

    // Service Worker for caching (optional)
    // const registerServiceWorker = () => {
    //   if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    //     window.addEventListener('load', () => {
    //       navigator.serviceWorker.register('/sw.js')
    //         .then(registration => {
    //           console.log('SW registered: ', registration);
    //         })
    //         .catch(registrationError => {
    //           console.log('SW registration failed: ', registrationError);
    //         });
    //     });
    //   }
    // };

    // Execute optimizations
    preloadCriticalResources();
    lazyLoadResources();
    optimizeWebVitals();
    addResourceHints();
    // registerServiceWorker(); // Uncomment if you want SW caching

    // Cleanup
    return () => {
      // Remove observers if component unmounts
    };
  }, []);

  return null; // This component doesn't render anything
}

// src/lib/seo-utils.ts - NEW FILE
// Additional SEO utility functions

export const generateBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: '/' }];
  
  let currentPath = '';
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const name = path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({
      name: name.replace('-', ' '),
      url: currentPath
    });
  });
  
  return breadcrumbs;
};

export const optimizeImageSrc = (src: string, width: number, height?: number, quality = 80) => {
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('auto', 'format');
    return url.toString();
  }
  return src;
};

export const getOptimizedImageSizes = (maxWidth: number) => {
  return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${maxWidth}px`;
};

// Schema.org markup generators
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateReviewSchema = (productName: string, reviews: Array<{
  author: string,
  rating: number,
  reviewBody: string,
  datePublished: string
}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": 5
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      "reviewCount": reviews.length,
      "bestRating": 5,
      "worstRating": 1
    }
  };
};