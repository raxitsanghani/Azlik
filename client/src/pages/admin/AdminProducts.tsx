import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  X, 
  UploadCloud,
  Image as ImageIcon,
  Copy,
  FolderInput,
  Star,
  Eye,
  Check,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService, getFullImageUrl } from '../../api/apiService';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';

const normalizeCategory = (value: string) => value.trim().toLowerCase();



const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productService.getAll({ all: true }); 
      const mapped = Array.isArray(response.data) 
        ? response.data.map((p: any) => ({
            ...p,
            id: p._id || p.id,
            image: getFullImageUrl(p.image),
            images: (p.images || []).map((img: string) => getFullImageUrl(img)),
            variants: (p.variants || []).map((v: any) => ({
              ...v,
              images: (v.images || []).map((img: string) => getFullImageUrl(img))
            }))
          }))
        : [];
      setProducts(mapped);
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch products from server');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAll();
      setDynamicCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchProducts, fetchCategories]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'accessories',
    price: '',
    description: '',
    material: '',
    finish: '',
    dimensions: '',
    status: 'Active',
    featured: false,
    accessoryCategory: ''
  });
  
  const [images, setImages] = useState<(File | string)[]>([]);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);

  // Helper to get preview URL for local files or strings
  const getPreviewUrl = (img: File | string | null) => {
    if (!img) return null;
    return typeof img === 'string' ? img : URL.createObjectURL(img);
  };

  // Variants State
  const [variants, setVariants] = useState<any[]>([]);

  const handleOpenDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err: any) {
        toast.error('Failed to delete product');
      }
      setOpenDropdownId(null);
    }
  };

  const handleViewOnWebsite = (id: string) => {
     navigate(`/product/${id}`);
     setOpenDropdownId(null);
  };

  const handleDuplicate = async (product: any) => {
    try {
      const { id, _id, createdAt, updatedAt, __v, ...rest } = product;
      
      const formDataPayload = new FormData();
      formDataPayload.append('name', `${product.name} (Copy)`);
      // Generate a new unique SKU to avoid 400 Bad Request / Duplicate Key error
      formDataPayload.append('sku', `${product.sku || 'SKU'}-COPY-${Date.now().toString().slice(-4)}`);
      formDataPayload.append('category', product.category || '');
      formDataPayload.append('price', product.price || '');
      formDataPayload.append('description', product.description || '');
      formDataPayload.append('material', product.material || '');
      formDataPayload.append('finish', product.finish || '');
      formDataPayload.append('dimensions', product.dimensions || '');
      formDataPayload.append('status', product.status || 'Active');
      formDataPayload.append('featured', String(product.featured || false));
      formDataPayload.append('accessoryCategory', product.accessoryCategory || '');

      const existingImages = product.images || (product.image ? [product.image] : []);
      existingImages.forEach((img: string) => {
        formDataPayload.append('existingImages', img);
      });

      if (product.variants && product.variants.length > 0) {
        const variantsWithoutFiles = product.variants.map((v: any) => {
          const vCopy = { ...v };
          vCopy.existingImages = v.images || [];
          delete vCopy.images;
          return vCopy;
        });
        formDataPayload.append('variants', JSON.stringify(variantsWithoutFiles));
      }

      await productService.create(formDataPayload);
      toast.success('Product duplicated successfully');
      fetchProducts();
    } catch (err: any) {
      console.error('Duplication error:', err);
      toast.error(err.response?.data?.message || 'Failed to duplicate product');
    }
    setOpenDropdownId(null);
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      const productId = product.id || product._id;
      await productService.update(productId, { featured: !product.featured });
      toast.success(product.featured ? 'Removed from featured' : 'Marked as featured');
      fetchProducts();
    } catch (err: any) {
      toast.error('Failed to update featured status');
    }
    setOpenDropdownId(null);
  };



  const handleEdit = (product: any) => {
    setEditingId(product.id || product._id);
    setFormData({
      name: product.name,
      sku: product.sku || '',
      category: product.category,
      price: product.price || '',
      description: product.description || '',
      material: product.material || '',
      finish: product.finish || '',
      dimensions: product.dimensions || '',
      status: product.status || 'Active',
      featured: Boolean(product.featured),
      accessoryCategory: product.accessoryCategory || ''
    });
    const loadedImages = product.images?.length ? product.images : product.image ? [product.image] : [];
    setImages(loadedImages);
    
    if (product.variants && product.variants.length > 0) {
      setVariants(product.variants.map((v: any) => ({
        ...v,
        images: v.images || []
      })));
    } else {
      setVariants([]);
    }
    
    setOpenDropdownId(null);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      category: 'accessories',
      price: '',
      description: '',
      material: '',
      finish: '',
      dimensions: '',
      status: 'Active',
      featured: false,
      accessoryCategory: ''
    });
    setImages([]);
    setVariants([]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize category for display consistency
    let finalCategory = normalizeCategory(formData.category || 'accessories');

    // Validation check for images
    const hasMainImages = images.length > 0;
    const hasVariantImages = variants.some(v => v.images && v.images.length > 0);
    
    if (!hasMainImages && !hasVariantImages) {
      toast.error('At least one product photo is required (main or color variant)');
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('name', formData.name);
    formDataPayload.append('sku', formData.sku);
    formDataPayload.append('category', finalCategory);
    
    // Only append price if it's not empty to avoid 400 Bad Request casting error
    if (formData.price) {
      formDataPayload.append('price', formData.price);
    }
    
    formDataPayload.append('description', formData.description);
    formDataPayload.append('material', formData.material);
    formDataPayload.append('finish', formData.finish);
    formDataPayload.append('dimensions', formData.dimensions);
    formDataPayload.append('status', formData.status);
    formDataPayload.append('featured', String(formData.featured));
    formDataPayload.append('accessoryCategory', formData.accessoryCategory);

    images.forEach(img => {
      if (typeof img === 'string') {
        formDataPayload.append('existingImages', img);
      } else {
        formDataPayload.append('images', img);
      }
    });

    // Handle Variants
    const variantsWithoutFiles = variants.map(v => {
      const vCopy = { ...v };
      vCopy.existingImages = (v.images || []).filter((img: any) => typeof img === 'string');
      // remove actual files array from JSON object as we send them via form data
      delete vCopy.images;
      return vCopy;
    });

    formDataPayload.append('variants', JSON.stringify(variantsWithoutFiles));

    variants.forEach((v, index) => {
      if (v.images) {
        v.images.forEach((img: any) => {
          if (typeof img !== 'string') {
            formDataPayload.append(`variantImages_${index}`, img);
          }
        });
      }
    });

    try {
      if (editingId) {
        await productService.update(editingId, formDataPayload);
        toast.success('Product updated successfully');
      } else {
        await productService.create(formDataPayload);
        toast.success('Product added successfully');
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { colorName: '', stock: 0, price: '', sku: '', images: [] }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleVariantImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      const newVariants = [...variants];
      newVariants[index].images = [...(newVariants[index].images || []), ...newImages];
      setVariants(newVariants);
    }
    e.target.value = '';
  };

  const removeVariantImage = (vIndex: number, imgIndex: number) => {
    const newVariants = [...variants];
    newVariants[vIndex].images = newVariants[vIndex].images.filter((_: any, i: number) => i !== imgIndex);
    setVariants(newVariants);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-premium-charcoal tracking-tight">Products</h1>
          <p className="text-gray-500">Manage your product catalog, categories, and inventory.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-premium-charcoal text-white px-6 py-2.5 rounded-xl font-medium tracking-wide hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 min-h-[400px]">
        <div className="overflow-x-auto md:overflow-visible min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6 rounded-tl-2xl">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Photos</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => {
                const photosCount = product.images?.length || 1;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={product.image || (product.images && product.images[0]) || '/placeholder-product.jpg'} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                        </div>
                        <span className="font-bold text-premium-charcoal">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium capitalize">{product.category}</td>
                    <td className="p-4 text-gray-600 font-medium">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={16} className="text-gray-500" />
                        <span>Photos ({photosCount})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide 
                        ${product.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                      `}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <button onClick={(e) => handleOpenDropdown(product.id, e)} className="p-2 text-gray-500 hover:text-premium-charcoal hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={20} />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdownId === product.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-visible z-[100] text-left"
                              >
                                <div className="p-2 grid gap-1">
                                  <button onClick={() => handleEdit(product)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Edit size={16} /> Edit Details
                                  </button>
                                  <button onClick={() => navigate(`/product/${product.id}`)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Eye size={16} /> View on Website
                                  </button>
                                  <button onClick={() => handleDuplicate(product)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Copy size={16} /> Duplicate Product
                                  </button>
                                  <button onClick={() => handleToggleFeatured(product)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors border-t border-gray-50 mt-1">
                                    <Star size={16} className={product.featured ? "fill-premium-gold text-premium-gold" : ""} /> {product.featured ? 'Remove Featured' : 'Mark as Featured'}
                                  </button>
                                  <button onClick={() => handleDelete(product.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors">
                                    <Trash2 size={16} /> Delete Product
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 my-auto max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white rounded-t-3xl sticky top-0 z-20">
                <h2 className="text-2xl font-bold text-premium-charcoal tracking-tight">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. Premium Brass Faucet"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">SKU</label>
                      <input 
                        type="text" 
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. F-101"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. $299"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
                       <div className="relative" ref={categoryDropdownRef}>
                         <button
                           type="button"
                           onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium flex justify-between items-center"
                         >
                           <span className={formData.accessoryCategory ? 'text-premium-charcoal' : 'text-gray-400'}>
                             {formData.accessoryCategory || 'Select Category'}
                           </span>
                           <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                         </button>

                         <AnimatePresence>
                           {isCategoryDropdownOpen && (
                             <motion.div
                               initial={{ opacity: 0, y: 10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               className="absolute z-[120] top-full left-0 right-0 mt-2 bg-[#4D4D4D] rounded-xl shadow-2xl overflow-hidden border border-white/10"
                             >
                               <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                                 {dynamicCategories.map((cat) => (
                                   <div 
                                     key={cat._id}
                                     className="group flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors"
                                     onClick={() => {
                                       setFormData({ ...formData, category: 'accessories', accessoryCategory: cat.name });
                                       setIsCategoryDropdownOpen(false);
                                     }}
                                   >
                                     <div className="flex items-center gap-3">
                                       <div className="w-4 flex items-center justify-center">
                                         {formData.accessoryCategory === cat.name && <Check className="w-3 h-3 text-white" />}
                                       </div>
                                       <span className="text-white text-sm font-medium">{cat.name}</span>
                                     </div>
                                   </div>
                                 ))}
                                 
                                 {dynamicCategories.length === 0 && (
                                   <div className="px-4 py-3 text-white/40 text-sm italic">
                                     No categories found. Add them in the Categories section.
                                   </div>
                                 )}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Status</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium appearance-none cursor-pointer"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Material</label>
                      <input 
                        type="text" 
                        required
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. Solid Brass"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Finish</label>
                      <input 
                        type="text" 
                        required
                        value={formData.finish}
                        onChange={(e) => setFormData({...formData, finish: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. Matte Black"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Dimensions</label>
                      <input 
                        type="text" 
                        required
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
                        placeholder="e.g. 200mm x 150mm"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                       <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Images</label>
                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Unlimited Uploads Supported</span>
                    </div>

                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                  <input
                    id="featured-toggle"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-premium-charcoal"
                  />
                  <label htmlFor="featured-toggle" className="text-sm font-medium text-gray-700">
                    Mark as Featured (show in homepage featured products)
                  </label>
                </div>
                   
                    <div className="flex flex-col gap-4">
                      {/* Main Preview Area */}
                      {(images.length > 0 || hoverPreview) && (
                        <div className="w-full h-48 sm:h-64 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative group">
                          <AnimatePresence mode="wait">
                            <motion.img 
                              key={hoverPreview || (images.length > 0 ? getPreviewUrl(images[0]) : 'empty')}
                              initial={{ opacity: 0, scale: 1.05 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.02 }}
                              transition={{ duration: 0.35 }}
                              src={hoverPreview || getPreviewUrl(images[0]) || ''} 
                              alt="Preview Main" 
                              className="w-full h-full object-contain p-4 transition-all"
                            />
                          </AnimatePresence>
                          {!hoverPreview && images.length > 0 && (
                             <div className="absolute top-4 left-4 bg-premium-charcoal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Default Main</div>
                          )}
                          {hoverPreview && (
                             <div className="absolute top-4 left-4 bg-premium-royal text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Viewing Preview</div>
                          )}
                        </div>
                      )}

                      <div className="flex sm:flex-row flex-col gap-4">
                        <div className="relative group shrink-0">
                           <input 
                              type="file" 
                              multiple 
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <div className="w-full sm:w-32 h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 group-hover:border-premium-charcoal group-hover:text-premium-charcoal group-hover:bg-gray-50 transition-all">
                               <UploadCloud size={28} className="mb-2" />
                               <span className="text-[10px] font-bold uppercase">Upload</span>
                            </div>
                        </div>

                        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-center">
                          {images.map((img, index) => (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               key={index}
                               onMouseEnter={() => setHoverPreview(getPreviewUrl(img))}
                               onMouseLeave={() => setHoverPreview(null)}
                               className={`relative w-32 h-32 rounded-2xl overflow-hidden shrink-0 border-2 transition-all group flex items-center justify-center bg-gray-50 
                                 ${(hoverPreview === getPreviewUrl(img) || (!hoverPreview && index === 0)) ? 'border-premium-charcoal shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                             >
                               <img src={getPreviewUrl(img) || ''} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                               {index === 0 && (
                                 <div className="absolute top-2 left-2 bg-premium-charcoal text-white text-[10px] uppercase font-bold px-2 py-1 rounded">Cover</div>
                               )}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      removeImage(index);
                                      setHoverPreview(null);
                                    }}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                             </motion.div>
                          ))}
                        {images.length === 0 && (
                          <div className="flex-1 h-32 hidden sm:flex items-center justify-center border-2 border-dashed border-transparent text-gray-500 text-sm font-medium">
                            <ImageIcon size={20} className="mr-2 opacity-80" />
                            No images selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                       <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Color Variants</label>
                       <button
                         type="button"
                         onClick={handleAddVariant}
                         className="flex items-center gap-1 text-sm bg-premium-charcoal text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                       >
                         <Plus size={16} /> Add New Color
                       </button>
                    </div>

                    {variants.map((variant, vIndex) => (
                      <div key={vIndex} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4 relative">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(vIndex)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pr-10">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Color Name *</label>
                            <input 
                              type="text" 
                              required
                              value={variant.colorName}
                              onChange={(e) => handleVariantChange(vIndex, 'colorName', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all"
                              placeholder="e.g. Matte Black"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Stock / Qty *</label>
                            <input 
                              type="number" 
                              required
                              value={variant.stock}
                              onChange={(e) => handleVariantChange(vIndex, 'stock', Number(e.target.value))}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all"
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">Price</label>
                            <input 
                              type="number" 
                              value={variant.price || ''}
                              onChange={(e) => handleVariantChange(vIndex, 'price', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all"
                              placeholder="Base price + X"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase">SKU</label>
                            <input 
                              type="text" 
                              value={variant.sku || ''}
                              onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all"
                              placeholder="e.g. SKU-BLACK"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                           <label className="text-xs font-bold text-gray-700 uppercase block mb-2">Color Images</label>
                           <div className="flex sm:flex-row flex-col gap-3">
                              <div className="relative group w-24 h-24 shrink-0">
                                 <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={(e) => handleVariantImageUpload(vIndex, e)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                  />
                                  <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 group-hover:border-premium-charcoal group-hover:text-premium-charcoal bg-white transition-all">
                                     <Plus size={20} />
                                  </div>
                              </div>
                              <div className="flex-1 flex gap-3 overflow-x-auto pb-2 custom-scrollbar items-center">
                                {variant.images && variant.images.map((img: any, imgIndex: number) => (
                                   <motion.div 
                                     initial={{ opacity: 0, scale: 0.8 }}
                                     animate={{ opacity: 1, scale: 1 }}
                                     key={imgIndex}
                                     onMouseEnter={() => setHoverPreview(getPreviewUrl(img))}
                                     onMouseLeave={() => setHoverPreview(null)}
                                     className={`relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all group flex items-center justify-center bg-white
                                       ${hoverPreview === getPreviewUrl(img) ? 'border-premium-charcoal shadow-md' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                   >
                                     <img src={getPreviewUrl(img) || ''} alt={`Variant ${imgIndex}`} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <button 
                                          type="button" 
                                          onClick={() => removeVariantImage(vIndex, imgIndex)}
                                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                     </div>
                                   </motion.div>
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}
                    {variants.length === 0 && (
                      <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                        <p className="text-gray-500 text-sm">No color variants added yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                       <textarea 
                          rows={4}
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium custom-scrollbar"
                          placeholder="Detailed product overview..."
                       ></textarea>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="productForm"
                  className="bg-premium-charcoal text-white px-8 py-2.5 rounded-xl font-bold tracking-wide hover:bg-black transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5"
                >
                  {editingId ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProducts;
