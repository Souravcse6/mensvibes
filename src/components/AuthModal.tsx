import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUpTab, setIsSignUpTab] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUpTab) {
      const res = await signUp(email, password, fullName, phone);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Authentication failed');
      }
    }
    setLoading(false);
  };

  const handleQuickDemoCustomer = async () => {
    setLoading(true);
    await signIn('customer@mensvibes.shop', 'demo123');
    setLoading(false);
    onClose();
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    await signIn('admin@mensvibes.shop', 'demo123');
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-colors border border-stone-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xl font-serif font-bold text-amber-100 tracking-wider uppercase">
            MENSVIBES
          </span>
          <p className="text-xs text-stone-400 mt-1">
            {isSignUpTab ? 'Create your footwear profile' : 'Sign in to access orders and wishlist'}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-stone-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setIsSignUpTab(false)}
            className={`w-1/2 pb-2.5 text-center border-b-2 transition-all ${
              !isSignUpTab
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUpTab(true)}
            className={`w-1/2 pb-2.5 text-center border-b-2 transition-all ${
              isSignUpTab
                ? 'border-amber-400 text-amber-400 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUpTab && (
            <div>
              <label className="block text-stone-300 font-medium mb-1">Full Name:</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-300 font-medium mb-1">Email Address:</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          {isSignUpTab && (
            <div>
              <label className="block text-stone-300 font-medium mb-1">Mobile Number:</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-300 font-medium mb-1">Password:</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUpTab ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Quick Evaluation Demo Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500 mb-2 font-medium uppercase tracking-wider">
            Quick One-Click Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={handleQuickDemoCustomer}
              className="py-2 bg-stone-950 hover:bg-stone-800 text-amber-300 border border-stone-800 rounded-lg font-semibold"
            >
              Demo Customer
            </button>
            <button
              onClick={handleQuickDemoAdmin}
              className="py-2 bg-stone-950 hover:bg-stone-800 text-amber-400 border border-amber-800/60 rounded-lg font-semibold"
            >
              Demo Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
