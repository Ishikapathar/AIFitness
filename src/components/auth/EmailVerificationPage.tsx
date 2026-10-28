import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Dumbbell } from 'lucide-react';
import { authService } from '../../services/authService';

interface EmailVerificationPageProps {
  email: string;
  onNavigate: (route: string) => void;
  onVerifiedSuccess: () => void;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email,
  onNavigate,
  onVerifiedSuccess
}) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const displayEmail = email || 'your.email@example.com';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.trim().length < 4) {
      setError('Please enter a valid 4-digit code (e.g. 1234).');
      return;
    }

    setIsSubmitting(true);
    const res = await authService.verifyEmail(displayEmail, code);
    setIsSubmitting(false);

    if (res.success) {
      setIsVerified(true);
      onVerifiedSuccess();
    } else {
      setError(res.error || 'Verification failed. Try code 1234.');
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(45);
    setResendMessage(`Verification code re-dispatched to ${displayEmail}.`);
    setTimeout(() => setResendMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button onClick={() => onNavigate('/')} className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              FitLife<span className="text-lime-400">AI</span>
            </span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            We sent a 4-digit verification code to
          </p>
          <div className="font-semibold text-lime-400 mt-0.5 text-sm">{displayEmail}</div>
        </div>

        <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {isVerified ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-lime-400/20 text-lime-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Email Successfully Verified</h3>
              <p className="text-xs text-slate-400">
                Your email address is confirmed. You can now configure your biometric profile and custom workout split.
              </p>
              <button
                onClick={() => onNavigate('/onboarding')}
                className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue to Fitness Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {resendMessage && (
                <div className="p-3 bg-lime-950/40 border border-lime-800/80 rounded-lg flex items-start gap-2 text-xs text-lime-300">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                  <span>{resendMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                  Enter 4-Digit Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="1234"
                    className="w-48 text-center tracking-[0.5em] text-2xl font-bold font-mono py-3 bg-[#171E2E] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-lime-400"
                    autoFocus
                  />
                </div>
                <div className="text-[11px] text-slate-500 text-center mt-2">
                  Demo hint: enter <span className="text-lime-400 font-mono">1234</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? <span>Verifying...</span> : <span>Confirm Verification</span>}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="text-xs text-slate-400 hover:text-lime-400 disabled:opacity-40 transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : 'Resend Verification Code'}
                  </span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <button
              onClick={() => onNavigate('/login')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
