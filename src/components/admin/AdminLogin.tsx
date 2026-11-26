import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('yadavramashish42449@gmail.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password.trim());
      toast.success('Welcome back, Ram!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative">
      {/* Return to Portfolio button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Portfolio</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-gray-800/60 border border-gray-700/60 p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-blue-500/20">
              RA
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Login</h1>
            <p className="text-gray-400 text-xs mt-1">
              Sign in to manage your resume, skills, and portfolio content
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: ram@2026)"
                  autoComplete="current-password"
                  autoFocus
                  className="w-full rounded-xl bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2.5 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Helper Hint */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
              💡 <strong>Admin Password:</strong> <code className="bg-blue-900/50 px-1 py-0.5 rounded">ram@2026</code>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-3 font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
