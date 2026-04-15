import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  Eye, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../api/apiService';
import { useEffect, useState } from 'react';

// Mock Premium Data
const visitorData = [
  { name: 'Mon', visitors: 4000, pageViews: 2400 },
  { name: 'Tue', visitors: 3000, pageViews: 1398 },
  { name: 'Wed', visitors: 2000, pageViews: 9800 },
  { name: 'Thu', visitors: 2780, pageViews: 3908 },
  { name: 'Fri', visitors: 1890, pageViews: 4800 },
  { name: 'Sat', visitors: 2390, pageViews: 3800 },
  { name: 'Sun', visitors: 3490, pageViews: 4300 },
];

const categoryData = [
  { name: 'Faucets', views: 4000 },
  { name: 'Showers', views: 3000 },
  { name: 'Mirrors', views: 2000 },
  { name: 'Accessories', views: 2780 },
  { name: 'Collections', views: 1890 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, delay }: any) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-premium-charcoal" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-premium-charcoal tracking-tight">{value}</div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-premium-charcoal tracking-tight mb-2">Overview</h1>
        <p className="text-gray-500">Welcome back to the Azlik admin dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Visitors" 
          value={stats?.totalVisitors?.toLocaleString() || '...'} 
          icon={Eye} 
          trend="up" 
          trendValue={stats?.trends?.visitors || '...'} 
          delay={0.1} 
        />
        <StatCard 
          title="Total Enquiries" 
          value={stats?.totalEnquiries?.toString() || '...'} 
          icon={MessageSquare} 
          trend="up" 
          trendValue={stats?.trends?.enquiries || '...'} 
          delay={0.2} 
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts?.toString() || '...'} 
          icon={Package} 
          trend="up" 
          trendValue={stats?.trends?.products || '...'} 
          delay={0.3} 
        />
        <StatCard 
          title="Active Users" 
          value={stats?.totalUsers?.toString() || '...'} 
          icon={Users} 
          trend="down" 
          trendValue={stats?.trends?.users || '...'} 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-premium-charcoal">Visitor Analytics</h3>
              <p className="text-sm text-gray-500">Daily website traffic over the last week</p>
            </div>
            <select className="bg-gray-50 border-none text-sm font-medium text-gray-600 rounded-lg px-4 py-2 focus:ring-0 cursor-pointer">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="w-full min-h-[300px] mt-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#111111" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Mini Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-premium-charcoal">Category Views</h3>
            <p className="text-sm text-gray-500">Most popular product categories</p>
          </div>
          <div className="flex-1 min-h-[300px] mt-4 w-full" style={{ height: 300 }}>
             <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} width={80} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="views" fill="#111111" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;
