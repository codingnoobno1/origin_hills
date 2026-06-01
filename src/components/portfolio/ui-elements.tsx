import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-500 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const sizeStyles = {
    sm: "text-[11px] px-4 py-2.5 min-h-[40px] font-semibold gap-1.5",
    md: "text-xs px-6 py-3 min-h-[44px] font-medium gap-2",
    lg: "text-xs px-8 py-4 min-h-[48px] font-medium tracking-[0.1em] gap-2.5",
  };

  const variantStyles = {
    primary: "bg-forest text-ivory border border-forest hover:bg-forest-light hover:border-forest-light shadow-sm active:scale-98",
    secondary: "bg-gold text-forest border border-gold hover:bg-gold-light hover:border-gold-light active:scale-98 font-semibold",
    outline: "bg-transparent text-forest border border-forest/30 hover:border-forest hover:bg-forest/5 active:scale-98",
    ghost: "bg-transparent text-forest hover:bg-forest/5",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] uppercase tracking-wider text-forest/60 font-semibold"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-ivory-light border border-forest/15 px-4 py-3 text-xs text-forest placeholder:text-forest/30 focus:outline-none focus:border-gold transition-all duration-300 font-sans ${
          error ? "border-red-500/50 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500/80 font-sans tracking-wide mt-0.5">{error}</span>}
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "forest" | "sage";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gold",
  className = "",
}) => {
  const styles = {
    gold: "bg-gold/10 text-gold-dark border border-gold/20",
    forest: "bg-forest/5 text-forest border border-forest/10",
    sage: "bg-sage/10 text-sage-dark border border-sage/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest rounded-full font-sans ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const LuxuryDivider: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center my-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gold/20"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase bg-ivory px-4 text-gold font-serif">
        ✦ ✦ ✦
      </div>
    </div>
  );
};
