// src/lib/analytics.ts - NEW FILE
// Analytics and tracking utilities for Veliora Noir

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    ttq: {
      track: (eventName: string, parameters?: Record<string, any>) => void;
      [key: string]: any;
    };
    dataLayer: any[];
    _hsq: any[];
  }
}

// Google Analytics 4 Events
export const trackGA4Event = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      ...parameters
    });
  }
};

// Facebook Pixel Events
export const trackFacebookEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// TikTok Pixel Events
export const trackTikTokEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, parameters);
  }
};

// HubSpot Events
export const trackHubSpotEvent = (eventId: string, properties: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window._hsq) {
    window._hsq.push(['trackEvent', {
      id: eventId,
      value: properties
    }]);
  }
};

// Combined tracking for all platforms
export const trackEvent = (eventName: string, data: Record<string, any> = {}) => {
  const eventData = {
    timestamp: new Date().toISOString(),
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    ...data
  };

  // Track on all platforms
  trackGA4Event(eventName, eventData);
  trackFacebookEvent(eventName, eventData);
  trackTikTokEvent(eventName, eventData);
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Event Tracked: ${eventName}`, eventData);
  }
};

// Specific luxury jewelry business events
export const analytics = {
  // Newsletter and email events
  trackEvent,

  newsletterSignup: (email: string, source: string = 'website') => {
    trackEvent('subscribe', {
      method: 'email',
      email_hash: btoa(email), // Hash for privacy
      source: source,
      event_label: 'newsletter_signup'
    });
    
    // Facebook Custom Event for retargeting
    trackFacebookEvent('Lead', {
      content_name: 'Newsletter Signup',
      content_category: 'Email Marketing',
      value: 1.00,
      currency: 'USD'
    });
    
    // TikTok Lead Event
    trackTikTokEvent('Subscribe', {
      content_type: 'newsletter',
      value: 1.00,
      currency: 'USD'
    });
  },

  // Contact form submissions
  contactFormSubmit: (inquiryType: string, name: string) => {
    trackEvent('contact_form_submit', {
      inquiry_type: inquiryType,
      form_name: 'main_contact',
      event_label: `contact_${inquiryType}`
    });
    
    // Facebook Lead Event
    trackFacebookEvent('Lead', {
      content_name: 'Contact Form',
      content_category: inquiryType,
      value: 5.00, // Higher value for contact leads
      currency: 'USD'
    });
    
    // TikTok Contact Event
    trackTikTokEvent('Contact', {
      content_type: inquiryType,
      value: 5.00,
      currency: 'USD'
    });
  },

  // Product interactions
  productView: (productId: string, productName: string, price: string, category: string) => {
    trackEvent('view_item', {
      item_id: productId,
      item_name: productName,
      price: parseFloat(price),
      item_category: category,
      currency: 'USD'
    });
    
    // Facebook ViewContent
    trackFacebookEvent('ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: parseFloat(price),
      currency: 'USD'
    });
    
    // TikTok ViewContent
    trackTikTokEvent('ViewContent', {
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value: parseFloat(price),
      currency: 'USD'
    });
  },

  // Add to cart events
  addToCart: (productId: string, productName: string, price: string, quantity: number = 1) => {
    const value = parseFloat(price) * quantity;
    
    trackEvent('add_to_cart', {
      item_id: productId,
      item_name: productName,
      price: parseFloat(price),
      quantity: quantity,
      value: value,
      currency: 'USD'
    });
    
    // Facebook AddToCart
    trackFacebookEvent('AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: 'USD'
    });
    
    // TikTok AddToCart
    trackTikTokEvent('AddToCart', {
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value: value,
      currency: 'USD'
    });
  },

  // Checkout events
  initiateCheckout: (items: any[], totalValue: number) => {
    trackEvent('begin_checkout', {
      value: totalValue,
      currency: 'USD',
      items: items
    });
    
    // Facebook InitiateCheckout
    trackFacebookEvent('InitiateCheckout', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: items.length
    });
    
    // TikTok ClickButton (checkout)
    trackTikTokEvent('ClickButton', {
      content_type: 'checkout',
      value: totalValue,
      currency: 'USD'
    });
  },

  // Purchase events (for Shopify webhook integration)
  purchase: (orderId: string, items: any[], totalValue: number, customerEmail?: string) => {
    trackEvent('purchase', {
      transaction_id: orderId,
      value: totalValue,
      currency: 'USD',
      items: items,
      customer_email_hash: customerEmail ? btoa(customerEmail) : undefined
    });
    
    // Facebook Purchase
    trackFacebookEvent('Purchase', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: items.length
    });
    
    // TikTok CompletePayment
    trackTikTokEvent('CompletePayment', {
      content_id: items.map(item => item.id).join(','),
      content_type: 'product',
      value: totalValue,
      currency: 'USD'
    });
  },

  // Search events
  search: (searchTerm: string, resultCount: number = 0) => {
    trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount,
      event_label: 'product_search'
    });
    
    // Facebook Search
    trackFacebookEvent('Search', {
      content_type: 'product',
      search_string: searchTerm
    });
  },

  // Collection/category views
  viewCategory: (categoryName: string, itemCount: number = 0) => {
    trackEvent('view_item_list', {
      item_list_name: categoryName,
      item_count: itemCount,
      event_label: `category_${categoryName.toLowerCase()}`
    });
  },

  // 3D viewer interactions
  use3DViewer: (productId: string, materialChanged: boolean = false) => {
    trackEvent('3d_viewer_interaction', {
      item_id: productId,
      interaction_type: materialChanged ? 'material_change' : 'view',
      event_label: '3d_engagement'
    });
  },

  // Page views (for luxury customer journey tracking)
  pageView: (pageName: string, pageCategory: string = 'general') => {
    trackEvent('page_view', {
      page_title: pageName,
      page_category: pageCategory,
      event_label: `page_${pageName.toLowerCase().replace(/\s+/g, '_')}`
    });
  },

  // Presale specific events
  presaleInterest: (email: string, source: string = 'banner') => {
    trackEvent('presale_interest', {
      source: source,
      email_hash: btoa(email),
      event_label: 'presale_signup'
    });
    
    // Facebook Custom Event for presale retargeting
    trackFacebookEvent('Lead', {
      content_name: 'Presale Interest',
      content_category: 'Presale',
      value: 10.00, // High value for presale leads
      currency: 'USD'
    });
  }
};

// Initialize tracking on page load
export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  // Track initial page view
  analytics.pageView(document.title, 'home');
  
  // Set up scroll depth tracking
  let scrollTracked = false;
  const trackScrollDepth = () => {
    if (scrollTracked) return;
    
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent >= 75) {
      trackEvent('scroll_depth', {
        scroll_depth: scrollPercent,
        event_label: 'engagement_scroll'
      });
      scrollTracked = true;
    }
  };
  
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  
  // Track time on page (after 30 seconds)
  setTimeout(() => {
    trackEvent('time_on_page', {
      time_seconds: 30,
      event_label: 'engagement_time'
    });
  }, 30000);
};

export default analytics;