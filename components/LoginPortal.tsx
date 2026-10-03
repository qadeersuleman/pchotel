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
  const [selectedRole, setSelectedRole] = useState<'hotel' | 'restaurant'>('hotel');
  const [email, setEmail] = useState('rfjalbani@pcinnhotel.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleRoleSelect = (role: 'hotel' | 'restaurant') => {
    setSelectedRole(role);
    if (role === 'hotel') {
      setEmail('rfjalbani@pcinnhotel.com');
      setPassword('admin123');
    } else {
      setEmail('restaurant@pcinnhotel.com');
      setPassword('pos123');
    }
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

    // Determine target portal and username
    const isHotel = selectedRole === 'hotel' || email.includes('rfjalbani') || email.includes('admin');
    const targetPortal = isHotel ? 'hotel' : 'restaurant';
    const targetUser = isHotel ? 'rfjalbani' : 'Chef Ghulam Rasool';

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        `Authentication verified! Loading ${
          targetPortal === 'hotel' ? 'Pakistan Club Inn Hotel Dashboard' : 'Lazzati Restaurant POS'
        }...`
      );
      setTimeout(() => {
        onLoginSuccess(targetPortal, targetUser);
      }, 900);
    }, 1000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${
        isDarkTheme ? 'bg-[#0b1120] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Top Controls: Theme Toggle & Replay Intro */}
      <div className="fixed top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={onReplaySplash}
          title="Replay Splash Screen"
          className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm border backdrop-blur-md cursor-pointer border-slate-700/50 bg-slate-800/80 hover:bg-slate-700 text-slate-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Splash Intro</span>
        </button>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border backdrop-blur-md cursor-pointer border-slate-700/50 bg-slate-800/80 hover:bg-slate-700 text-amber-400"
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>
      </div>

      {/* Hotel Banner Top Pill */}
      <div className="mb-5 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-wider uppercase font-semibold backdrop-blur-md shadow-sm border-sky-500/20 bg-sky-500/10 text-sky-400">
        <Key className="w-3.5 h-3.5 text-amber-400" />
        <span>PAKISTAN CLUB INN HOTEL &bull; SUKKUR</span>
      </div>

      {/* Main Login Card */}
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-xl relative z-10 transition-all duration-300 ${
          isDarkTheme
            ? 'bg-slate-900/90 border-slate-800 shadow-sky-950/40'
            : 'bg-white/95 border-slate-200 shadow-slate-300/60'
        }`}
      >
        {/* Header Gradient */}
        <div className="shimmer-header text-white py-6 px-6 text-center">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-wider uppercase drop-shadow-sm">STAFF LOGIN</h2>
            <div className="flex items-center justify-center gap-1.5 text-sky-100 text-xs mt-1 tracking-widest uppercase font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Role Management Portal</span>
            </div>
          </div>
        </div>

        {/* Portal / Role Selection Tabs */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/60 grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSelect('hotel')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'hotel'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hotel (HMS)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('restaurant')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              selectedRole === 'restaurant'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurant (POS)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-7">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-400">
                Work Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rfjalbani@pcinnhotel.com"
                  className={`w-full px-4 py-3 rounded-xl text-sm pl-10 pr-4 border outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20'
                  }`}
                  required
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-400">
                Staff Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-4 py-3 rounded-xl text-sm pl-10 pr-10 border outline-none transition-all ${
                    isDarkTheme
                      ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20'
                  }`}
                  required
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 cursor-pointer accent-sky-500"
                />
                <span className="text-slate-400">Remember credentials</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  selectedRole === 'hotel'
                    ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-400 hover:to-sky-600 shadow-sky-500/25'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 shadow-amber-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span>
                      ENTER {selectedRole === 'hotel' ? 'HOTEL DASHBOARD' : 'RESTAURANT POS'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Selected ID:{' '}
              <strong className="text-slate-300">{selectedRole === 'hotel' ? 'rfjalbani' : 'Chef Ghulam'}</strong>
            </span>
            <button
              onClick={() => handleRoleSelect(selectedRole)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Reset Credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-3 px-6 text-center text-[11px] text-slate-500 border-t border-slate-800/50 bg-slate-950/30">
          &copy; 2026 Pakistan Club Inn Hotel &bull; Developed by Nenosofts IT Solution
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl relative transition-all ${
              isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="text-lg font-bold">Reset Staff Password</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Enter your registered work email to receive password reset instructions.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reset token sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@pcinnhotel.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none ${
                    isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                  }`}
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition"
                  >
                    Send Reset Link
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
