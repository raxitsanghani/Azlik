import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    const savedOtp = localStorage.getItem('verifiedOtp');
    if (!savedEmail || !savedOtp) {
      navigate('/login');
    } else {
      setEmail(savedEmail);
      setOtp(savedOtp);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:2112/api/auth/reset-password', { 
        email, 
        otp, 
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      toast.success("Password reset successful. Please login.");
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('verifiedOtp');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="New Password" subtitle="Set your new secure password">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="password" className="premium-label">New Password</label>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 text-gray-400 hover:text-premium-charcoal transition-colors z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="premium-input-group">
          <div className="premium-input-container">
            <Lock className="premium-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              id="confirmPassword"
              placeholder=" " 
              className="premium-input pr-10"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
            <label htmlFor="confirmPassword" className="premium-label">Confirm Password</label>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 text-gray-400 hover:text-premium-charcoal transition-colors z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <button 
            type="submit" 
            disabled={loading}
            className="premium-button w-full flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            {loading ? "SAVING..." : "RESET PASSWORD"}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-[10px] text-gray-400 hover:text-premium-charcoal uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors font-bold">
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
