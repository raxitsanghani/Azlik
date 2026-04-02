import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Ruler, ShieldCheck, Package } from 'lucide-react';
import { products, Product } from '../../data/products';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  if (!product) return null;

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
            <div className="premium-card aspect-[4/5] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-premium-ivory overflow-hidden premium-card">
                <img 
                  src={product.image} 
                  alt="detail 1" 
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="aspect-square bg-premium-ivory overflow-hidden premium-card">
                <img 
                  src={product.image}
                  alt="detail 2" 
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity grayscale"
                />
              </div>
            </div>
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
                <p className="premium-subheading mb-1 opacity-40">Finish</p>
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
              <button className="premium-button flex-1 flex items-center justify-center gap-3 min-w-[200px]">
                Enquire Now
              </button>
              <button className="premium-btn-outline flex items-center justify-center gap-3">
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
    </div>
  );
};

export default ProductDetail;
