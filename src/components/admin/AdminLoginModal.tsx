import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, KeyRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithPassword, login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setLoading(true);
    try {
      // 1. Try master password
      const ok = loginWithPassword(password.trim());
      if (ok) {
        toast.success('Admin mode enabled!');
        onClose();
        if (onSuccess) onSuccess();
        return;
      }

      // 2. Try API login
      await login('yadavramashish42449@gmail.com', password.trim());
      toast.success('Admin mode enabled!');
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Incorrect password. Default master password is: example@2026');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-charcoal border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-accent-blue/20">
              <KeyRound size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">Admin Access</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Only you can update your resume and portfolio
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: ram@2026)"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-dark border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors"
                />
                <Lock size={16} className="absolute right-3.5 top-3.5 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-accent-blue/20 transition-all cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Admin Controls'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Direct link to /admin */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
            <span>Prefer full dashboard?</span>
            <button
              onClick={() => {
                onClose();
                navigate('/admin');
              }}
              className="text-accent-cyan hover:underline cursor-pointer font-medium"
            >
              Go to /admin &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
