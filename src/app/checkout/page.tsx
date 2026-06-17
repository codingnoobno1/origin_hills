"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Loader2,
  AlertCircle,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { CartItem } from "@/components/portfolio/CartDrawer";
import { Button, Input, Badge, LuxuryDivider } from "@/components/portfolio/ui-elements";
import { LuxuryToast } from "@/components/portfolio/LuxuryToast";

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  // Cart & Session State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Pincode Lookup States
  const [pincodeChecking, setPincodeChecking] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // General States
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Load cart and email on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("origin_hills_cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        setCartItems(parsed);
        const subtotal = parsed.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalAmount(subtotal);
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
    setLoadingCart(false);

    const savedUser = localStorage.getItem("origin_hills_user");
    if (savedUser) {
      setEmail(savedUser);
    }
  }, []);

  // Indian Pincode Auto-verification lookup
  useEffect(() => {
    // Standard Indian Pincode regex (6 digits, not starting with 0)
    const pinRegex = /^[1-9][0-9]{5}$/;

    if (pincode.length === 6) {
      if (!pinRegex.test(pincode)) {
        setPincodeError("Invalid Indian pincode format (should be 6 digits and cannot start with 0)");
        setPincodeVerified(false);
        return;
      }

      setPincodeChecking(true);
      setPincodeError(null);

      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
            const office = data[0].PostOffice[0];
            setCity(office.District || office.Division || "");
            setState(office.State || "");
            setPincodeVerified(true);
            setPincodeError(null);
            setFormErrors((prev) => ({ ...prev, pincode: undefined, city: undefined, state: undefined }));
          } else {
            setPincodeError("Pincode not found in postal registry. Please enter manually.");
            setPincodeVerified(false);
          }
        })
        .catch(() => {
          setPincodeError("Could not connect to registry. Please enter details manually.");
          setPincodeVerified(false);
        })
        .finally(() => {
          setPincodeChecking(false);
        });
    } else {
      setPincodeVerified(false);
      if (pincode.length > 0 && pincode.length < 6) {
        setPincodeError("Pincode must be 6 digits");
      } else {
        setPincodeError(null);
      }
    }
  }, [pincode]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!addressLine1.trim()) errors.addressLine1 = "Address is required";
    if (!pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      errors.pincode = "Invalid 6-digit Indian pincode";
    }

    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || cartItems.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const items = cartItems.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      qty: i.quantity,
      price: i.product.price,
    }));

    const customerDetails = {
      fullName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    };

    try {
      // 1. Create order on the server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `oh_ch_${Date.now()}`,
          notes: { userEmail: email },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || "Could not initiate payment");
      }

      // 2. Handle Sandbox mode or Razorpay script missing
      if (orderData.isSandbox || typeof window === "undefined" || typeof window.Razorpay === "undefined") {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: email,
            items,
            total: totalAmount,
            razorpay_order_id: orderData.order.id,
            customerInfo: customerDetails,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          localStorage.removeItem("origin_hills_cart");
          setOrderSuccess(verifyData.order);
        } else {
          throw new Error(verifyData.error || "Concierge sandbox confirmation failed");
        }
        setIsProcessing(false);
        return;
      }

      // 3. Initiate real Razorpay checkout
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Origin Hills",
        description: "Estate Tea Reserve Allocation",
        order_id: orderData.order.id,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: { color: "#0D1F16" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userEmail: email,
                items,
                total: totalAmount,
                customerInfo: customerDetails,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              localStorage.removeItem("origin_hills_cart");
              setOrderSuccess(verifyData.order);
            } else {
              throw new Error(verifyData.error || "Verification failed");
            }
          } catch (err: any) {
            setToastMessage("Payment received, but confirmation failed. Our concierge will follow up.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setToastMessage("Payment cancelled. Your reserve cart is still saved.");
          },
        },
      });

      rzp.on("payment.failed", (response: any) => {
        setIsProcessing(false);
        setToastMessage(`Payment failed: ${response.error?.description || "Please try again."}`);
      });

      rzp.open();
    } catch (e: any) {
      setIsProcessing(false);
      setToastMessage(e.message || "Failed to start payment process. Please try again.");
    }
  };

  // Render Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-ivory text-forest selection:bg-forest selection:text-ivory flex flex-col justify-between py-12 px-4 md:px-8">
        {/* Header */}
        <header className="max-w-4xl mx-auto w-full text-center mb-8 animate-fade-in">
          <span className="font-serif text-2xl tracking-[0.2em] uppercase text-forest font-bold">
            Origin Hills
          </span>
          <p className="text-[10px] tracking-[0.25em] text-gold uppercase mt-1">
            Single-Estate Private Reserve
          </p>
        </header>

        {/* Core Content */}
        <main className="max-w-2xl mx-auto w-full bg-ivory-light border border-gold/30 p-8 md:p-12 shadow-xl rounded-none relative overflow-hidden animate-fade-slide-up">
          <div className="absolute top-0 right-0 p-4">
            <Sparkles className="w-5 h-5 text-gold/40 animate-pulse" />
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Elegant Checkmark */}
            <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center bg-forest/5 mb-6">
              <Check className="w-8 h-8 text-gold stroke-[1.5]" />
            </div>

            <h1 className="text-2xl font-serif text-forest tracking-wide mb-2 uppercase">
              Allocation Secured
            </h1>
            <p className="text-xs text-forest/70 font-sans max-w-md leading-relaxed mb-6">
              Your cellar reserve share has been authenticated. Our estate concierge will arrange private, vacuum-sealed transit for your leaves.
            </p>

            <Badge variant="gold" className="px-4 py-1.5 text-[10px] tracking-[0.15em] mb-8">
              Order ID: {orderSuccess._id}
            </Badge>
          </div>

          <LuxuryDivider />

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans mt-4">
            <div>
              <h3 className="font-serif text-forest uppercase tracking-wider font-semibold mb-3">
                Collector Credentials
              </h3>
              <p className="font-bold text-forest">{orderSuccess.customerInfo?.fullName}</p>
              <p className="text-forest/70 mt-1">{orderSuccess.customerInfo?.phone}</p>
              <p className="text-forest/70">{orderSuccess.customerInfo?.email}</p>
            </div>

            <div>
              <h3 className="font-serif text-forest uppercase tracking-wider font-semibold mb-3">
                Vault Delivery Address
              </h3>
              <p className="text-forest/70">{orderSuccess.customerInfo?.addressLine1}</p>
              {orderSuccess.customerInfo?.addressLine2 && (
                <p className="text-forest/70">{orderSuccess.customerInfo?.addressLine2}</p>
              )}
              <p className="text-forest/70">
                {orderSuccess.customerInfo?.city}, {orderSuccess.customerInfo?.state} - {orderSuccess.customerInfo?.pincode}
              </p>
            </div>
          </div>

          <LuxuryDivider />

          {/* Items */}
          <div className="mt-4">
            <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mb-4">
              Reserved Vintages
            </h3>
            <div className="divide-y divide-gold/10">
              {orderSuccess.items.map((item: any) => (
                <div key={item.productId} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-forest">{item.name}</span>
                    <span className="text-forest/50 font-sans ml-2">Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold tracking-wider text-forest">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gold/20 font-sans text-xs">
              <span className="font-medium text-forest/60">Estimated Total Secured</span>
              <span className="font-bold text-forest text-sm tracking-wider">
                ₹{orderSuccess.total?.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              onClick={() => router.push("/")}
              variant="primary"
              className="px-8 py-3.5 text-xs font-semibold tracking-[0.15em]"
            >
              Return to Estate Cellar
            </Button>
          </div>
        </main>

        <footer className="text-center text-[10px] text-forest/40 font-sans uppercase tracking-[0.15em] mt-8">
          © {new Date().getFullYear()} Origin Hills Ltd. ✦ All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-forest selection:bg-forest selection:text-ivory flex flex-col justify-between">
      {/* Checkout Navbar */}
      <header className="border-b border-gold/15 bg-glass-ivory sticky top-0 z-30 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-forest/60 hover:text-forest transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cellar
          </button>

          <div className="text-center">
            <span className="font-serif text-lg tracking-[0.15em] uppercase text-forest font-bold">
              Origin Hills
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-sans text-gold font-bold uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            Secure Allocation
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-10 md:py-16 flex-1">
        {loadingCart ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-xs font-serif text-forest/60 tracking-wider">Retrieving allocations…</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 max-w-sm mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-forest/5 mb-6">
              <ShoppingBag className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-lg font-serif text-forest tracking-wide uppercase mb-2">
              No Allocations Found
            </h2>
            <p className="text-xs text-forest/50 font-sans leading-relaxed mb-8">
              You haven't reserved any estate teas in your cart yet. Browse our collections and add items to begin checkout.
            </p>
            <Button onClick={() => router.push("/")} variant="primary" className="px-6 py-3">
              Browse Vintages
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Section */}
            <div className="lg:col-span-7 space-y-8 animate-fade-slide-up">
              <div>
                <h1 className="text-2xl font-serif text-forest tracking-wide uppercase font-medium">
                  Cellar Allocation Checkout
                </h1>
                <p className="text-xs text-forest/50 font-sans mt-1">
                  Complete your details below to verify and secure your selected reserves.
                </p>
              </div>

              <form onSubmit={handlePay} className="space-y-6">
                {/* Contact Credentials */}
                <div className="bg-ivory-light border border-gold/15 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gold/10">
                    <span className="text-gold text-xs">01</span>
                    <h2 className="text-xs font-serif uppercase tracking-wider text-forest font-semibold">
                      Collector Credentials
                    </h2>
                  </div>

                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={formErrors.fullName}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      placeholder="10-digit mobile number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={formErrors.phone}
                    />

                    <Input
                      label="Email Address"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={formErrors.email}
                    />
                  </div>
                </div>

                {/* Shipping Destination */}
                <div className="bg-ivory-light border border-gold/15 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gold/10">
                    <span className="text-gold text-xs">02</span>
                    <h2 className="text-xs font-serif uppercase tracking-wider text-forest font-semibold">
                      Vault Delivery Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="relative">
                      <Input
                        label="Indian Pincode"
                        placeholder="e.g. 560001"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                        error={formErrors.pincode || (pincodeError ? pincodeError : undefined)}
                        className="pr-10"
                      />
                      <div className="absolute right-3 top-[32px] flex items-center justify-center">
                        {pincodeChecking && (
                          <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        )}
                        {pincodeVerified && !pincodeChecking && (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        )}
                      </div>
                    </div>

                    <div className="pt-5 flex items-center h-full">
                      {pincodeVerified ? (
                        <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-3 py-2.5 font-sans uppercase font-bold tracking-wider w-full">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Pincode Registry Verified</span>
                        </div>
                      ) : pincodeChecking ? (
                        <div className="text-[10px] text-gold-dark font-sans uppercase font-bold tracking-wider px-3 py-2.5">
                          Searching postal records...
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <Input
                    label="Address Line 1"
                    placeholder="House No, Suite, Apartment, Street name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    error={formErrors.addressLine1}
                  />

                  <Input
                    label="Address Line 2"
                    placeholder="Landmark, Area, Locality (Optional)"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="City/District"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      error={formErrors.city}
                      // Allow edits but default is autofilled
                    />

                    <Input
                      label="State"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      error={formErrors.state}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isProcessing}
                  className="w-full font-bold uppercase py-4 tracking-[0.2em] shadow-md hover:shadow-lg transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-forest" />
                      Connecting Secure Concierge Gateway…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay ₹{totalAmount.toFixed(2)} with Razorpay
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 animate-fade-slide-up">
              <div className="bg-ivory-light border border-gold/30 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-gold/10 border-b border-l border-gold/20">
                  <span className="text-[9px] uppercase tracking-widest text-gold-dark font-sans font-bold">
                    Collector Vintages
                  </span>
                </div>

                <h3 className="font-serif text-sm uppercase text-forest tracking-wider mb-6">
                  Reserve Allocation Summary
                </h3>

                {/* Items */}
                <div className="divide-y divide-gold/10 max-h-[320px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-4">
                      <div className="w-14 h-16 bg-forest/10 border border-gold/10 overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[11px] font-serif font-bold text-forest line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-[8px] font-sans text-gold-dark font-bold uppercase tracking-widest block mt-0.5">
                            {item.product.category} ✦ {item.product.origin}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-forest/50">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-[11px] font-sans font-bold text-forest">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <LuxuryDivider className="my-6" />

                {/* Subtotals */}
                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between items-center text-forest/60">
                    <span>Cellar Subtotal</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-forest/60">
                    <span>Concierge Secure Delivery</span>
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gold/15 text-sm font-bold text-forest">
                    <span>Estimated Total Allocation</span>
                    <span className="tracking-wide">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-8 flex items-start gap-2.5 p-3.5 bg-forest/5 border border-gold/10 text-[9px] font-sans leading-relaxed text-forest/70">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>
                    <strong>Origin Hills Certificate Guarantee.</strong> Under our priority allocation protocols, your reserved leaves are packaged directly at origin inside secure light-proof canisters.
                  </span>
                </div>
              </div>

              {/* concierg support */}
              <div className="border border-gold/15 bg-ivory-light p-4 text-center text-[10px] font-sans text-forest/50 leading-relaxed uppercase tracking-wider">
                Estate Concierge Helpdesk ✦ 1-800-HILLS-TEA
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-6 bg-ivory text-center">
        <p className="text-[10px] font-sans text-forest/40 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Origin Hills Ltd. ✦ Secure checkout verified.
        </p>
      </footer>

      {/* Fullscreen Concierge Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-forest/90 backdrop-blur-md flex flex-col items-center justify-center text-center px-4 animate-fade-in">
          <div className="max-w-xs space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <Loader2 className="w-16 h-16 animate-spin text-gold stroke-[1.5]" />
              <div className="absolute inset-0 flex items-center justify-center text-gold text-xs">
                ✦
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-base text-ivory tracking-wider uppercase">
                Securing Private Allocation
              </h3>
              <p className="text-[10px] font-sans text-sage leading-relaxed uppercase tracking-widest animate-pulse">
                Awaiting estate concierge verification…
              </p>
            </div>
            <p className="text-[9px] font-sans text-sage/40 leading-relaxed max-w-[200px] mx-auto">
              Do not reload this page. Your secure token allocation request is currently being compiled on the blockchain registry.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <LuxuryToast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
