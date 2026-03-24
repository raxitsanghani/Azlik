import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/AuthLayout';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:2112/api/auth/forgot-password', { email });
      toast.info("OTP sent to your email address");
      localStorage.setItem('resetEmail', email);
      navigate('/verify-otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Recover Access" subtitle="Enter your registered email">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="premium-input-group">
          <div className="premium-input-container">
            <Mail className="premium-icon" />
            <input 
              type="email" 
              id="email"
              placeholder=" " 
              className="premium-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label htmlFor="email" className="premium-label">Email Address</label>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="premium-button w-full"
          >
            {loading ? "SENDING OTP..." : "SEND OTP"}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-xs text-gray-400 hover:text-premium-charcoal uppercase flex items-center justify-center gap-2">
            <ArrowLeft size={12} /> Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
