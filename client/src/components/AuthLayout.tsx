import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-premium-charcoal/30 via-premium-charcoal to-premium-charcoal/30"></div>
        
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-widest text-premium-charcoal mb-2 uppercase">{title}</h1>
          {subtitle && <p className="text-gray-500 font-sans text-sm tracking-wide uppercase">{subtitle}</p>}
        </div>

        {children}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 font-serif italic tracking-wider">AZLIK — The Sanctuary Within</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
