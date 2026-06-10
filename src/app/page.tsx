"use client";

import React, { useState, useEffect } from "react";
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

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isProcessingPayment) return;

    const items = cartItems.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      qty: i.quantity,
      price: i.product.price,
    }));
    const total = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

    setIsProcessingPayment(true);

    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: `oh_${Date.now()}`,
          notes: { userEmail: userEmail || "guest" },
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || "Could not initiate payment");
      }

      // Sandbox mode or Razorpay script unavailable — confirm allocation directly
      if (orderData.isSandbox || typeof window === "undefined" || typeof window.Razorpay === "undefined") {
        await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: userEmail || "guest",
            items,
            total,
            razorpay_order_id: orderData.order.id,
          }),
        });
        setToastMessage("Private allocation request sent! Our tea concierge will review your registry allocations.");
        setCartItems([]);
        setIsCartOpen(false);
        setIsProcessingPayment(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Origin Hills",
        description: "Estate Tea Reserve Allocation",
        order_id: orderData.order.id,
        prefill: { email: userEmail || "" },
        theme: { color: "#0D1F16" },
        handler: async (response) => {
          try {
            await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userEmail: userEmail || "guest",
                items,
                total,
              }),
            });
            setToastMessage("Payment confirmed! Your estate allocation is secured.");
            setCartItems([]);
            setIsCartOpen(false);
          } catch {
            setToastMessage("Payment received, but confirmation failed. Our concierge will follow up.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            setToastMessage("Payment cancelled. Your reserve cart is still saved.");
          },
        },
      });

      rzp.on("payment.failed", () => {
        setIsProcessingPayment(false);
        setToastMessage("Payment failed. Please try again or use a different method.");
      });

      rzp.open();
    } catch (e: any) {
      setIsProcessingPayment(false);
      setToastMessage(e.message || "Could not start payment. Please try again.");
    }
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
