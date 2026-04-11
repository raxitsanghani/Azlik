import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit2, Copy, Trash2, FolderInput, Image as ImageIcon, X, UploadCloud, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collectionService } from '../../api/apiService';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchCollections = useCallback(async () => {
    try {
      const response = await collectionService.getAll({ all: true });
      setCollections(response.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch collections');
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fetchCollections]);

  const [formData, setFormData] = useState({
    name: '',
    modelNumber: '',
    color: '',
    description: '',
    category: '',
    finish: '',
    material: '',
    dimensions: '',
    status: 'Active'
  });

  const [images, setImages] = useState<(File | string)[]>([]);

  const handleOpenDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionService.delete(id);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (err: any) {
        toast.error('Failed to delete collection');
      }
      setOpenDropdownId(null);
    }
  };

  const handleDuplicate = async (col: any) => {
    try {
      const { _id, createdAt, updatedAt, __v, ...rest } = col;
      const duplicateData = {
        ...rest,
        name: `${col.name} (Copy)`,
        existingImages: col.images || (col.image ? [col.image] : [])
      };
      await collectionService.create(duplicateData);
      toast.success('Collection duplicated successfully');
      fetchCollections();
    } catch (err: any) {
      toast.error('Failed to duplicate collection');
    }
    setOpenDropdownId(null);
  };

  const handleToggleFeatured = async (col: any) => {
    try {
      await collectionService.update(col._id, { featured: !col.featured });
      toast.success(col.featured ? 'Removed from featured' : 'Marked as featured');
      fetchCollections();
    } catch (err: any) {
      toast.error('Failed to update featured status');
    }
    setOpenDropdownId(null);
  };

  const handleEdit = (col: any) => {
    setEditingId(col._id);
    setFormData({
      name: col.name || '',
      modelNumber: col.modelNumber || '',
      color: col.color || '',
      description: col.description || '',
      category: col.category || '',
      finish: col.finish || '',
      material: col.material || '',
      dimensions: col.dimensions || '',
      status: col.status || 'Active'
    });
    setImages(col.images?.length ? col.images : col.image ? [col.image] : []);
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Main photo is required');
      return;
    }

    const formDataPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataPayload.append(key, value);
    });

    images.forEach(img => {
      if (typeof img === 'string') {
        formDataPayload.append('existingImages', img);
      } else {
        formDataPayload.append('images', img);
      }
    });

    try {
      if (editingId) {
        await collectionService.update(editingId, formDataPayload);
        toast.success('Collection updated successfully');
      } else {
        await collectionService.create(formDataPayload);
        toast.success('Collection created successfully');
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save collection');
    }
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      modelNumber: '', 
      color: '', 
      description: '', 
      category: '', 
      finish: '', 
      material: '', 
      dimensions: '',
      status: 'Active'
    });
    setImages([]);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredCollections = collections.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.modelNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-premium-charcoal tracking-tight">Collections</h1>
          <p className="text-gray-500">Manage your luxury product collections and gallery series.</p>
        </div>
        <button 
          onClick={openModal}
          className="bg-premium-charcoal text-white px-6 py-2.5 rounded-xl font-medium tracking-wide hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Collection
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search collections..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[500px]">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6">Collection</th>
                <th className="p-4">Model / Color</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCollections.map(col => (
                <tr key={col._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => handleEdit(col)}>
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                        <img src={col.image || col.images?.[0] || '/placeholder-product.jpg'} alt={col.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-premium-charcoal text-sm">{col.name}</h4>
                        <span className="text-xs text-gray-500 capitalize">{col.category || 'General Collection'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium text-sm">{col.modelNumber || '-'} / {col.color || '-'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase
                      ${col.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                    `}>
                      {col.status || 'Active'}
                    </span>
                  </td>
                    <td className="p-4 pr-6 text-right relative" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <button onClick={(e) => handleOpenDropdown(col._id, e)} className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100">
                            <MoreVertical size={20} />
                          </button>
                          <AnimatePresence>
                            {openDropdownId === col._id && (
                              <motion.div 
                                ref={dropdownRef} 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-visible z-[100] text-left"
                              >
                                <div className="p-2 grid gap-1">
                                  <button onClick={() => handleEdit(col)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Edit2 size={16} /> Edit Details
                                  </button>
                                  <button onClick={() => navigate(`/collections/${col._id}`)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Eye size={16} /> View on Website
                                  </button>
                                  <button onClick={() => handleDuplicate(col)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors">
                                    <Copy size={16} /> Duplicate Collection
                                  </button>
                                  <button onClick={() => handleToggleFeatured(col)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors border-t border-gray-50 mt-1">
                                    <Star size={16} className={col.featured ? "fill-premium-gold text-premium-gold" : ""} /> {col.featured ? 'Remove Featured' : 'Mark as Featured'}
                                  </button>
                                  <button onClick={() => handleDelete(col._id)} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors">
                                    <Trash2 size={16} /> Delete Collection
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                </tr>
              ))}
              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <FolderInput size={48} strokeWidth={1} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">No collections found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col z-10 max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                <h2 className="text-2xl font-bold text-premium-charcoal">{editingId ? 'Edit Collection' : 'Add New Collection'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <form id="collection-form" onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">General Information</h3>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Collection Name *</label>
                       <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. The Apex Series" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Model</label>
                         <input type="text" value={formData.modelNumber} onChange={(e) => setFormData({...formData, modelNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. APX-200" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Primary Color</label>
                         <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. Brushed Gold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Description *</label>
                       <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium h-32 resize-none" placeholder="Elaborate on the collection's design philosophy..."></textarea>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">Detailed Specifications</h3>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Material</label>
                         <input type="text" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. Solid Brass" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Finish</label>
                         <input type="text" value={formData.finish} onChange={(e) => setFormData({...formData, finish: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. Matte Black" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Dimensions</label>
                         <input type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium" placeholder="E.g. Varied" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Visibility Status</label>
                         <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium appearance-none">
                            <option value="Active">Active / Public</option>
                            <option value="Inactive">Hidden / Draft</option>
                         </select>
                       </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-50">Collection Media</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                           <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-32 h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 group-hover:border-premium-charcoal group-hover:text-premium-charcoal group-hover:bg-gray-50 transition-all">
                               <UploadCloud size={28} className="mb-2" />
                               <span className="text-[10px] font-bold uppercase">Upload</span>
                            </div>
                        </div>

                        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-center">
                          {images.map((img, index) => (
                             <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} key={index} className="relative w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-gray-100 group shadow-sm bg-white">
                               <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                               {index === 0 && (
                                 <div className="absolute top-2 left-2 bg-premium-charcoal text-white text-[8px] uppercase font-bold px-2 py-1 rounded-full shadow-lg">Main</div>
                               )}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                  <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white/20 text-white rounded-full hover:bg-red-500 transition-colors transform hover:scale-110 backdrop-blur-md">
                                    <Trash2 size={16} />
                                  </button>
                               </div>
                             </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-gray-500 font-bold tracking-wide hover:text-black transition-colors">Cancel</button>
                <button type="submit" form="collection-form" className="flex-1 py-3.5 bg-premium-charcoal text-white rounded-xl font-bold tracking-wide hover:bg-black transition-all shadow-xl shadow-black/10">
                  {editingId ? 'Update Collection' : 'Publish Collection'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCollections;
