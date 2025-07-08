// Analytics and tracking utilities for Veliora Noir

// Add at top of file (or in a shared types file)
interface GA4Params extends Record<string, unknown> {
  label?: string;
  value?: number;
}


declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    ttq: {
      track: (eventName: string, parameters?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
    dataLayer: unknown[];
    _hsq: unknown[];
  }
}

// Google Analytics 4 Events
export const trackGA4Event = (
  eventName: string,
  parameters: GA4Params = {}
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    // extract label/value safely from typed parameters
    const { label = '', value = 0, ...rest } = parameters;

    window.gtag('event', eventName, {
      event_category: 'engagement',
      event_label: label,
      value,
      ...rest,
    });
  }
};
// Facebook Pixel Events
export const trackFacebookEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// TikTok Pixel Events
export const trackTikTokEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track(eventName, parameters);
  }
};

// HubSpot Events
export const trackHubSpotEvent = (
  eventId: string,
  properties: Record<string, unknown> = {}
) => {
  if (typeof window !== 'undefined' && window._hsq) {
    window._hsq.push(['trackEvent', { id: eventId, value: properties }]);
  }
};

// Combined tracking for all platforms
export const trackEvent = (
  eventName: string,
  data: Record<string, unknown> = {}
) => {
  const eventData = {
    timestamp: new Date().toISOString(),
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    ...data,
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
  trackEvent,

  newsletterSignup: (email: string, source: string = 'website') => {
    trackEvent('subscribe', {
      method: 'email',
      email_hash: btoa(email),
      source,
      event_label: 'newsletter_signup',
    });

    trackFacebookEvent('Lead', {
      content_name: 'Newsletter Signup',
      content_category: 'Email Marketing',
      value: 1.0,
      currency: 'USD',
    });

    trackTikTokEvent('Subscribe', {
      content_type: 'newsletter',
      value: 1.0,
      currency: 'USD',
    });
  },

  contactFormSubmit: (inquiryType: string) => {
    trackEvent('contact_form_submit', {
      inquiry_type: inquiryType,
      form_name: 'main_contact',
      event_label: `contact_${inquiryType}`,
    });

    trackFacebookEvent('Lead', {
      content_name: 'Contact Form',
      content_category: inquiryType,
      value: 5.0,
      currency: 'USD',
    });

    trackTikTokEvent('Contact', {
      content_type: inquiryType,
      value: 5.0,
      currency: 'USD',
    });
  },

  productView: (
    productId: string,
    productName: string,
    price: string,
    category: string
  ) => {
    trackEvent('view_item', {
      item_id: productId,
      item_name: productName,
      price: parseFloat(price),
      item_category: category,
      currency: 'USD',
    });

    trackFacebookEvent('ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: parseFloat(price),
      currency: 'USD',
    });

    trackTikTokEvent('ViewContent', {
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value: parseFloat(price),
      currency: 'USD',
    });
  },

  addToCart: (
    productId: string,
    productName: string,
    price: string,
    quantity: number = 1
  ) => {
    const value = parseFloat(price) * quantity;

    trackEvent('add_to_cart', {
      item_id: productId,
      item_name: productName,
      price: parseFloat(price),
      quantity,
      value,
      currency: 'USD',
    });

    trackFacebookEvent('AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value,
      currency: 'USD',
    });

    trackTikTokEvent('AddToCart', {
      content_id: productId,
      content_name: productName,
      content_type: 'product',
      value,
      currency: 'USD',
    });
  },

  initiateCheckout: (
    items: Array<{ id: string }>,
    totalValue: number
  ) => {
    trackEvent('begin_checkout', {
      value: totalValue,
      currency: 'USD',
      items,
    });

    trackFacebookEvent('InitiateCheckout', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: items.length,
    });

    trackTikTokEvent('ClickButton', {
      content_type: 'checkout',
      value: totalValue,
      currency: 'USD',
    });
  },

  purchase: (
    orderId: string,
    items: Array<{ id: string }>,
    totalValue: number,
    customerEmail?: string
  ) => {
    trackEvent('purchase', {
      transaction_id: orderId,
      value: totalValue,
      currency: 'USD',
      items,
      customer_email_hash: customerEmail ? btoa(customerEmail) : undefined,
    });

    trackFacebookEvent('Purchase', {
      content_ids: items.map(item => item.id),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
      num_items: items.length,
    });

    trackTikTokEvent('CompletePayment', {
      content_id: items.map(item => item.id).join(','),
      content_type: 'product',
      value: totalValue,
      currency: 'USD',
    });
  },

  search: (searchTerm: string, resultCount: number = 0) => {
    trackEvent('search', {
      search_term: searchTerm,
      result_count: resultCount,
      event_label: 'product_search',
    });

    trackFacebookEvent('Search', {
      content_type: 'product',
      search_string: searchTerm,
    });
  },

  viewCategory: (categoryName: string, itemCount: number = 0) => {
    trackEvent('view_item_list', {
      item_list_name: categoryName,
      item_count: itemCount,
      event_label: `category_${categoryName.toLowerCase()}`,
    });
  },

  use3DViewer: (productId: string, materialChanged: boolean = false) => {
    trackEvent('3d_viewer_interaction', {
      item_id: productId,
      interaction_type: materialChanged ? 'material_change' : 'view',
      event_label: '3d_engagement',
    });
  },

  pageView: (pageName: string, pageCategory: string = 'general') => {
    trackEvent('page_view', {
      page_title: pageName,
      page_category: pageCategory,
      event_label: `page_${pageName.toLowerCase().replace(/\s+/g, '_')}`,
    });
  },

  presaleInterest: (email: string, source: string = 'banner') => {
    trackEvent('presale_interest', {
      source,
      email_hash: btoa(email),
      event_label: 'presale_signup',
    });

    trackFacebookEvent('Lead', {
      content_name: 'Presale Interest',
      content_category: 'Presale',
      value: 10.0,
      currency: 'USD',
    });
  },
};

export const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;

  analytics.pageView(document.title, 'home');

  let scrollTracked = false;
  const trackScrollDepth = () => {
    if (scrollTracked) return;

    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercent >= 75) {
      trackEvent('scroll_depth', {
        scroll_depth: scrollPercent,
        event_label: 'engagement_scroll',
      });
      scrollTracked = true;
    }
  };

  window.addEventListener('scroll', trackScrollDepth, { passive: true });

  setTimeout(() => {
    trackEvent('time_on_page', {
      time_seconds: 30,
      event_label: 'engagement_time',
    });
  }, 30000);
};

export default analytics;
