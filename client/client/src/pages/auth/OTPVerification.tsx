import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AuthLayout from '../../components/AuthLayout';
import { authService } from '../../api/apiService';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (!savedEmail) {
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleChange = (element: any, index: number) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return toast.error("Please enter full OTP");

    setLoading(true);
    try {
      await authService.verifyOtp({ email, otp: otpValue });
      toast.success("OTP Verified Successfully!");
      localStorage.setItem('verifiedOtp', otpValue);
      navigate('/reset-password');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verification" subtitle={`We've sent a code to ${email}`}>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="flex justify-center gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="otp-input-box"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <div className="space-y-6">
          <button 
            type="submit" 
            disabled={loading}
            className="premium-button w-full flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} />
            {loading ? "VERIFYING..." : "VERIFY OTP"}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-[10px] text-gray-400 hover:text-premium-charcoal uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors font-bold">
              <ArrowLeft size={12} /> Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 tracking-wide">
          Didn't receive the code? {' '}
          <button type="button" className="text-premium-charcoal hover:underline uppercase font-bold tracking-widest ml-1 transition-all">Resend</button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
