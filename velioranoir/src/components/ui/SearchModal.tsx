// src/components/ui/SearchModal.tsx - REPLACE ENTIRE FILE
'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllProductsWithFallback, Product } from '../../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';
import { analytics } from '../../lib/analytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchStartTime = useRef<number>(0);

  // Load products when modal opens
  useEffect(() => {
    const loadProducts = async () => {
      if (isOpen && products.length === 0) {
        setLoading(true);
        try {
          const fetchedProducts = await getAllProductsWithFallback();
          setProducts(fetchedProducts);
          
          // Track search modal open
          analytics.trackEvent('search_modal_open', {
            products_available: fetchedProducts.length,
            user_intent: 'product_discovery'
          });
          
        } catch (error) {
          console.error('Error loading products for search:', error);
          
          // Track search load error
          analytics.trackEvent('search_products_load_error', {
            error_message: error instanceof Error ? error.message : 'unknown_error'
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadProducts();
  }, [isOpen, products.length]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      searchStartTime.current = Date.now();
      
      // Track search session start
      analytics.trackEvent('search_session_start', {
        source: 'search_modal',
        input_method: 'keyboard'
      });
    }
  }, [isOpen]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.productType?.toLowerCase().includes(query) ||
      product.vendor?.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );

    setFilteredProducts(filtered);
    
    // TRACK SEARCH EVENT
    analytics.search(searchQuery, filtered.length);
    
    // Track search quality and intent
    analytics.trackEvent('search_query_analysis', {
      query: searchQuery,
      query_length: searchQuery.length,
      results_count: filtered.length,
      search_type: getSearchType(searchQuery),
      has_results: filtered.length > 0
    });

  }, [searchQuery, products]);

  // Determine search type for analytics
  const getSearchType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (['gold', 'silver', 'platinum', 'copper'].some(material => lowerQuery.includes(material))) {
      return 'material_search';
    }
    if (['ring', 'necklace', 'bracelet', 'earring'].some(type => lowerQuery.includes(type))) {
      return 'category_search';
    }
    if (lowerQuery.includes('$') || /\d/.test(lowerQuery)) {
      return 'price_search';
    }
    return 'general_search';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    // Track search session end
    const sessionDuration = Date.now() - searchStartTime.current;
    
    analytics.trackEvent('search_session_end', {
      session_duration_ms: sessionDuration,
      final_query: searchQuery,
      results_viewed: filteredProducts.length,
      query_attempts: searchQuery ? 1 : 0,
      converted: false // Will be true if they click a product
    });
    
    setSearchQuery('');
    onClose();
  };

  const handleProductClick = (product: Product) => {
    // Track search result click
    analytics.trackEvent('search_result_click', {
      product_id: product.id,
      product_name: product.title,
      search_query: searchQuery,
      result_position: filteredProducts.findIndex(p => p.id === product.id) + 1,
      total_results: filteredProducts.length,
      search_to_click_time: Date.now() - searchStartTime.current
    });
    
    // Track search conversion
    analytics.trackEvent('search_conversion', {
      search_query: searchQuery,
      product_selected: product.title,
      conversion_type: 'product_view'
    });

    // Track luxury customer behavior
    const productPrice = parseFloat(product.variants[0]?.price || '0');
    if (productPrice > 200) {
      analytics.trackEvent('luxury_search_conversion', {
        product_value: productPrice,
        search_intent: 'high_value_browsing'
      });
    }

    handleClose();
  };

  const handleQuickCategoryClick = (category: string) => {
    // Track quick category usage
    analytics.trackEvent('search_quick_category_click', {
      category: category,
      user_behavior: 'guided_search'
    });
    
    setSearchQuery(category.toLowerCase());
    
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // Track search input behavior
    if (newQuery.length === 1) {
      analytics.trackEvent('search_input_start', {
        first_character: newQuery,
        input_method: 'typing'
      });
    }
    
    if (newQuery.length >= 3 && newQuery.length % 3 === 0) {
      analytics.trackEvent('search_input_progress', {
        query_length: newQuery.length,
        partial_query: newQuery.substring(0, 10), // First 10 chars for privacy
        engagement_level: 'active_searching'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        {/* Search Input */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for jewelry, collections, or materials..."
              className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:outline-none focus:ring-0 bg-gray-50 rounded-xl text-gray-900 placeholder-gray-500"
              data-luxury-action="search_input"
            />
            <button
              onClick={handleClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              data-luxury-action="search_close"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : !searchQuery.trim() ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search our collection</h3>
              <p className="text-gray-600">Find your perfect piece of luxury jewelry</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.94-5.709 2.291" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">Try searching for "rings", "necklaces", or "gold"</p>
              
              {/* Search suggestions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {['rings', 'necklaces', 'gold', 'silver'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      analytics.trackEvent('search_no_results_suggestion_click', {
                        original_query: searchQuery,
                        suggestion_clicked: suggestion
                      });
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                    data-luxury-action="search_suggestion"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${encodeURIComponent(product.id)}`}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  data-luxury-action="search_result_click"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].altText || product.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {product.productType && <span>{product.productType}</span>}
                      {product.vendor && (
                        <>
                          <span>•</span>
                          <span>{product.vendor}</span>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-900">${product.variants[0]?.price}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-xs text-gray-500">#{index + 1}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!searchQuery.trim() && !loading && (
          <div className="p-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">Quick links:</p>
            <div className="flex flex-wrap gap-2">
              {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleQuickCategoryClick(category)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                  data-luxury-action="search_quick_category"
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Popular searches */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['gold rings', 'silver necklace', 'luxury bracelet'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      analytics.trackEvent('search_popular_term_click', {
                        popular_term: term,
                        user_behavior: 'guided_search'
                      });
                    }}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 underline"
                    data-luxury-action="search_popular_term"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search stats for filtered results */}
        {searchQuery.trim() && filteredProducts.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}