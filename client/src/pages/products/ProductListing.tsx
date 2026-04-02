import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { products, Product } from '../../data/products';

const categories = [
  { id: 'all', name: 'All Collection' },
  { id: 'faucets', name: 'Premium Faucets' },
  { id: 'showers', name: 'Luxury Showers' },
  { id: 'mirrors', name: 'Smart Mirrors' },
  { id: 'towel-holders', name: 'Towel Holders' },
  { id: 'accessories', name: 'Accessories' },
];

const finishes = ['Brushed Gold', 'Matte Black', 'Chrome', 'Gunmetal Grey', 'Stainless Steel', 'Marble Texture'];
const materials = ['Solid Brass', 'Stainless Steel', 'High-Definition Glass', 'Zinc Alloy', 'Ceramic'];

const ProductListing = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [urlCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFinish = !selectedFinish || product.finish === selectedFinish;
      const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
      
      return matchesCategory && matchesSearch && matchesFinish && matchesMaterial;
    });
  }, [selectedCategory, searchQuery, selectedFinish, selectedMaterial]);

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
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="premium-subheading mb-4 block">Exquisite Collection</span>
          <h1 className="premium-heading text-5xl md:text-7xl mb-6">Our Products</h1>
          <p className="max-w-2xl mx-auto text-premium-charcoal/60 font-light leading-relaxed">
            Discover our curated range of premium bathroom accessories, designed to transform your 
            private sanctuary into a masterpiece of modern luxury.
          </p>
        </motion.div>
      </section>

      {/* Controls Section */}
      <section className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-premium-charcoal/10 pb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-6 py-2 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 whitespace-nowrap
                  ${selectedCategory === cat.id 
                    ? 'bg-premium-charcoal text-white' 
                    : 'bg-white/50 text-premium-charcoal hover:bg-premium-charcoal/5'}
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Global Filter Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-charcoal/40 group-focus-within:text-premium-charcoal transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/50 border border-premium-charcoal/10 focus:border-premium-charcoal focus:outline-none text-[13px] w-full lg:w-64 transition-all"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border border-premium-charcoal/10 text-[11px] uppercase tracking-widest font-bold transition-all
                ${isFilterOpen ? 'bg-premium-charcoal text-white' : 'hover:bg-premium-charcoal/5'}
              `}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedFinish || selectedMaterial) && (
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
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="premium-subheading mb-4">By Finish</h4>
                  <div className="flex flex-wrap gap-2">
                    {finishes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFinish(selectedFinish === f ? null : f)}
                        className={`px-3 py-1 text-[10px] border transition-all
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
                    {materials.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMaterial(selectedMaterial === m ? null : m)}
                        className={`px-3 py-1 text-[10px] border transition-all
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
                <div className="flex items-end justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-widest font-bold text-premium-charcoal/40 hover:text-red-600 flex items-center gap-2"
                  >
                    <X className="w-3 h-3" />
                    Reset All Filters
                  </button>
                </div>
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
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
