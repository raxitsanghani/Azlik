
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Search, 
  Tag, 
  AlertCircle,
  Hash,
  ArrowRight
} from 'lucide-react';
import { categoryService } from '../../api/apiService';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    try {
      await categoryService.create(newCategory.trim());
      toast.success('Category added successfully');
      setNewCategory('');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all products linked to this category.`)) {
      try {
        await categoryService.delete(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err: any) {
        toast.error('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-premium-charcoal tracking-tight">Accessory Categories</h1>
        <p className="text-gray-500">Manage the global categories used across the user panel and product catalog.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-premium-charcoal/5 flex items-center justify-center text-premium-charcoal">
                <Plus size={20} />
              </div>
              <h3 className="text-xl font-bold text-premium-charcoal">Add Category</h3>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category Name</label>
                <input 
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Towel Rings"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-premium-charcoal/10 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newCategory.trim()}
                className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg
                  ${isSubmitting || !newCategory.trim() 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-premium-charcoal text-white hover:bg-black hover:shadow-xl hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Saving...' : <><Plus size={16} /> Save Category</>}
              </button>
            </form>

            <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-900 mb-1">Important Note</p>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  Deleting a category will automatically remove all products associated with it from the database. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Category List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-premium-gold/5 flex items-center justify-center text-premium-gold">
                    <Tag size={20} />
                 </div>
                 <h3 className="text-xl font-bold text-premium-charcoal">Existing Categories</h3>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-premium-charcoal/5 w-full md:w-64"
                />
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="p-20 text-center">
                  <div className="w-10 h-10 border-2 border-premium-charcoal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">Fetching Vault...</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-20 text-center">
                   <Hash size={48} className="mx-auto text-gray-100 mb-4" />
                   <p className="text-gray-400 font-medium">No matching categories found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {filteredCategories.map((cat, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={cat._id}
                        className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-premium-charcoal/20 group-hover:text-premium-gold transition-colors font-bold text-sm">
                              {idx + 1}
                           </div>
                           <span className="font-bold text-premium-charcoal tracking-tight">{cat.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(cat._id, cat.name)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Category"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-50">
               <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <span>Total Categories: {categories.length}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>Live Database Sync</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
