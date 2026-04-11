import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Product } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';

const ProductListing = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const dynamicProducts = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string | null>(null);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Dynamically derive categories from active products
  const categories = useMemo(() => {
    const cats = new Set(dynamicProducts.map(p => p.category.toLowerCase()));
    const list = [
      { id: 'all', name: 'All Collection' },
      ...Array.from(cats).map(cat => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    ];
    return list;
  }, [dynamicProducts]);

  // Dynamically derive finishes and materials
  const finishes = useMemo(() => Array.from(new Set(dynamicProducts.map(p => p.finish).filter(Boolean))), [dynamicProducts]);
  const materials = useMemo(() => Array.from(new Set(dynamicProducts.map(p => p.material).filter(Boolean))), [dynamicProducts]);
  const dimensions = useMemo(() => Array.from(new Set(dynamicProducts.map(p => p.dimensions).filter(Boolean))), [dynamicProducts]);

  const allowedCategoryIds = useMemo(() => new Set(categories.map(c => c.id)), [categories]);

  useEffect(() => {
    if (urlCategory) {
      const normalized = urlCategory.toLowerCase();
      if (allowedCategoryIds.size > 1 && !allowedCategoryIds.has(normalized)) {
        navigate('/products', { replace: true });
        return;
      }
      setSelectedCategory(normalized);
    } else {
      setSelectedCategory('all');
    }
  }, [urlCategory, navigate, allowedCategoryIds]);

  const filteredProducts = useMemo(() => {
    return dynamicProducts.filter((product) => {
      const isActive = (product.status || 'Active') === 'Active';
      const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFinish = !selectedFinish || product.finish === selectedFinish;
      const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
      const matchesDimensions = !selectedDimensions || product.dimensions === selectedDimensions;
      const matchesFeatured = !showOnlyFeatured || product.featured === true;
      
      return isActive && matchesCategory && matchesSearch && matchesFinish && matchesMaterial && matchesDimensions && matchesFeatured;
    });
  }, [dynamicProducts, selectedCategory, searchQuery, selectedFinish, selectedMaterial]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      navigate('/products');
    } else {
      navigate(`/products/${catId}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFinish(null);
    setSelectedMaterial(null);
    setSelectedDimensions(null);
    setShowOnlyFeatured(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">

      <section className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-premium-charcoal/10 pb-8">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-3xl md:text-4xl">Products</h1>
            <div className="w-12 h-[1px] bg-premium-charcoal/15 hidden md:block" />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-charcoal/40 group-focus-within:text-premium-charcoal transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-premium-charcoal/10 focus:border-premium-charcoal focus:outline-none text-[13px] w-full md:w-64 transition-all"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-2 border border-premium-charcoal text-[11px] uppercase tracking-widest font-bold transition-all
                ${isFilterOpen ? 'bg-premium-charcoal text-white' : 'hover:bg-premium-charcoal/5'}
              `}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategory !== 'all' || selectedFinish || selectedMaterial || selectedDimensions || showOnlyFeatured) && (
                <span className="w-2 h-2 bg-premium-royal rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Filters Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white/30 backdrop-blur-sm border-x border-b border-premium-charcoal/10"
            >
                <div>
                  <h4 className="premium-subheading mb-4">By Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`px-3 py-1 text-[10px] border transition-all uppercase tracking-widest
                          ${selectedCategory === cat.id 
                            ? 'border-premium-charcoal bg-premium-charcoal text-white' 
                            : 'border-premium-charcoal/10 hover:border-premium-charcoal'}
                        `}
                      >
                        {cat.name.replace('All Collection', 'All')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="premium-subheading mb-4">By Finish</h4>
                  <div className="flex flex-wrap gap-2">
                    {finishes.map((f: string) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFinish(selectedFinish === f ? null : f)}
                        className={`px-3 py-1 text-[10px] border transition-all uppercase tracking-widest
                          ${selectedFinish === f 
                            ? 'border-premium-charcoal bg-premium-charcoal text-white' 
                            : 'border-premium-charcoal/10 hover:border-premium-charcoal'}
                        `}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="premium-subheading mb-4">By Material</h4>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m: string) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMaterial(selectedMaterial === m ? null : m)}
                        className={`px-3 py-1 text-[10px] border transition-all uppercase tracking-widest
                          ${selectedMaterial === m 
                            ? 'border-premium-charcoal bg-premium-charcoal text-white' 
                            : 'border-premium-charcoal/10 hover:border-premium-charcoal'}
                        `}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="premium-subheading mb-4">By Dimensions</h4>
                  <div className="flex flex-wrap gap-2">
                    {dimensions.map((d: string) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDimensions(selectedDimensions === d ? null : d)}
                        className={`px-3 py-1 text-[10px] border transition-all uppercase tracking-widest
                          ${selectedDimensions === d 
                            ? 'border-premium-charcoal bg-premium-charcoal text-white' 
                            : 'border-premium-charcoal/10 hover:border-premium-charcoal'}
                        `}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="premium-subheading mb-4">Special</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                      className={`px-4 py-2 text-[10px] border transition-all uppercase tracking-widest font-bold
                        ${showOnlyFeatured 
                          ? 'border-premium-royal bg-premium-royal text-white' 
                          : 'border-premium-charcoal/10 hover:border-premium-royal text-premium-charcoal/60'}
                      `}
                    >
                      ★ Featured Only
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-6 mt-4 pt-6 border-t border-premium-charcoal/10">
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-widest font-bold text-premium-charcoal/40 hover:text-red-600 flex items-center gap-2 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-[10px] uppercase tracking-widest font-bold text-premium-charcoal hover:text-premium-royal transition-colors"
                  >
                    Close
                  </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <p className="text-[12px] text-premium-charcoal/50 font-medium">
          Showing {displayedProducts.length} of {filteredProducts.length} Results
        </p>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {displayedProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="premium-card overflow-hidden relative aspect-[4/5] mb-6">
                      <img
                        src={product.image || (product.images && product.images[0]) || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-premium-charcoal/0 group-hover:bg-premium-charcoal/10 transition-colors duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] font-bold">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-xl group-hover:text-premium-royal transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-[13px] text-premium-charcoal/60 font-light line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex gap-4 pt-2 text-[10px] uppercase tracking-widest text-premium-charcoal/40 font-bold">
                      <span>{product.finish}</span>
                      <span className="w-1 h-1 bg-premium-charcoal/20 rounded-full my-auto"></span>
                      <span>{product.material}</span>
                    </div>
                    <div className="pt-4">
                      <Link 
                        to={`/product/${product.id}`}
                        className="inline-block text-[11px] uppercase tracking-[0.2em] font-bold border-b border-premium-charcoal pb-1 hover:text-premium-royal hover:border-premium-royal transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl mb-2">No products found</h3>
            <p className="text-premium-charcoal/40 font-light">Try adjusting your filters or search keywords.</p>
            <button
              onClick={clearFilters}
              className="mt-6 premium-btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-20 text-center">
            <button
              onClick={() => setVisibleCount((prev: number) => prev + 6)}
              className="premium-btn-outline group relative overflow-hidden"
            >
              <span className="relative z-10">Load More Collection</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductListing;
