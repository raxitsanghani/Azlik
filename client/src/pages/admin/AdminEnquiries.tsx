import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2, 
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLayout from '../../components/admin/AdminLayout';

// Mock Enquiries
const initialEnquiries = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', city: 'New York', product: 'Premium Brass Faucet', date: '2026-04-01', status: 'Pending' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', phone: '+1 987 654 321', city: 'London', product: 'LED Smart Mirror', date: '2026-04-02', status: 'Resolved' },
  { id: '3', name: 'Michael Chen', email: 'mike@example.com', phone: '+1 555 123 456', city: 'San Francisco', product: 'Rainfall Shower Head', date: '2026-04-02', status: 'Pending' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', phone: '+1 444 789 012', city: 'Toronto', product: 'Freestanding Stone Tub', date: '2026-04-03', status: 'Pending' },
];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState(() => {
    const saved = localStorage.getItem('azlik_enquiries');
    return saved ? JSON.parse(saved) : initialEnquiries;
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('azlik_enquiries', JSON.stringify(enquiries));
  }, [enquiries]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    toast.success(`Enquiry marked as ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this enquiry?')) {
      setEnquiries(enquiries.filter(e => e.id !== id));
      toast.success('Enquiry deleted successfully');
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-premium-charcoal tracking-tight">Enquiries</h1>
        <p className="text-gray-500">Manage customer enquiries and product quotes.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or product..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-premium-charcoal/20 transition-all font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium">
          <Filter size={18} />
          Filter Priority
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6 rounded-tl-2xl">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Product Info</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className={`hover:bg-gray-50/50 transition-colors group ${enq.status === 'Pending' ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="p-4 pl-6">
                    <div className="font-bold text-premium-charcoal">{enq.name}</div>
                    <div className="text-sm text-gray-400">{enq.city}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 font-medium">{enq.email}</div>
                    <div className="text-sm text-gray-400">{enq.phone}</div>
                  </td>
                  <td className="p-4 text-sm font-bold text-premium-charcoal">{enq.product}</td>
                  <td className="p-4 text-sm text-gray-500">{enq.date}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wide 
                      ${enq.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}
                    `}>
                      {enq.status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right relative">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {enq.status === 'Pending' ? (
                        <button 
                          onClick={() => handleStatusChange(enq.id, 'Resolved')} 
                          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Resolved"
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStatusChange(enq.id, 'Pending')} 
                          className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Mark as Pending"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(enq.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEnquiries.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No enquiries found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
