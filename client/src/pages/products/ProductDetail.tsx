import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Ruler, ShieldCheck, Package } from 'lucide-react';
import { Product } from '../../data/products';
import ProductEnquiryModal from '../../components/enquiry/ProductEnquiryModal';
import { generateProductPdf } from '../../utils/pdfUtils';
import { toast } from 'react-toastify';
import { productService } from '../../api/apiService';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productService.getById(id);
        const data = response.data;
        const normalizedProduct = {
          ...data,
          id: data._id || data.id
        };
        setProduct(normalizedProduct);
        
        // Initial Image setup: First variant image or main product image
        if (normalizedProduct.variants && normalizedProduct.variants.length > 0) {
            const firstVariant = normalizedProduct.variants[0];
            setSelectedVariantIndex(0);
            setActiveImage(firstVariant.images?.[0] || normalizedProduct.image || '/placeholder-product.jpg');
        } else {
            setActiveImage(normalizedProduct.image || (normalizedProduct.images && normalizedProduct.images[0]) || '/placeholder-product.jpg');
        }
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        navigate('/products');
      } finally {
        setResolved(true);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleVariantSelect = (index: number) => {
    if (!product || !product.variants) return;
    setSelectedVariantIndex(index);
    const variant = product.variants[index];
    if (variant.images && variant.images.length > 0) {
      setActiveImage(variant.images[0]);
    }
  };

  if (!resolved) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-6 w-40 bg-premium-charcoal/10" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              <div className="aspect-[4/5] bg-premium-charcoal/10" />
              <div className="space-y-4">
                <div className="h-4 w-28 bg-premium-charcoal/10" />
                <div className="h-12 w-3/4 bg-premium-charcoal/10" />
                <div className="h-4 w-full bg-premium-charcoal/10" />
                <div className="h-4 w-2/3 bg-premium-charcoal/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const currentVariant = product.variants?.[selectedVariantIndex];
  const galleryImages = currentVariant?.images?.length ? currentVariant.images : (product.images || []);

  const handleDownloadPdf = async () => {
    try {
      await generateProductPdf(product);
    } catch {
      toast.error('Failed to generate product PDF');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-premium-charcoal/40 hover:text-premium-charcoal transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="premium-card aspect-[4/5] overflow-hidden bg-gray-50 flex items-center justify-center">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={activeImage || '/placeholder-product.jpg'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
              />
            </div>
            
            {galleryImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {galleryImages.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-premium-ivory overflow-hidden premium-card border-2 transition-all duration-300 ${activeImage === imgUrl ? 'border-premium-charcoal opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`detail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:sticky lg:top-32"
          >
            <span className="premium-subheading mb-4 block">{product.category}</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-premium-charcoal mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap gap-8 mb-10 pb-10 border-b border-premium-charcoal/5">
              <div>
                <p className="premium-subheading mb-1 opacity-40">Default Finish</p>
                <p className="text-[13px] font-medium tracking-wide">{product.finish}</p>
              </div>
              <div>
                <p className="premium-subheading mb-1 opacity-40">Material</p>
                <p className="text-[13px] font-medium tracking-wide">{product.material}</p>
              </div>
              <div>
                <p className="premium-subheading mb-1 opacity-40">Dimensions</p>
                <p className="text-[13px] font-medium tracking-wide">{product.dimensions}</p>
              </div>
            </div>

            {/* COLOR VARIANT SELECTION */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-12">
                <p className="premium-subheading mb-4 text-premium-charcoal/60">Available Finishes</p>
                <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleVariantSelect(idx)}
                            className={`px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black transition-all border-2 ${
                                selectedVariantIndex === idx 
                                ? 'bg-premium-charcoal text-white border-premium-charcoal shadow-lg scale-105' 
                                : 'bg-transparent text-premium-charcoal/60 border-premium-charcoal/10 hover:border-premium-charcoal/30 hover:text-premium-charcoal'
                            }`}
                        >
                            {variant.colorName}
                        </button>
                    ))}
                </div>
              </div>
            )}

            <div className="space-y-8 mb-12">
              <p className="text-premium-charcoal/70 font-light leading-relaxed text-lg">
                {product.description}
              </p>
              <p className="text-premium-charcoal/70 font-light leading-relaxed">
                Elevate your daily routine with the {product.name}. Every curve and surface has 
                been meticulously engineered to provide not just function, but a profound 
                sensory experience. Part of our signature {product.category} series, it 
                represents the pinnacle of modern bathroom craftsmanship.
              </p>
            </div>

            {/* Icons / Features */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-12">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-premium-royal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-premium-royal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Universal Fit</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-premium-royal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Eco-Packaging</span>
              </div>
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-premium-royal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Architect Choice</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="premium-button flex-1 flex items-center justify-center gap-3 min-w-[200px]"
                onClick={() => setEnquiryOpen(true)}
              >
                Enquire Now
              </button>
              <button
                type="button"
                className="premium-btn-outline flex items-center justify-center gap-3"
                onClick={handleDownloadPdf}
              >
                Download PDF
              </button>
            </div>

            <div className="mt-12 p-6 bg-premium-ivory/50 border border-premium-charcoal/5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-premium-royal mb-2">Professional Support</p>
              <p className="text-[12px] text-premium-charcoal/60 leading-relaxed">
                Need CAD drawings or technical specifications? Our dedicated architecture 
                support team is available for custom project consultations.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductEnquiryModal
        product={{
            ...product,
            // Pass the currently selected finish/color to the enquiry modal
            finish: currentVariant?.colorName || product.finish
        }}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
