import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';
import PageLayout from '../../components/common/PageLayout';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedAuth = useRef(false);

  useEffect(() => {
    // Systematic fix for duplicate toasts and re-processing
    if (hasProcessedAuth.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (token && userStr) {
      hasProcessedAuth.current = true;
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Navigation only (OAuth redirect): no success toast for a clean/premium UX.
        // Redirect to Home Page instead of Dashboard
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }

    if (error) {
      hasProcessedAuth.current = true;
      toast.error(decodeURIComponent(error), { toastId: 'login-error' });
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = 'http://localhost:2112/api/auth/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin Access Logic
    if (formData.email === 'azlikadmin@gmail.com' && formData.password === 'azlikadmin21') {
      const adminUser = {
        name: 'Azlik Admin',
        email: 'azlikadmin@gmail.com',
        role: 'admin',
        id: 'admin_123'
      };
      
      // Create admin session
      localStorage.setItem('adminToken', 'premium_admin_token_xyz');
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      toast.success('Admin login successful. Opening dashboard...', { toastId: 'admin-login-success' });
      
      setTimeout(() => {
        navigate('/admin-dashboard', { replace: true });
      }, 500);
      return;
    }

    try {
      const response = await axios.post('http://localhost:2112/api/auth/login', formData);
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Login successful. Welcome back, ${user.email}`, { toastId: 'login-success' });
      
      // Redirect to Home Page instead of Dashboard
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials', { toastId: 'login-error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="premium-input-group">
            <div className="premium-input-container">
              <Mail className="premium-icon" />
              <input 
                type="email" 
                id="email"
                placeholder=" " 
                className="premium-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
              <label htmlFor="email" className="premium-label">Email Address</label>
            </div>
          </div>

          <div className="premium-input-group">
            <div className="premium-input-container">
              <Lock className="premium-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder=" " 
                className="premium-input pr-10"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
              <label htmlFor="password" className="premium-label">Password</label>
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 text-gray-400 hover:text-premium-charcoal transition-colors z-10"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-4">
            <Link to="/forgot-password" virtual-id="forgot-password" className="text-[10px] text-gray-400 hover:text-premium-charcoal uppercase tracking-widest font-bold transition-colors">
              Forgot Password?
            </Link>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit" 
              disabled={loading}
              className="premium-button w-full flex items-center justify-center"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-white px-4 text-gray-400">OR</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-gray-200 py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957a8.996 8.996 0 000 8.088l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.956L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-600">Continue with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            New to AZLIK? {' '}
            <Link to="/signup" className="text-premium-charcoal hover:underline font-semibold tracking-wide">
              CREATE ACCOUNT
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageLayout>
  );
};

export default Login;
