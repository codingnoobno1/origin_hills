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

const PRODUCT_DATABASE: TeaProduct[] = [
  {
    id: "silver-needle",
    name: "Silver Needle Imperial",
    category: "White",
    tag: "Rare Reserve",
    origin: "Ilam Valley, Nepal",
    elevation: "2,200m Altitude",
    price: 48.00,
    description: "Comprised exclusively of young, downy buds hand-plucked during the vernal new moon at the extreme ceiling of tea cultivation. Offers a silky, velvet liquor with delicate cucumber and clover honey highlights.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800",
    steepTemp: "80°C",
    steepTime: "4 min",
    tastingNotes: ["Clover Honey", "Cucumber Skin", "Prisinte Meadows"],
    profiles: { aromatic: 9, mineral: 7, floral: 8, roasted: 1, umami: 5 },
  },
  {
    id: "gyokuro-jade",
    name: "Gyokuro Jade Dew",
    category: "Green",
    tag: "Imperial Grade",
    origin: "Uji Kyoto, Japan",
    elevation: "300m Altitude",
    price: 54.00,
    description: "Cultivated using high-end traditional straw screens to shade the plants for 20 days prior to plucking. Shading reduces photosynthesis, triggering massive chlorophyll concentrations and rich savory umami.",
    image: "https://images.unsplash.com/photo-1531215456674-d4c3a2ef975d?q=80&w=800",
    steepTemp: "60°C",
    steepTime: "2 min",
    tastingNotes: ["Sea-Spray Umami", "Steamed Spinach", "Sweet Grass"],
    profiles: { aromatic: 7, mineral: 5, floral: 3, roasted: 1, umami: 10 },
  },
  {
    id: "makaibari-black",
    name: "Makaibari First Flush",
    category: "Black",
    tag: "Equinox Crop",
    origin: "Darjeeling Hills, India",
    elevation: "1,600m Altitude",
    price: 42.00,
    description: "The highly sought-after first spring harvest, hand-picked in early dawn when the mists break. Exceedingly bright, floral, with a signature effervescent muscatel grape skin aroma and long amber honey finish.",
    image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=800",
    steepTemp: "90°C",
    steepTime: "3 min",
    tastingNotes: ["Muscatel Grape", "Crushed Orchids", "Amber Honey"],
    profiles: { aromatic: 10, mineral: 6, floral: 9, roasted: 4, umami: 2 },
  },
  {
    id: "phoenix-dancong",
    name: "Phoenix Cliff Oolong",
    category: "Oolong",
    tag: "Rocky Slope",
    origin: "Wuyi Cliffs, China",
    elevation: "1,000m Altitude",
    price: 62.00,
    description: "Sourced from old-growth bushes nestled inside steep volcanic gorges. The roots pull heavy stone trace minerals, yielding a thick, orange-colored liquor packed with smoky floral honey aromatics.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800",
    steepTemp: "95°C",
    steepTime: "45 sec",
    tastingNotes: ["Charcoal Roast", "Toasted Almond", "Wild Orchids"],
    profiles: { aromatic: 8, mineral: 10, floral: 7, roasted: 9, umami: 3 },
  },
];

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TeaProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync user state on startup (simulate hydration check)
  useEffect(() => {
    const savedUser = localStorage.getItem("origin_hills_user");
    if (savedUser) {
      setUserEmail(savedUser);
    }
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
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        // Limit to 3 tins maximum
        if (existing.quantity >= 3) {
          setToastMessage(`Limit reached. Maximum 3 allocated tins per customer for ${product.name}`);
          return prevItems;
        }
        setToastMessage(`Incremented cellar allocation share of ${product.name}`);
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      setToastMessage(`Allocated 1 tin of ${product.name} to your cellar reserve`);
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleRemoveCartItem = (id: string) => {
    const match = cartItems.find((item) => item.product.id === id);
    if (match) {
      setToastMessage(`Removed ${match.product.name} from your allocation list`);
    }
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleCheckout = () => {
    setToastMessage("Private allocation request sent! Our tea concierge will review and verify your registry allocations.");
    setCartItems([]);
    setIsCartOpen(false);
  };

  const scrollExplore = () => {
    const el = document.getElementById("collections");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-forest selection:bg-forest selection:text-ivory">
      {/* Premium Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Main Sections */}
      <main className="flex-1">
        
        {/* Section 1: Hero Entry */}
        <Hero
          onExploreClick={scrollExplore}
          onRegistryClick={() => (userEmail ? scrollExplore() : setIsAuthOpen(true))}
        />

        {/* Section 2: Heritage manifesto */}
        <Heritage />
        <BrandPhilosophy />

        {/* Section 3: Curated Collections (The Tea Portfolio) */}
        <CollectionGrid
          products={PRODUCT_DATABASE}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
        />
        
        {/* Section 4: Personalized Interactive Match Quiz */}
        <InteractiveFlavorWheel
          products={PRODUCT_DATABASE}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
        />

        {/* Section 5: Terroir Atlas Map */}
        <SourcingMap />

        {/* Section 6: Extraction Ritual & Dials */}
        <BrewingGuide />
        <TastingNotes />
        <ImageGallery />

        {/* Section 7: Cellar newsletter */}
        <ConnoisseurRegistry />

      </main>

      {/* Footer */}
      <Footer />

      {/* Dynamic Overlay Subsystems */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleCheckout}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <LuxuryToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
