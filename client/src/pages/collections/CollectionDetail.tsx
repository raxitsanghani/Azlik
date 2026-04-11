import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionService } from '../../api/apiService';
import PageLayout from '../../components/common/PageLayout';
import { ArrowLeft, ChevronRight, Maximize2, Sparkles, ShieldCheck, Ruler, Palette } from 'lucide-react';
import ImagePreviewModal from '../../components/common/ImagePreviewModal';

const CollectionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [collection, setCollection] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCollection = async () => {
            if (!id) return;
            try {
                const res = await collectionService.getById(id);
                setCollection(res.data);
                setSelectedImage(res.data.image || res.data.images?.[0] || '');
            } catch (err) {
                console.error("Failed to load collection details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCollection();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <PageLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-premium-gold border-t-transparent animate-spin"></div>
                </div>
            </PageLayout>
        );
    }

    if (!collection) {
        return (
            <PageLayout>
                <div className="min-h-screen flex flex-col items-center justify-center gap-6">
                    <h2 className="font-serif text-3xl text-premium-charcoal">Collection Not Found</h2>
                    <Link to="/collections" className="text-premium-gold font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                        <ArrowLeft size={16} /> Back to Collections
                    </Link>
                </div>
            </PageLayout>
        );
    }

    const allImages = collection.images?.length ? collection.images : [collection.image];

    return (
        <PageLayout>
            <div className="pt-32 pb-24 bg-white min-h-screen text-premium-charcoal">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-premium-charcoal/40 mb-12">
                        <Link to="/" className="hover:text-premium-gold transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <Link to="/collections" className="hover:text-premium-gold transition-colors">Collections</Link>
                        <ChevronRight size={10} />
                        <span className="text-premium-charcoal/80">{collection.name}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
                        {/* Media Section */}
                        <div className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative group shadow-2xl shadow-black/5 cursor-zoom-in"
                                onClick={() => setPreviewImage(selectedImage)}
                            >
                                <img 
                                    src={selectedImage} 
                                    alt={collection.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                                <div className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={20} />
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-4 gap-4">
                                {allImages.map((img: string, idx: number) => (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            setSelectedImage(img);
                                            setPreviewImage(img);
                                        }}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-premium-gold shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`${collection.name} view ${idx}`} className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col justify-start pt-4">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-premium-charcoal/5 text-premium-charcoal/60 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <Sparkles size={12} className="text-premium-gold" />
                                    Exclusive Series
                                </div>
                                <h1 className="font-serif text-5xl lg:text-7xl mb-6 leading-tight uppercase tracking-tight">
                                    {collection.name}
                                </h1>
                                <p className="text-premium-charcoal/60 text-lg leading-relaxed mb-10 font-light italic border-l-2 border-premium-gold/30 pl-6">
                                    "{collection.description}"
                                </p>

                                {/* Specifications Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 mb-12 py-10 border-y border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-premium-gold">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-premium-charcoal/30 mb-1">Authenticity</p>
                                            <p className="font-medium text-sm">{collection.modelNumber || 'Master Piece'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-premium-gold">
                                            <Palette size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-premium-charcoal/30 mb-1">Finish / Aesthetic</p>
                                            <p className="font-medium text-sm">{collection.color || collection.finish || 'Custom'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-premium-gold">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-premium-charcoal/30 mb-1">Material</p>
                                            <p className="font-medium text-sm">{collection.material || 'Architectural Grade'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl text-premium-gold">
                                            <Ruler size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-premium-charcoal/30 mb-1">Dimensions</p>
                                            <p className="font-medium text-sm">{collection.dimensions || 'Precision Crafted'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 items-center">
                                    <button 
                                        className="w-full sm:w-auto px-10 py-5 bg-premium-charcoal text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-black/10 hover:-translate-y-1 active:translate-y-0"
                                    >
                                        Request Quotation
                                    </button>
                                    <Link 
                                        to="/products"
                                        state={{ category: collection.category }}
                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-premium-charcoal/40 hover:text-premium-gold transition-colors underline underline-offset-8 decoration-premium-gold/20"
                                    >
                                        View Allied Products
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Story / Full Width Reveal */}
                    <div className="relative h-[600px] rounded-3xl overflow-hidden mb-24 group">
                        <img src={collection.images?.[1] || collection.image} alt="Lifestyle" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12 lg:p-20">
                            <div className="max-w-2xl">
                                <h3 className="font-serif text-3xl lg:text-5xl text-white mb-6">Designed for Immortality.</h3>
                                <p className="text-white/70 text-lg font-light leading-relaxed">
                                    The {collection.name} is more than a set of fittings; it's a statement of permanence. Every curve and angle is calculated for both ergonomic perfection and visual harmony.
                                </p>
                            </div>
                        </div>
                    </div>
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

export default CollectionDetail;
