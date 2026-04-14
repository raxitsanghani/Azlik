import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Product } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';

const ProductCard = ({ product, index, setPreviewImage }: { product: Product; index: number; setPreviewImage: (img: string) => void }) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(product.image || (product.images && product.images[0]) || '/placeholder-product.jpg');

  const currentVariant = product.variants?.[selectedVariantIndex];
  const galleryImages = currentVariant?.images?.length ? currentVariant.images : (product.images || []);

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariantIndex(0);
      setActiveImage(product.variants[0].images?.[0] || product.image || '/placeholder-product.jpg');
    } else {
      setActiveImage(product.image || (product.images && product.images[0]) || '/placeholder-product.jpg');
    }
  }, [product]);

  const handleVariantSelect = (idx: number) => {
    if (!product.variants) return;
    setSelectedVariantIndex(idx);
    const variant = product.variants[idx];
    if (variant.images && variant.images.length > 0) {
      setActiveImage(variant.images[0]);
    } else {
      setActiveImage(product.image);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col h-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
    >
      <div className="block cursor-zoom-in relative mb-6" onClick={() => setPreviewImage(activeImage)}>
        <div className="premium-card overflow-hidden relative aspect-[4/5] bg-gray-50 flex items-center justify-center rounded-lg">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
          />
          <div className="absolute inset-0 bg-premium-charcoal/0 group-hover:bg-premium-charcoal/10 transition-colors duration-500" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] font-bold shadow-sm">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl group-hover:text-premium-royal transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>
        <p className="text-[13px] text-premium-charcoal/60 font-light line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-4 pt-2 text-[10px] uppercase tracking-widest text-premium-charcoal/40 font-extrabold border-t border-gray-50 pt-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-gray-400">Finish</span>
            <span className="text-premium-charcoal/70">{currentVariant?.colorName || product.finish}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-gray-400">Material</span>
            <span className="text-premium-charcoal/70">{product.material}</span>
          </div>
        </div>

        {/* COLOR SELECTOR */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3 pt-2">
             <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleVariantSelect(idx)}
                    className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border-2 ${
                      selectedVariantIndex === idx 
                      ? 'bg-premium-charcoal text-white border-premium-charcoal shadow-sm' 
                      : 'bg-transparent text-premium-charcoal/60 border-premium-charcoal/5 hover:border-premium-charcoal/20'
                    }`}
                  >
                    {v.colorName}
                  </button>
                ))}
             </div>
             
             {/* VARIANT THUMBNAILS */}
             {galleryImages.length > 1 && (
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      onMouseEnter={() => setActiveImage(img)}
                      className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-premium-charcoal' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`${product.name} view ${idx}`} />
                    </button>
                  ))}
               </div>
             )}
          </div>
        )}

        <div className="pt-4 mt-auto">
          <Link 
            to={`/product/${product.id}`}
            className="inline-block text-[11px] uppercase tracking-[0.2em] font-bold border-b border-premium-charcoal pb-1 hover:text-premium-royal hover:border-premium-royal transition-all duration-300"
          >
            Explore Masterpiece
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ProductListing = () => {
  const { category: urlCategory } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const dynamicProducts = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedFinish, setSelectedFinish] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<string | null>(null);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
      setSelectedCategory(normalized);
    } else {
      setSelectedCategory('all');
    }
  }, [urlCategory, navigate, allowedCategoryIds]);

  const filteredProducts = useMemo(() => {
    return dynamicProducts.filter((product) => {
      const isActive = (product.status || 'Active') === 'Active';
      const searchNormalized = searchQuery.toLowerCase();
      
      const toSlug = (text: string) => text.toLowerCase().replace(/\./g, '').replace(/ \+ /g, '-').replace(/ /g, '-');
      
      const selectedSlug = selectedCategory.toLowerCase(); 
      const productCat = product.category.toLowerCase();
      const productSubCat = product.accessoryCategory || '';
      const productSubCatSlug = toSlug(productSubCat);

      const matchesCategory = 
        selectedCategory === 'all' || 
        productCat === selectedCategory.toLowerCase() || 
        productSubCatSlug === selectedSlug;

      const matchesSearch = product.name.toLowerCase().includes(searchNormalized) || 
                           product.description.toLowerCase().includes(searchNormalized) ||
                           productSubCat.toLowerCase().includes(searchNormalized);
                           
      const matchesFinish = !selectedFinish || product.finish === selectedFinish;
      const matchesMaterial = !selectedMaterial || product.material === selectedMaterial;
      const matchesDimensions = !selectedDimensions || product.dimensions === selectedDimensions;
      const matchesFeatured = !showOnlyFeatured || product.featured === true;
      
      return isActive && matchesCategory && matchesSearch && matchesFinish && matchesMaterial && matchesDimensions && matchesFeatured;
    });
  }, [dynamicProducts, selectedCategory, searchQuery, selectedFinish, selectedMaterial, selectedDimensions, showOnlyFeatured]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleCategoryChange = (catId: string) => {
    if (catId === 'all') {
      navigate('/products');
    } else {
      navigate(`/accessories/${catId}`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFinish(null);
    setSelectedMaterial(null);
    setSelectedDimensions(null);
    setShowOnlyFeatured(false);
  };

  const handlePreview = (img: string) => {
    setPreviewImage(img);
  };

  return (
    <div className={`min-h-screen pb-20 px-4 sm:px-6 lg:px-8 ${location.pathname.startsWith('/accessories') ? 'pt-40' : 'pt-28'}`}>

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
        <AnimatePresence mode="wait">
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white mt-1 border border-premium-charcoal/10 p-6 shadow-xl relative z-[60]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <h4 className="premium-subheading mb-4">Special</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                        className={`px-4 py-2 text-[10px] border transition-all uppercase tracking-widest font-bold
                          ${showOnlyFeatured 
                            ? 'border-premium-royal bg-premium-royal text-white shadow-md' 
                            : 'border-premium-charcoal/10 hover:border-premium-royal text-premium-charcoal/60'}
                        `}
                      >
                        ★ Featured Only
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-6 mt-8 pt-6 border-t border-premium-charcoal/10">
                  <button
                    onClick={clearFilters}
                    className="text-[10px] uppercase tracking-widest font-bold text-premium-charcoal/40 hover:text-red-600 flex items-center gap-2 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-[10px] uppercase tracking-widest font-bold text-premium-charcoal hover:text-premium-royal transition-colors"
                  >
                    Apply & Close
                  </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <p className="text-[12px] text-premium-charcoal/50 font-medium uppercase tracking-[0.1em]">
          Collection <span className="text-premium-charcoal font-bold">{displayedProducts.length}</span> / {filteredProducts.length}
        </p>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            <AnimatePresence mode="popLayout">
              {displayedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  setPreviewImage={handlePreview} 
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <h3 className="font-serif text-2xl mb-4 text-premium-charcoal">Design Not Found</h3>
            <p className="text-premium-charcoal/40 font-light max-w-sm mx-auto">We couldn't find any products in this collection with the current filters. Your design awaits in another set.</p>
            <button
              onClick={clearFilters}
              className="mt-8 premium-btn-outline"
            >
              Explore Entire Catalog
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
      <ImagePreviewModal isOpen={!!previewImage} imageUrl={previewImage || ''} onClose={() => setPreviewImage(null)} />
    </div>
  );
};

export default ProductListing;
