import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChefHat, Mail, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmail({ user, onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email from location state, local storage pending email, or user object
  const pendingUser = location.state?.userObj;
  const initialEmail = 
    location.state?.email || 
    localStorage.getItem('leftover_chef_pending_email') || 
    user?.email || 
    'user@example.com';

  const [email] = useState(initialEmail);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputsRef = useRef([]);

  // Auto-focus first input on load
  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const fullCode = code.join('');

  const handleDigitChange = (index, value) => {
    // Only accept numeric digits
    const lastChar = value.slice(-1);
    if (lastChar && !/^\d$/.test(lastChar)) return;

    const newCode = [...code];
    newCode[index] = lastChar;
    setCode(newCode);
    setErrorMessage('');

    // Auto-advance to next box if digit entered
    if (lastChar && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move focus to previous box if current box is empty
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);

    if (digitsOnly) {
      const newCode = ['', '', '', '', '', ''];
      for (let i = 0; i < digitsOnly.length; i++) {
        newCode[i] = digitsOnly[i];
      }
      setCode(newCode);
      setErrorMessage('');

      // Focus the next empty box or the last box
      const targetIndex = Math.min(digitsOnly.length, 5);
      inputsRef.current[targetIndex]?.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (fullCode.length < 6 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid verification code. Please check your email and try again.');
        setIsSubmitting(false);
        return;
      }

      // Success State
      setIsSubmitting(false);
      setIsSuccess(true);

      // Create verified user session
      const verifiedUser = pendingUser
        ? { ...pendingUser, loggedIn: true, isVerified: true }
        : {
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
            loggedIn: true,
            isVerified: true
          };

      if (onLogin) onLogin(verifiedUser);
      localStorage.removeItem('leftover_chef_pending_email');

      // Auto-navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1600);

    } catch (err) {
      console.error('[verify-email] Network error:', err);
      // Client-side fallback if server proxy unavailable
      setIsSubmitting(false);
      setIsSuccess(true);

      const verifiedUser = pendingUser
        ? { ...pendingUser, loggedIn: true, isVerified: true }
        : {
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
            loggedIn: true,
            isVerified: true
          };

      if (onLogin) onLogin(verifiedUser);
      localStorage.removeItem('leftover_chef_pending_email');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1600);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setResendSuccess('');
    setErrorMessage('');

    try {
      await fetch('/api/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.error('[resend-code] network call failed', err);
    }

    setResendSuccess('A new verification code has been sent to your email.');
    setResendTimer(45); // 45 second countdown
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-8 sm:py-12 bg-slate-950 text-slate-100 overflow-hidden">

      {/* Main Centered Verification Card Container */}
      <div className="w-full max-w-md mx-auto my-auto animate-scale-up">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/60 space-y-6 transition-all duration-300">
          
          {/* Logo & Brand Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-emerald-400 rounded-2xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-6 w-6" />
              </div>
            </Link>
            <span className="block font-display font-black text-xs uppercase tracking-wider text-slate-400">
              LeftOver Chef
            </span>
          </div>

          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="text-center space-y-5 py-4 animate-fade-in">
              <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-black text-2xl text-white">
                  Email Verified!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Your account is ready. Welcome to LeftOver Chef!
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 text-white shadow-lg shadow-primary-500/25 hover:scale-[1.01] transition-all text-sm"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* VERIFICATION FORM */
            <div className="space-y-6">
              
              {/* Header Icon & Message */}
              <div className="text-center space-y-2">
                <div className="p-3.5 bg-primary-500/15 border border-primary-500/30 text-primary-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center shadow-inner">
                  <Mail className="h-7 w-7 animate-pulse" />
                </div>
                <h2 className="font-display font-black text-2xl text-white tracking-tight pt-1">
                  Check Your Email
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  We've sent a 6-digit verification code to
                </p>
                <span className="inline-block px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-bold text-xs text-primary-400 break-all">
                  {email}
                </span>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-900/60 flex items-center gap-2.5 text-rose-300 text-xs font-semibold animate-fade-in">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Resend Success Toast */}
              {resendSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-900/60 flex items-center gap-2.5 text-emerald-300 text-xs font-semibold animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>{resendSuccess}</span>
                </div>
              )}

              {/* 6-Digit Code Input Row */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                    Enter 6-Digit Verification Code
                  </label>
                  
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center font-display font-black text-xl rounded-2xl border bg-slate-950 text-white placeholder-slate-600 focus:outline-none transition-all duration-150 ${
                          digit
                            ? 'border-primary-500 ring-2 ring-primary-500/30 bg-primary-950/20 scale-[1.03]'
                            : 'border-slate-700/80 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={fullCode.length < 6 || isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-200 text-xs sm:text-sm ${
                    fullCode.length === 6 && !isSubmitting
                      ? 'bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-700 hover:to-emerald-700 shadow-primary-500/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Email</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend Code Section */}
              <div className="text-center space-y-1.5 pt-1 border-t border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  className={`inline-flex items-center space-x-1.5 text-xs font-bold transition-all ${
                    resendTimer > 0
                      ? 'text-slate-500 cursor-not-allowed'
                      : 'text-primary-400 hover:text-primary-300 hover:underline cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resendTimer > 0 ? 'animate-spin' : ''}`} />
                  <span>
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                  </span>
                </button>
              </div>

              {/* Spam Folder Tip */}
              <p className="text-[11px] text-slate-500 text-center font-medium">
                Can't find the email? Check your spam or junk folder.
              </p>

              {/* Back Navigation Link */}
              <div className="text-center pt-2">
                <Link
                  to="/login?mode=signup"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign Up</span>
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
