import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Product } from '../../data/products';
import { sendProductEnquiry } from '../../utils/enquiryService';

type ProductEnquiryModalProps = {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
};

const DEFAULT_MESSAGE =
  'I am interested in this product and would like more details.';

const ProductEnquiryModal: React.FC<ProductEnquiryModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setSubmitting(true);
    try {
      await sendProductEnquiry({
        product,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        message: message.trim() || DEFAULT_MESSAGE,
      });
      toast.success('Enquiry sent successfully');
      setFullName('');
      setEmail('');
      setPhone('');
      setCity('');
      setMessage(DEFAULT_MESSAGE);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[130] max-w-4xl w-full bg-premium-ivory/98 backdrop-blur-md border border-premium-charcoal/5 shadow-[0_24px_80px_rgba(15,23,42,0.35)] grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr]"
          >
            {/* Product summary */}
            <div className="hidden lg:block bg-premium-charcoal text-white p-8 space-y-6">
              <div className="premium-subheading text-premium-platinum/80 mb-2">
                Product Enquiry
              </div>
              <h2 className="premium-heading text-3xl mb-4">{product.name}</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {product.description}
              </p>
              <div className="space-y-2 text-xs uppercase tracking-[0.18em] text-premium-platinum/70">
                <p>Category: {product.category}</p>
                <p>Product ID: {product.id}</p>
                <p>Material: {product.material}</p>
                <p>Finish: {product.finish}</p>
                <p>Dimensions: {product.dimensions}</p>
              </div>
              <div className="mt-6 aspect-video rounded-sm overflow-hidden bg-premium-ivory/10 border border-white/10">
                <img
                  src={product.image || (product.images && product.images[0]) || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                />
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 relative text-premium-charcoal">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-premium-charcoal/40 hover:text-premium-charcoal transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="premium-heading text-2xl sm:text-3xl mb-2">
                Enquire about this product
              </h3>
              <p className="text-[11px] uppercase tracking-[0.2em] text-premium-charcoal/60 mb-6">
                Our concierge team will contact you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="premium-subheading mb-1 block text-premium-charcoal/80">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-premium-charcoal/20 bg-white py-2 px-3 text-sm outline-none focus:border-premium-charcoal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="premium-subheading mb-1 block text-premium-charcoal/80">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-premium-charcoal/20 bg-white py-2 px-3 text-sm outline-none focus:border-premium-charcoal transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="premium-subheading mb-1 block text-premium-charcoal/80">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-premium-charcoal/20 bg-white py-2 px-3 text-sm outline-none focus:border-premium-charcoal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="premium-subheading mb-1 block text-premium-charcoal/80">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-premium-charcoal/20 bg-white py-2 px-3 text-sm outline-none focus:border-premium-charcoal transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="premium-subheading mb-1 block text-premium-charcoal/80">
                    Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-premium-charcoal/20 bg-white p-3 text-sm outline-none focus:border-premium-charcoal transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="premium-button flex-1 flex items-center justify-center gap-2 min-w-[200px]"
                  >
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="premium-btn-outline flex-1 flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-[10px] text-premium-charcoal/70 leading-relaxed mt-2">
                  By submitting this form you agree to be contacted by the AZLIK
                  team regarding this product enquiry.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductEnquiryModal;

