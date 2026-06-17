"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/portfolio/Header";
import { Hero } from "@/components/portfolio/Hero";
import { Heritage } from "@/components/portfolio/Heritage";
import { BrandPhilosophy } from "@/components/portfolio/BrandPhilosophy";
import { CollectionGrid } from "@/components/portfolio/CollectionGrid";
import { SourcingMap } from "@/components/portfolio/SourcingMap";
import { BrewingGuide } from "@/components/portfolio/BrewingGuide";
import { TastingNotes } from "@/components/portfolio/TastingNotes";
import { InteractiveFlavorWheel } from "@/components/portfolio/InteractiveFlavorWheel";
import { ImageGallery } from "@/components/portfolio/ImageGallery";
import { ConnoisseurRegistry } from "@/components/portfolio/ConnoisseurRegistry";
import { AuthModal } from "@/components/portfolio/AuthModal";
import { CartDrawer, CartItem } from "@/components/portfolio/CartDrawer";
import { ProductDetailsModal } from "@/components/portfolio/ProductDetailsModal";
import { LuxuryToast } from "@/components/portfolio/LuxuryToast";
import { Footer } from "@/components/portfolio/Footer";
import { TeaProduct } from "@/components/portfolio/ProductCard";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<TeaProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TeaProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch products from API — normalise _id → id
  useEffect(() => {
    fetch("/api/products?active=true")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          const normalised = data.products.map((p: any) => ({
            ...p,
            id: p._id?.toString() ?? p.id,
          }));
          setProducts(normalised);
        }
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, []);

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem("origin_hills_user");
    if (saved) setUserEmail(saved);
  }, []);

  // Restore cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("origin_hills_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("origin_hills_cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("origin_hills_cart");
    }
  }, [cartItems]);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    localStorage.setItem("origin_hills_user", email);
    setToastMessage(`Securely logged into Connoisseur Registry as ${email}`);
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem("origin_hills_user");
    setToastMessage("Registry credentials cleared. Safe travels.");
  };

  const handleAddToCart = (product: TeaProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= 3) {
          setToastMessage(`Limit reached. Maximum 3 allocated tins per customer for ${product.name}`);
          return prev;
        }
        setToastMessage(`Incremented cellar allocation share of ${product.name}`);
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      setToastMessage(`Allocated 1 tin of ${product.name} to your cellar reserve`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveCartItem = (id: string) => {
    const match = cartItems.find((i) => i.product.id === id);
    if (match) setToastMessage(`Removed ${match.product.name} from your allocation list`);
    setCartItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const scrollExplore = () => {
    document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-forest selection:bg-forest selection:text-ivory">
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Hero
          onExploreClick={scrollExplore}
          onRegistryClick={() => (userEmail ? scrollExplore() : setIsAuthOpen(true))}
        />
        <Heritage />
        <BrandPhilosophy />

        <CollectionGrid
          products={products}
          loading={productsLoading}
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
        />

        <InteractiveFlavorWheel
          products={products}
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
        />

        <SourcingMap />
        <BrewingGuide />
        <TastingNotes />
        <ImageGallery />
        <ConnoisseurRegistry />
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleCheckout}
        isProcessing={isProcessingPayment}
      />
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
