import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type Product } from '../../data/products';
import { categoryPages, type CategorySlug } from '../../data/categoryPages';
import { useProducts } from '../../hooks/useProducts';

type FilterState = {
  search: string;
  finish: string | null;
  material: string | null;
};

const normalizeCategory = (value: string) => value.trim().toLowerCase();

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
      className="group"
    >
      <div className="premium-card overflow-hidden transition-all duration-500 hover:-translate-y-1">
        <div className="relative aspect-[4/5] bg-premium-ivory overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-premium-charcoal/0 group-hover:bg-premium-charcoal/10 transition-colors duration-500" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-[0.2em] font-bold text-premium-charcoal">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="font-serif text-2xl leading-tight group-hover:text-premium-royal transition-colors">
            {product.name}
          </h3>
          <p className="text-[13px] text-premium-charcoal/60 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-premium-charcoal/40 font-bold">
            <span>{product.finish}</span>
            <span className="opacity-30">•</span>
            <span>{product.material}</span>
          </div>

          <div className="pt-2">
            <Link
              to={`/product/${product.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 uppercase text-[11px] tracking-[0.2em] font-bold border border-premium-charcoal/20 text-premium-charcoal hover:bg-premium-charcoal hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_18px_rgba(201,162,39,0.25)] w-full"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="premium-card overflow-hidden animate-pulse">
      <div className="relative aspect-[4/5] bg-premium-ivory overflow-hidden">
        <div className="absolute inset-0 bg-premium-charcoal/5" />
      </div>
      <div className="p-6 space-y-3">
        <div className="h-5 bg-premium-charcoal/10 rounded w-3/4" />
        <div className="h-4 bg-premium-charcoal/10 rounded w-full" />
        <div className="h-4 bg-premium-charcoal/10 rounded w-2/3" />
        <div className="h-11 bg-premium-charcoal/10 rounded w-full" />
      </div>
    </div>
  );
};

const CategoryProductsPage: React.FC<{ slug: CategorySlug }> = ({ slug }) => {
  const navigate = useNavigate();
  const config = categoryPages[slug];
  const dynamicProducts = useProducts();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    finish: null,
    material: null,
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    search: '',
    finish: null,
    material: null,
  });

  const noProductsToastId = useRef(`cat-no-products-${slug}`);

  useEffect(() => {
    let t: number | undefined;
    setLoading(true);
    setLoadError(false);

    t = window.setTimeout(() => {
      try {
        if (!config) throw new Error('Missing config');
        setLoading(false);
        // Navigation only: no success toast for page loads.
      } catch (e) {
        setLoadError(true);
        toast.error('Failed to load products', { toastId: `cat-load-error-${slug}` });
      }
    }, 450);

    return () => {
      if (t) window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const allowedProducts = useMemo(() => {
    return dynamicProducts.filter((p) => {
      const inCategory = config.allowedCategories.includes(normalizeCategory(p.category) as any);
      const isActive = (p.status || 'Active') === 'Active';
      return inCategory && isActive;
    });
  }, [config.allowedCategories, dynamicProducts]);

  const availableFinishes = useMemo(() => {
    return Array.from(new Set(allowedProducts.map((p) => p.finish))).sort();
  }, [allowedProducts]);

  const availableMaterials = useMemo(() => {
    return Array.from(new Set(allowedProducts.map((p) => p.material))).sort();
  }, [allowedProducts]);

  const filteredProducts = useMemo(() => {
    const q = appliedFilters.search.trim().toLowerCase();
    return allowedProducts.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesFinish = !appliedFilters.finish || p.finish === appliedFilters.finish;
      const matchesMaterial = !appliedFilters.material || p.material === appliedFilters.material;
      return matchesSearch && matchesFinish && matchesMaterial;
    });
  }, [allowedProducts, appliedFilters]);

  useEffect(() => {
    if (loading || loadError) return;
    if (filteredProducts.length === 0) {
      toast.error('No products found', { toastId: noProductsToastId.current });
    }
  }, [filteredProducts.length, loadError, loading]);

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const cleared = { search: '', finish: null, material: null };
    setFilters(cleared);
    setAppliedFilters(cleared);
  };

  const content = (
    <div className="w-full pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Page Hero Banner */}
      <section className="max-w-7xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-none"
        >
          <div className="absolute inset-0">
            <img
              src={config.hero.imageSrc}
              alt={config.hero.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-premium-charcoal/90 via-premium-charcoal/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-premium-charcoal/70 via-premium-charcoal/20 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(201,162,39,0.22)_0%,transparent_55%)]" />

          <div className="relative z-10 px-2 sm:px-0">
            <div className="max-w-3xl py-14 sm:py-16">
              <p className="premium-subheading text-premium-ivory/90 mb-5">{config.hero.subheading}</p>
              <h1 className="premium-heading text-white text-4xl sm:text-5xl lg:text-7xl leading-[1.05]">
                {config.hero.title}
              </h1>
              <p className="text-white/70 mt-5 text-base sm:text-lg leading-relaxed">
                {config.hero.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 720, behavior: 'smooth' })}
                  className="premium-button !px-10 !py-4 min-w-[220px]"
                >
                  View Products
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/collections')}
                  className="premium-btn-outline !px-10 !py-4 min-w-[220px] hover:drop-shadow-[0_0_18px_rgba(201,162,39,0.25)]"
                >
                  Explore Collections
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Title */}
      <section className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="bg-white/60 backdrop-blur-xs border border-premium-charcoal/5 p-6 sm:p-8"
        >
          <h2 className="premium-heading text-3xl sm:text-4xl">{config.hero.subheading}</h2>
          <p className="text-premium-charcoal/60 mt-3 max-w-2xl font-light leading-relaxed">
            {config.slug === 'collections'
              ? 'Premium groupings curated from our latest fittings and accessories.'
              : 'Curated premium products selected for this category.'}
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="bg-white/60 backdrop-blur-xs border border-premium-charcoal/5 p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="relative w-full sm:w-72">
                <input
                  value={filters.search}
                  onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 bg-white/70 border border-premium-charcoal/10 focus:border-premium-royal focus:outline-none text-[13px] transition-all"
                />
              </div>

              <div className="flex gap-3 items-center">
                <select
                  value={filters.finish ?? ''}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, finish: e.target.value ? e.target.value : null }))
                  }
                  className="px-4 py-3 bg-white/70 border border-premium-charcoal/10 focus:border-premium-royal focus:outline-none text-[13px] transition-all"
                >
                  <option value="">Finish</option>
                  {availableFinishes.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.material ?? ''}
                  onChange={(e) =>
                    setFilters((s) => ({ ...s, material: e.target.value ? e.target.value : null }))
                  }
                  className="px-4 py-3 bg-white/70 border border-premium-charcoal/10 focus:border-premium-royal focus:outline-none text-[13px] transition-all"
                >
                  <option value="">Material</option>
                  {availableMaterials.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={applyFilters} className="premium-button !px-8 !py-3 min-w-[170px]">
                Apply Filters
              </button>
              <button type="button" onClick={clearFilters} className="premium-btn-outline !px-8 !py-3 min-w-[170px]">
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 min-h-[520px]">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : loadError ? (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl mb-2">Failed to load products</h3>
            <p className="text-premium-charcoal/40 font-light">Please try again shortly.</p>
            <button type="button" onClick={() => navigate('/')} className="premium-btn-outline mt-6">
              Return Home
            </button>
          </div>
        ) : (
          <>
            {config.groups?.length ? (
              <div className="space-y-16">
                {config.groups.map((group) => {
                  const groupProducts = filteredProducts.filter((p) =>
                    group.categories.includes(normalizeCategory(p.category) as any)
                  );
                  return (
                    <div key={group.title}>
                      <div className="flex items-end justify-between gap-6 mb-6">
                        <div>
                          <p className="premium-subheading !text-premium-charcoal/50 mb-2">{group.title}</p>
                          {group.description ? (
                            <p className="text-premium-charcoal/60 font-light leading-relaxed">
                              {group.description}
                            </p>
                          ) : null}
                        </div>
                        {/* Keep layout premium and consistent */}
                        <div className="w-12 h-[1px] bg-premium-charcoal/15" />
                      </div>

                      {groupProducts.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                          <AnimatePresence mode="popLayout">
                            {groupProducts.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="py-10 text-premium-charcoal/40 text-center font-light">
                          No products found in this set.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 min-h-[520px]">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="min-h-screen bg-white">{content}</div>
    </motion.div>
  );
};

export default CategoryProductsPage;

