// src/components/ui/SearchModal.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  // ─── Stable handleClose ────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    const sessionDuration = Date.now() - searchStartTime.current;
    analytics.trackEvent('search_session_end', {
      session_duration_ms: sessionDuration,
      final_query: searchQuery,
      results_viewed: filteredProducts.length,
      query_attempts: searchQuery ? 1 : 0,
      converted: false
    });
    setSearchQuery('');
    onClose();
  }, [searchQuery, filteredProducts.length, onClose]);

  // Load products when modal opens
  useEffect(() => {
    const loadProducts = async () => {
      if (isOpen && products.length === 0) {
        setLoading(true);
        try {
          const fetchedProducts = await getAllProductsWithFallback();
          setProducts(fetchedProducts);
          analytics.trackEvent('search_modal_open', {
            products_available: fetchedProducts.length,
            user_intent: 'product_discovery'
          });
        } catch (error) {
          console.error('Error loading products for search:', error);
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
      analytics.trackEvent('search_session_start', {
        source: 'search_modal',
        input_method: 'keyboard'
      });
    }
  }, [isOpen]);

  // Filter products on query change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.productType?.toLowerCase().includes(q) ||
      product.vendor?.toLowerCase().includes(q) ||
      product.tags.some(tag => tag.toLowerCase().includes(q))
    );
    setFilteredProducts(filtered);
    analytics.search(searchQuery, filtered.length);
    analytics.trackEvent('search_query_analysis', {
      query: searchQuery,
      query_length: searchQuery.length,
      results_count: filtered.length,
      search_type: getSearchType(searchQuery),
      has_results: filtered.length > 0
    });
  }, [searchQuery, products]);

  // Escape key closes modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [isOpen, handleClose]);  // ← now includes handleClose

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSearchType = (query: string) => {
    const q = query.toLowerCase();
    if (['gold','silver','platinum','copper'].some(m=>q.includes(m))) return 'material_search';
    if (['ring','necklace','bracelet','earring'].some(t=>q.includes(t))) return 'category_search';
    if (q.includes('$')||/\d/.test(q)) return 'price_search';
    return 'general_search';
  };

  const handleProductClick = (product: Product) => {
    analytics.trackEvent('search_result_click', {
      product_id: product.id,
      product_name: product.title,
      search_query: searchQuery,
      result_position: filteredProducts.findIndex(p => p.id===product.id)+1,
      total_results: filteredProducts.length,
      search_to_click_time: Date.now() - searchStartTime.current
    });
    analytics.trackEvent('search_conversion', {
      search_query: searchQuery,
      product_selected: product.title,
      conversion_type: 'product_view'
    });
    const price = parseFloat(product.variants[0]?.price || '0');
    if (price > 200) {
      analytics.trackEvent('luxury_search_conversion', {
        product_value: price,
        search_intent: 'high_value_browsing'
      });
    }
    handleClose();
  };

//   const handleQuickCategoryClick = (category: string) => {
//     analytics.trackEvent('search_quick_category_click', {
//       category,
//       user_behavior: 'guided_search'
//     });
//     setSearchQuery(category.toLowerCase());
//     inputRef.current?.focus();
//   };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length === 1) {
      analytics.trackEvent('search_input_start', {
        first_character: val,
        input_method: 'typing'
      });
    }
    if (val.length >= 3 && val.length % 3 === 0) {
      analytics.trackEvent('search_input_progress', {
        query_length: val.length,
        partial_query: val.substring(0,10),
        engagement_level: 'active_searching'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
        {/* input */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for jewelry, collections, or materials..."
              className="w-full pl-12 pr-12 py-4 text-lg bg-gray-50 rounded-xl focus:outline-none"
              data-luxury-action="search_input"
            />
            <button
              onClick={handleClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              data-luxury-action="search_close"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
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
              <p className="text-gray-600 mb-4">Try searching for &quot;rings&quot;, &quot;necklaces&quot;, or &quot;gold&quot;</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['rings','necklaces','gold','silver'].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setSearchQuery(s);
                      analytics.trackEvent('search_no_results_suggestion_click', {
                        original_query: searchQuery,
                        suggestion_clicked: s
                      });
                    }}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    data-luxury-action="search_suggestion"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {filteredProducts.map((product, idx) => (
                <Link
                  key={product.id}
                  href={`/products/${encodeURIComponent(product.id)}`}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
                  data-luxury-action="search_result_click"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0].altText || product.title}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-medium text-gray-900">{product.title}</h4>
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
                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* Quick Actions & Stats omitted for brevity */}
      </div>
    </div>
  );
}
