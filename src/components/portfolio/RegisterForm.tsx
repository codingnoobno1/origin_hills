import React, { useState } from "react";
import { Button, Input } from "./ui-elements";

interface RegisterFormProps {
  onSuccess: (name: string, email: string, customMsg?: string) => void;
  onToggleForm: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onToggleForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preference, setPreference] = useState("rare");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    api?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name) newErrors.name = "Full name is required";
    
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirmation password is required";
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, preference }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registry enrollment failed.");
      }

      setIsLoading(false);
      onSuccess(name, email, data.message);
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ api: err.message || "Ledger transaction failed. Check database logs." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="text-center mb-1">
        <h3 className="text-xl font-serif text-forest tracking-wide">Request Allocations</h3>
        <p className="text-xs text-forest/50 mt-1 font-sans">
          Join the Origin Hills Connoisseur Registry for vintage crop allocations
        </p>
      </div>

      {errors.api && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-sans text-center tracking-wide">
          {errors.api}
        </div>
      )}

      {/* Grid structure for a better structured form layout */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="register-name"
            label="Full Name"
            type="text"
            placeholder="e.g. Alistair Vance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={isLoading}
            required
          />
          <Input
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="e.g. alistair@vance.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            disabled={isLoading}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="register-password"
            label="Registry Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isLoading}
            required
          />
          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full pt-1">
          <label className="text-[10px] uppercase tracking-wider text-forest/60 font-semibold font-sans">
            Primary Sourcing Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rare", label: "Rare Harvest" },
              { id: "rare-blends", label: "Rare Blends" },
              { id: "black", label: "First Flush" },
            ].map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => setPreference(pref.id)}
                className={`py-2.5 px-1.5 text-[10px] uppercase tracking-wider font-sans border text-center transition-all duration-500 cursor-pointer ${
                  preference === pref.id
                    ? "bg-forest text-ivory border-forest"
                    : "bg-ivory border-forest/10 text-forest/60 hover:border-forest/30"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-[10px] font-sans text-forest/60 leading-normal border-t border-gold/15 pt-4">
        <input
          type="checkbox"
          required
          className="w-4 h-4 accent-gold border-forest/20 rounded-none bg-ivory focus:ring-0 focus:ring-offset-0 cursor-pointer mt-0.5 flex-shrink-0"
        />
        <span>
          I accept the terms of private collector allocations and understand that seasonal harvests are strictly limited and allocated on registry maturity.
        </span>
      </div>

      <Button type="submit" variant="secondary" className="w-full font-bold uppercase tracking-wider py-4" disabled={isLoading}>
        {isLoading ? "Submitting Registration..." : "Request Cellar Allocation"}
      </Button>

      <div className="text-center text-xs font-sans text-forest/50 border-t border-gold/10 pt-4">
        Already registered?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-gold font-semibold hover:underline transition-all duration-300 ml-1 cursor-pointer"
        >
          Access Cellar
        </button>
      </div>
    </form>
  );
};
