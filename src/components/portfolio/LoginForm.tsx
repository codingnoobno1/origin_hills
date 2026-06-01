import React, { useState } from "react";
import { Button, Input } from "./ui-elements";

interface LoginFormProps {
  onSuccess: (email: string) => void;
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Mock response
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="text-center mb-2">
        <h3 className="text-xl font-serif text-forest tracking-wide">Welcome Back</h3>
        <p className="text-xs text-forest/50 mt-1 font-sans">
          Access your private allocations & tea cellar registry
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          placeholder="e.g. collector@originhills.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
          required
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-sans text-forest/60">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-5 h-5 accent-gold border-forest/20 rounded-none bg-ivory focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
          />
          Remember my credentials
        </label>
        <button
          type="button"
          className="hover:text-gold transition-colors duration-300 font-semibold cursor-pointer"
        >
          Recover credentials
        </button>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2" disabled={isLoading}>
        {isLoading ? "Verifying Registry..." : "Access Private Cellar"}
      </Button>

      <div className="text-center text-xs font-sans text-forest/50 mt-2">
        Not yet a member?{" "}
        <button
          type="button"
          onClick={onToggleForm}
          className="text-gold font-semibold hover:underline transition-all duration-300 ml-1 cursor-pointer"
        >
          Register for Allocations
        </button>
      </div>
    </form>
  );
};
