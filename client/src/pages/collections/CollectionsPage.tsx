import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collectionService, getFullImageUrl } from '../../api/apiService';
import PageLayout from '../../components/common/PageLayout';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const CollectionCard = ({ col, index, setPreviewImage }: { col: any; index: number; setPreviewImage: (img: string) => void }) => {
  const allImages = React.useMemo(() => {
    const list = [...(col.images || [])];
    if (list.length === 0 && col.image) list.push(col.image);
    // Remove duplicates while preserving order
    return list.filter((item, index) => list.indexOf(item) === index);
  }, [col.images, col.image]);

  const [activeImage, setActiveImage] = useState(allImages[0] || col.image || '/placeholder-product.jpg');

  // Update active image if collection data changes
  useEffect(() => {
    setActiveImage(allImages[0] || col.image || '/placeholder-product.jpg');
  }, [allImages, col.image]);

  return (
    <div key={col._id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}>
      {/* Image Presentation */}
      <div className="w-full lg:w-3/5 space-y-6">
        <div className="relative group cursor-zoom-in" onClick={() => setPreviewImage(activeImage)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[16/10] bg-gray-100 overflow-hidden relative shadow-2xl shadow-black/5 rounded-2xl"
          >
            <img 
              src={activeImage} 
              alt={col.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700"></div>
            <div className="absolute bottom-10 left-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 transform tracking-[0.3em] text-[10px] uppercase font-bold drop-shadow-lg flex items-center gap-2">
              View Full Reveal <ArrowRight size={14} />
            </div>
          </motion.div>
          
          {/* Floating Accent */}
          <motion.div 
            initial={{ opacity: 0, x: index % 2 === 1 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`absolute -bottom-6 ${index % 2 === 1 ? '-left-6' : '-right-6'} bg-white p-6 shadow-xl border border-gray-100 hidden xl:block z-20 rounded-xl`}
          >
            <p className="text-[10px] font-bold text-premium-gold uppercase tracking-widest mb-1">Authentic Design</p>
            <p className="text-lg font-serif text-premium-charcoal">{col.modelNumber || 'Azlik Series'}</p>
          </motion.div>
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                type="button"
                onMouseEnter={() => setActiveImage(img)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                  setPreviewImage(img);
                }}
                className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-500 ${
                  activeImage === img 
                    ? 'border-premium-gold shadow-lg shadow-premium-gold/10 scale-105 opacity-100' 
                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-102'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`${col.name} preview ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Presentation */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: index % 2 === 1 ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="mb-8 flex flex-wrap gap-2">
            {col.category && <span className="bg-premium-charcoal/5 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-premium-charcoal/70 rounded-full border border-premium-charcoal/10">{col.category}</span>}
            {col.color && <span className="bg-premium-gold/5 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-premium-gold rounded-full border border-premium-gold/20">{col.color}</span>}
          </div>

          <h2 className="font-serif text-5xl lg:text-6xl text-premium-charcoal mb-6 leading-tight">
            {col.name}
          </h2>

          <p className="text-premium-charcoal/60 leading-relaxed font-light mb-10 text-lg">
            {col.description}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-12 border-y border-gray-100 py-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-premium-charcoal/30 mb-2">Finish</p>
              <p className="font-medium text-premium-charcoal text-sm">{col.finish || 'Customized'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-premium-charcoal/30 mb-2">Material</p>
              <p className="font-medium text-premium-charcoal text-sm">{col.material || 'Solid Alloy'}</p>
            </div>
          </div>

          <Link 
            to={`/collections/${col._id}`}
            className="inline-flex items-center gap-5 text-[10px] uppercase tracking-[0.3em] font-black text-premium-charcoal hover:text-black transition-all group"
          >
            Discover Full Collection
            <div className="relative">
              <span className="block w-12 h-[1px] bg-premium-charcoal transition-all duration-500 group-hover:w-20 group-hover:bg-black"></span>
              <ArrowRight size={14} className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const CollectionsPage = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await collectionService.getAll();
        const mapped = Array.isArray(res.data) 
          ? res.data.map((c: any) => ({
              ...c,
              image: getFullImageUrl(c.image),
              images: (c.images || []).map((img: string) => getFullImageUrl(img))
            }))
          : [];
        setCollections(mapped);
      } catch (err) {
        console.error("Failed to load collections", err);
        toast.error('Unable to load master collections');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  return (
    <PageLayout>
      <div className="pt-32 pb-24 min-h-screen bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-premium-gold/10 text-premium-gold text-[10px] font-bold uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-premium-gold/40" />
              <Sparkles size={12} />
              Curated Series
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-premium-charcoal mb-6 tracking-tight">Master Collections</h1>
            <p className="text-premium-charcoal/60 max-w-2xl mx-auto tracking-wide text-lg leading-relaxed">
              Explore our curated series of premium architectural bathroom fittings. Each collection represents a unified vision of luxury and international craftsmanship.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-premium-gold border-t-transparent animate-spin"></div>
               <p className="text-sm font-medium text-premium-charcoal/40 uppercase tracking-[0.2em]">Designing Excellence...</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_40px_rgba(0,0,0,0.03)]">
               <Box size={64} strokeWidth={1} className="mx-auto mb-6 text-premium-charcoal/10" />
               <h3 className="font-serif text-3xl text-premium-charcoal mb-3">Refining Elegance</h3>
               <p className="text-premium-charcoal/50 max-w-md mx-auto">Our master collections are currently being curated offline for the spring season.</p>
            </div>
          ) : (
            <div className="space-y-32">
              {collections.map((col, index) => (
                <CollectionCard 
                  key={col._id} 
                  col={col} 
                  index={index} 
                  setPreviewImage={setPreviewImage} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ImagePreviewModal 
        isOpen={!!previewImage} 
        imageUrl={previewImage || ''} 
        onClose={() => setPreviewImage(null)} 
      />
    </PageLayout>
  );
};

export default CollectionsPage;
