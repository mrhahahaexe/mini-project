import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Sparkles, AlertCircle, LogIn, UserPlus, Flame, ShieldCheck, Heart } from 'lucide-react';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get('mode');
  const [mode, setMode] = useState(requestedMode === 'signin' ? 'signin' : 'signup');

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'signin' || paramMode === 'signup') {
      setMode(paramMode);
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    diet: 'None',
    rememberMe: true,
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrorMessage('');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const userName = formData.email.split('@')[0];
    const userObj = {
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`,
      loggedIn: true
    };

    if (onLogin) onLogin(userObj);
    setSuccessToast(`Welcome back, ${userObj.name}!`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    const userObj = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      diet: formData.diet,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`,
      loggedIn: true
    };

    if (onLogin) onLogin(userObj);
    setSuccessToast(`Account created! Welcome to LeftOver Chef, ${userObj.name}!`);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-20 right-5 z-50 flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-primary-600 text-white px-6 py-4 rounded-2xl shadow-xl animate-bounce max-w-md">
          <Check className="h-5 w-5 stroke-[3] flex-shrink-0" />
          <span className="font-semibold text-sm">{successToast}</span>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto">
        
        {/* Left Side: Visual Hero Image & Badges (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 group transition-all duration-300 hover:shadow-primary-500/15 h-[460px]">
            <img
              src="/login_banner.png"
              alt="Fresh Culinary Ingredients"
              className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-between p-6">
              <div className="self-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                  <span>AI Powered Kitchen</span>
                </span>
              </div>

              <div className="space-y-3 text-white">
                <h3 className="font-display font-black text-xl leading-tight">
                  Cook Smarter, Waste Less.
                </h3>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  Join thousands of households turning leftover ingredients into delicious zero-waste recipes.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/60 backdrop-blur-sm text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                    <ShieldCheck className="h-3 w-3" /> Food Safety
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/60 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/20">
                    <Flame className="h-3 w-3" /> Macro Tracking
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/60 backdrop-blur-sm text-[10px] font-bold text-rose-300 border border-rose-500/20">
                    <Heart className="h-3 w-3" /> Custom Exclusions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-900/10 space-y-4 transition-all duration-300">
            
            {/* Logo & Header Inside Card */}
            <div className="text-center space-y-2">
              <Link to="/" className="inline-flex items-center space-x-2 group">
                <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-emerald-400 rounded-2xl text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                  <ChefHat className="h-6 w-6" />
                </div>
              </Link>
              <div>
                <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                  {mode === 'signin' ? 'Welcome Back Chef!' : 'Join LeftOver Chef'}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {mode === 'signin'
                    ? 'Sign in to access your saved recipes & AI chat.'
                    : 'Create your account to start cooking smart, zero-waste meals.'}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMessage(''); }}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(''); }}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-fade-in">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5 animate-fade-in">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="chef@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-xs font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-xs font-medium transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label="Toggle Password Visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to your email!")}
                    className="font-bold text-primary-600 dark:text-primary-400 hover:underline text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-xs sm:text-sm"
                >
                  <span>Sign In to Account</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3 animate-fade-in">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Gordon Ramsay"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-xs font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        placeholder="chef@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-xs font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-xs font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-9 pr-7 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-xs font-medium transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Diet Quick-Select */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Primary Diet Goal
                  </label>
                  <select
                    name="diet"
                    value={formData.diet}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  >
                    <option value="None">None (Standard Diet)</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Low Carb">Low Carb</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-0.5 rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span>I agree to the Terms of Service & Privacy Policy</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-xs sm:text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Create Free Account</span>
                </button>
              </form>
            )}

            {/* Social Auth Divider */}
            <div className="relative flex items-center justify-center pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Or Continue With
              </span>
            </div>

            {/* Social Auth Button */}
            <div>
              <button
                type="button"
                onClick={() => {
                  const userObj = { name: "Google Chef", email: "user@google.com", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=google", loggedIn: true };
                  if (onLogin) onLogin(userObj);
                  setSuccessToast("Signed in with Google!");
                  setTimeout(() => navigate('/profile'), 1000);
                }}
                className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:scale-[1.01] transition-all duration-200"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.36v3.15C3.33 21.31 7.39 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.36C.49 8.29 0 10.09 0 12s.49 3.71 1.36 5.44l3.96-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.33 2.69 1.36 6.56l3.96 3.15c.94-2.82 3.58-4.96 6.68-4.96z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
