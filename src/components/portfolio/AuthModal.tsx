import React, { useState } from "react";
import { X, Sparkles, ShieldCheck } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginFormSuccess = (email: string) => {
    setSuccessInfo(`Welcome, member ${email}. Accessing cellar...`);
    setTimeout(() => {
      onLoginSuccess(email);
      setSuccessInfo(null);
      onClose();
    }, 1800);
  };

  const handleRegisterFormSuccess = (name: string, email: string, customMsg?: string) => {
    setSuccessInfo(customMsg || `Thank you, ${name}. Your allocation registry request is pending approval. Welcome email sent to ${email}.`);
    setTimeout(() => {
      onLoginSuccess(email);
      setSuccessInfo(null);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest/85 backdrop-blur-md cursor-pointer transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-ivory text-forest rounded-none border border-gold/30 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-forest/40 hover:text-forest transition-colors duration-300 cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Left Side: Aesthetic brand column */}
        <div className="md:w-5/12 bg-forest text-ivory p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-auto">
          {/* Subtle gold background pattern effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,168,128,0.08),transparent_70%)]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(197,168,128,0.05),transparent_70%)]" />

          <div className="relative z-10">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-gold uppercase">
              Origin Hills
            </span>
            <h2 className="text-3xl font-serif mt-4 text-ivory leading-tight italic">
              A quiet luxury, steeping in mindfulness.
            </h2>
            <div className="w-12 h-px bg-gold/50 my-6" />
            <p className="text-xs text-ivory/60 font-sans leading-relaxed tracking-wide">
              We invite you to register for allocations of our single-origin, low-yield crops. Sourced exclusively from the clouds of Mount Kanchenjunga and mist-covered gardens of Kyoto.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-ivory/10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[10px] tracking-wide uppercase text-ivory/80">
                100% Certified Single-Estate Allocations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="text-[10px] tracking-wide uppercase text-ivory/80">
                Private Vault Collector Benefits
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative bg-ivory">
          {successInfo ? (
            <div className="flex flex-col items-center justify-center text-center p-6 animate-slide-up">
              <div className="w-12 h-12 bg-forest/5 flex items-center justify-center rounded-full mb-4 border border-gold/20">
                <span className="text-gold text-lg">✦</span>
              </div>
              <h3 className="text-lg font-serif text-forest tracking-wide">Registry Updated</h3>
              <p className="text-xs text-forest/70 max-w-sm mt-3 leading-relaxed font-sans">
                {successInfo}
              </p>
              <div className="w-24 h-0.5 bg-gold/30 mt-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gold w-1/2 animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
          ) : isLogin ? (
            <LoginForm
              onSuccess={handleLoginFormSuccess}
              onToggleForm={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterFormSuccess}
              onToggleForm={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
