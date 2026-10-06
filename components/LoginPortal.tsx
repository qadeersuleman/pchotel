'use client';

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Key,
  Building2,
  UtensilsCrossed,
  UserCheck,
  Zap,
} from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (portal: 'hotel' | 'restaurant', username: string) => void;
  onReplaySplash: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export default function LoginPortal({
  onLoginSuccess,
  onReplaySplash,
  isDarkTheme,
  onToggleTheme,
}: LoginPortalProps) {
  const [selectedRole, setSelectedRole] = useState<'hotel' | 'restaurant'>('restaurant');
  const [email, setEmail] = useState('chef@pcinnhotel.com');
  const [password, setPassword] = useState('pos123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const quickLogins = [
    {
      role: 'hotel' as const,
      label: 'Admin (rfjalbani)',
      email: 'rfjalbani@pcinnhotel.com',
      pass: 'admin123',
      user: 'rfjalbani',
      badge: 'Hotel PMS',
    },
    {
      role: 'restaurant' as const,
      label: 'Head Chef (Ghulam)',
      email: 'chef@pcinnhotel.com',
      pass: 'pos123',
      user: 'Chef Ghulam Rasool',
      badge: 'Restaurant POS',
    },
    {
      role: 'hotel' as const,
      label: 'Front Desk Night Audit',
      email: 'reception@pcinnhotel.com',
      pass: 'audit123',
      user: 'Kashif Ali (FD)',
      badge: 'Front Desk',
    },
  ];

  const handleRoleSelect = (role: 'hotel' | 'restaurant') => {
    setSelectedRole(role);
    if (role === 'hotel') {
      setEmail('rfjalbani@pcinnhotel.com');
      setPassword('admin123');
    } else {
      setEmail('chef@pcinnhotel.com');
      setPassword('pos123');
    }
  };

  const handleQuickLoginSelect = (q: typeof quickLogins[0]) => {
    setSelectedRole(q.role);
    setEmail(q.email);
    setPassword(q.pass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both work email and password.');
      return;
    }

    setIsLoading(true);

    const isHotel = selectedRole === 'hotel' || email.includes('rfjalbani') || email.includes('admin') || email.includes('reception');
    const targetPortal = isHotel ? 'hotel' : 'restaurant';
    const targetUser = isHotel
      ? (email.includes('reception') ? 'Kashif Ali (FD)' : 'rfjalbani')
      : 'Chef Ghulam Rasool';

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        `Identity verified! Loading ${
          targetPortal === 'hotel' ? 'Pakistan Club Inn Hotel PMS' : 'Lazzati Restaurant POS'
        }...`
      );
      setTimeout(() => {
        onLoginSuccess(targetPortal, targetUser);
      }, 700);
    }, 850);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2000);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-500 ${
        isDarkTheme ? 'bg-[#121214] text-[#FAFAFA]' : 'bg-[#FAFAFA] text-[#18181B]'
      }`}
    >
      {/* Background Ambient Glows with Luxury Rose / Crimson Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E63946]/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#FFF1F2] blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#E63946]/[0.03] blur-3xl pointer-events-none" />
      </div>

      {/* Top Floating Controls */}
      <div className="fixed top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={onReplaySplash}
          title="Replay Splash Screen"
          className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm border backdrop-blur-md cursor-pointer border-zinc-200 bg-white/90 hover:bg-zinc-100 text-zinc-700"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
          <span>Splash Intro</span>
        </button>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border backdrop-blur-md cursor-pointer border-zinc-200 bg-white/90 hover:bg-zinc-100 text-zinc-700"
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-zinc-700" />}
        </button>
      </div>

      {/* Top Branding Pill with User's Signature Colors */}
      <div className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-wider uppercase font-bold backdrop-blur-md shadow-sm border-[#E63946]/20 bg-[#FFF1F2] text-[#E63946] animate-fade-in-up">
        <Key className="w-3.5 h-3.5 text-[#E63946]" />
        <span>PAKISTAN CLUB INN HOTEL &bull; SUKKUR</span>
      </div>

      {/* Main Login Card */}
      <div
        className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border backdrop-blur-xl relative z-10 transition-all duration-300 ${
          isDarkTheme
            ? 'bg-[#18181B]/95 border-white/10 shadow-black/60'
            : 'bg-white/95 border-zinc-200/90 shadow-zinc-300/60'
        }`}
      >
        {/* Header with Dark Luxury #18181B and subtle Red Shimmer */}
        <div className="shimmer-header text-white py-6 px-6 text-center border-b border-white/10">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E63946] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-[#E63946]/30 font-black text-lg mx-auto mb-2.5">
              PC
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              PORTAL ACCESS
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-zinc-300 text-xs mt-1 tracking-wider uppercase font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E63946]" />
              <span>Multi-Role Hotel PMS &amp; Restaurant POS</span>
            </div>
          </div>
        </div>

        {/* Portal Role Tabs */}
        <div className="p-2.5 bg-zinc-100/80 border-b border-zinc-200 grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSelect('hotel')}
            className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'hotel'
                ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/30 font-extrabold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/70'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hotel (HMS)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('restaurant')}
            className={`py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'restaurant'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-extrabold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/70'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurant (POS)</span>
          </button>
        </div>

        {/* Quick 1-Click Role Switcher */}
        <div className="px-6 pt-4 pb-1">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#E63946]" />
            <span>Quick Select Demo Accounts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickLogins.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickLoginSelect(q)}
                className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  email === q.email
                    ? 'bg-[#FFF1F2] border-[#E63946]/40 text-[#E63946] font-bold shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 pt-3">
          {/* Notifications */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/30 text-[#E63946] text-xs flex items-center gap-2 animate-fade-in-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-zinc-500">
                Work Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rfjalbani@pcinnhotel.com"
                  className="w-full px-4 py-3 rounded-2xl text-sm pl-10 pr-4 border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 shadow-xs"
                  required
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-zinc-500">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl text-sm pl-10 pr-10 border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/15 shadow-xs"
                  required
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-[#E63946] accent-[#E63946] cursor-pointer"
                />
                <span className="text-zinc-600 font-medium">Remember credentials</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[#E63946] hover:text-[#d62839] font-bold transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  selectedRole === 'hotel'
                    ? 'btn-luxury-red'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>
                      ACCESS {selectedRole === 'hotel' ? 'HOTEL PMS DASHBOARD' : 'RESTAURANT POS'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Instant Demo Bypass */}
          <div className="mt-4 pt-3 border-t border-zinc-200/80 text-center">
            <button
              onClick={() => onLoginSuccess('hotel', 'rfjalbani')}
              className="text-xs font-bold text-zinc-500 hover:text-[#E63946] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Instant Guest Manager Mode (rfjalbani)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-zinc-200 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 mb-2">Reset Portal Password</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Enter your official Pakistan Club Inn hotel email address to receive password reset instructions.
            </p>
            {forgotSent ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reset link dispatched to IT administration.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="rfjalbani@pcinnhotel.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-zinc-300 outline-none focus:border-[#E63946]"
                  required
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E63946] text-white hover:bg-[#d62839] cursor-pointer"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
