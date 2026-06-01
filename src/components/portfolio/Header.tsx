import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { Button } from "./ui-elements";

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  cartCount: number;
  userEmail: string | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenCart,
  cartCount,
  userEmail,
  onLogout,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ease-out py-4 md:py-6 px-6 md:px-12 border-b ${
          isScrolled
            ? "bg-glass-ivory border-gold/15 shadow-sm py-3 md:py-4"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Nav Links (desktop) + Mobile Menu Icon */}
          <div className="flex items-center gap-8 w-1/3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-forest hover:text-gold transition-colors duration-300 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Manifesto", href: "#manifesto" },
                { label: "Collections", href: "#collections" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-forest/75 hover:text-gold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          </div>

          {/* Logo — centered (desktop only) */}
          <a
            href="#"
            className="hidden md:block text-lg md:text-xl font-serif tracking-[0.25em] text-forest select-none hover:text-gold transition-colors duration-300 whitespace-nowrap text-center"
          >
            ORIGIN HILLS
          </a>

          {/* Right Nav Links + Action Row */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Terroir Map", href: "#terroirs" },
                { label: "The Ritual", href: "#ritual" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-forest/75 hover:text-gold transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>
          <div className="flex items-center gap-4 md:gap-6">
            {/* User Access Button */}
            {userEmail ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-[10px] font-sans text-forest/60 tracking-wider">
                  Cellar: <strong className="font-semibold text-forest">{userEmail.split("@")[0]}</strong>
                </span>
                <button
                  onClick={onLogout}
                  className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors duration-300 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-forest hover:text-gold transition-colors duration-300 cursor-pointer"
              >
                <User className="w-4 h-4 stroke-[1.5]" />
                <span className="hidden sm:inline">Registry Access</span>
              </button>
            )}

            {/* Shopping Bag Icon with counter */}
            <button
              onClick={onOpenCart}
              className="relative p-1 text-forest hover:text-gold transition-colors duration-300 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-gold text-forest text-[9px] font-bold rounded-full flex items-center justify-center border border-ivory font-sans animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-ivory flex flex-col pt-24 px-8 md:hidden animate-fade-in">
          <div className="flex flex-col gap-6">
            {[
              { label: "Manifesto", href: "#manifesto" },
              { label: "Collections", href: "#collections" },
              { label: "Terroir Map", href: "#terroirs" },
              { label: "The Ritual", href: "#ritual" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-serif text-forest hover:text-gold transition-colors py-2 border-b border-forest/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-auto mb-12 flex flex-col gap-4 border-t border-forest/10 pt-6">
            {userEmail ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-forest/60 font-sans">
                  Active Cellar Allocation: <strong className="text-forest font-semibold">{userEmail}</strong>
                </span>
                <Button onClick={onLogout} variant="outline" className="w-full">
                  Logout Registry
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                variant="primary"
                className="w-full"
              >
                Register Allocations
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
