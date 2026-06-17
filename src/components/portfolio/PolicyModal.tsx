"use client";

import React from "react";
import { X, Shield, FileText, Truck, RefreshCw, Compass, Info, Mail } from "lucide-react";
import { Badge, LuxuryDivider } from "./ui-elements";

export type PolicyTab = "about" | "privacy" | "terms" | "shipping" | "refunds" | "contact";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PolicyTab;
  setActiveTab: (tab: PolicyTab) => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const tabs: { id: PolicyTab; label: string; icon: React.ReactNode }[] = [
    { id: "about", label: "About Us", icon: <Info className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4" /> },
    { id: "shipping", label: "Shipping Policy", icon: <Truck className="w-4 h-4" /> },
    { id: "refunds", label: "Return & Refund", icon: <RefreshCw className="w-4 h-4" /> },
    { id: "contact", label: "Contact Us", icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-forest/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto animate-fade-in">
      {/* Click backdrop to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main card */}
      <div className="relative w-full max-w-4xl bg-ivory text-forest border border-gold/30 shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[640px] overflow-hidden animate-slide-up rounded-none z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 bg-ivory-light border border-gold/20 hover:border-gold text-forest/50 hover:text-forest transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Left column: Navigation tabs */}
        <div className="md:w-1/3 bg-forest text-ivory p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-gold/15 justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-[8px] font-sans font-bold uppercase tracking-[0.25em] text-gold block">Origin Hills Registry</span>
              <h3 className="font-serif text-lg text-ivory uppercase tracking-wider mt-2">
                Policy Dossier
              </h3>
            </div>

            <nav className="space-y-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-3 md:pb-0 no-scrollbar gap-2 md:gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 text-[10px] font-sans font-bold uppercase tracking-widest border transition-all duration-200 cursor-pointer whitespace-nowrap md:w-full ${
                    activeTab === tab.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-transparent text-ivory/50 hover:text-ivory/80"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2 border-t border-gold/15 pt-4 text-[9px] font-sans text-sage uppercase tracking-wider font-semibold">
            <Compass className="w-3.5 h-3.5 text-gold" />
            <span>Rooted in Origin.</span>
          </div>
        </div>

        {/* Right column: Content panel */}
        <div className="md:w-2/3 p-6 md:p-8 overflow-y-auto bg-ivory flex flex-col justify-between">
          <div className="space-y-6 select-text">
            
            {/* 1. About Us Tab */}
            {activeTab === "about" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Badge variant="gold">About Us</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Our Heritage
                  </h2>
                </div>
                <p className="text-xs text-forest/75 font-sans leading-relaxed font-light">
                  Origin Hills was founded with a simple mission: to bring authentic, premium single-estate teas from the hills of Assam to tea lovers around the world.
                </p>
                <p className="text-xs text-forest/75 font-sans leading-relaxed font-light">
                  We work closely with carefully selected estates to source exceptional loose-leaf teas and craft distinctive blends that celebrate the rich heritage of Indian tea cultivation.
                </p>
                <p className="text-xs text-forest/75 font-sans leading-relaxed font-light">
                  Every batch is chosen for quality, freshness, and character—ensuring a tea experience that reflects the land, craftsmanship, and tradition behind every leaf.
                </p>
                <p className="text-xs text-forest/75 font-sans leading-relaxed font-light">
                  From classic Assam black teas to modern artisan blends, Origin Hills is dedicated to delivering a refined tea experience for customers across the globe.
                </p>
                <LuxuryDivider className="my-6" />
                <div className="text-center font-serif text-xs italic text-gold-dark mt-2">
                  "Rooted in Origin. Crafted for Excellence."
                </div>
              </div>
            )}

            {/* 2. Privacy Policy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-4 animate-fade-in text-xs font-sans text-forest/75 leading-relaxed font-light">
                <div>
                  <Badge variant="gold">Privacy charter</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Privacy Policy
                  </h2>
                  <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-1">Last Updated: June 18, 2026</p>
                </div>
                
                <p>Welcome to Origin Hills.</p>
                <p>Origin Hills respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website or purchase our products.</p>
                
                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Information We Collect</h3>
                <p>We may collect:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping and billing address</li>
                  <li>Payment information processed through secure third-party payment providers</li>
                  <li>Order history</li>
                  <li>Device and browser information</li>
                  <li>Website usage data through cookies and analytics tools</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">How We Use Information</h3>
                <p>We use collected information to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Process orders</li>
                  <li>Deliver products</li>
                  <li>Provide customer support</li>
                  <li>Send order updates</li>
                  <li>Improve website performance</li>
                  <li>Prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Data Security</h3>
                <p>We implement reasonable security measures to protect your personal information. However, no internet transmission can be guaranteed 100% secure.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Third-Party Services</h3>
                <p>We may use trusted third-party services for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Payment processing</li>
                  <li>Shipping and logistics</li>
                  <li>Analytics</li>
                  <li>Email communications</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Cookies</h3>
                <p>Our website uses cookies to enhance user experience and analyze website traffic.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Contact</h3>
                <p>Email: <span className="font-bold text-forest">assam@originhills.com</span></p>
              </div>
            )}

            {/* 3. Terms & Conditions Tab */}
            {activeTab === "terms" && (
              <div className="space-y-4 animate-fade-in text-xs font-sans text-forest/75 leading-relaxed font-light">
                <div>
                  <Badge variant="gold">Legal terms</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Terms & Conditions
                  </h2>
                  <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-1">Last Updated: June 18, 2026</p>
                </div>
                
                <p>By accessing and using Origin Hills, you agree to these Terms and Conditions.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Products</h3>
                <p>Origin Hills offers premium single-estate loose-leaf teas and handcrafted tea blends.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Pricing</h3>
                <p>All prices displayed are subject to change without prior notice.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Orders</h3>
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Accept or reject any order</li>
                  <li>Limit quantities purchased</li>
                  <li>Cancel orders suspected of fraud</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Intellectual Property</h3>
                <p>All content, images, logos, branding, and product descriptions belong to Origin Hills and may not be used without permission.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Limitation of Liability</h3>
                <p>Origin Hills shall not be liable for indirect, incidental, or consequential damages arising from use of our products or website.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Governing Law</h3>
                <p>These terms shall be governed by the laws of India.</p>
              </div>
            )}

            {/* 4. Shipping Policy Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-4 animate-fade-in text-xs font-sans text-forest/75 leading-relaxed font-light">
                <div>
                  <Badge variant="gold">Transit policies</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Shipping Policy
                  </h2>
                  <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-1">Last Updated: June 18, 2026</p>
                </div>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Order Processing</h3>
                <p>Orders are generally processed within 1–3 business days after payment confirmation.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Domestic Shipping</h3>
                <p>Within India:</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Estimated delivery: 3–7 business days</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">International Shipping</h3>
                <p>We currently ship worldwide. Estimated delivery timelines:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Asia:</strong> 5–12 business days</li>
                  <li><strong>Europe:</strong> 7–15 business days</li>
                  <li><strong>North America:</strong> 7–15 business days</li>
                  <li><strong>Other regions:</strong> 7–20 business days</li>
                </ul>
                <p className="text-[10px] text-forest/50 italic mt-2">
                  Delivery timelines may vary due to customs clearance, local regulations, weather conditions, or carrier delays.
                </p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Customs & Duties</h3>
                <p>International customers are responsible for any customs duties, import taxes, VAT, or other fees imposed by their country.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Tracking</h3>
                <p>Tracking information will be provided once your order is dispatched.</p>
              </div>
            )}

            {/* 5. Return & Refund Policy Tab */}
            {activeTab === "refunds" && (
              <div className="space-y-4 animate-fade-in text-xs font-sans text-forest/75 leading-relaxed font-light">
                <div>
                  <Badge variant="gold">Returns registry</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Return & Refund Policy
                  </h2>
                  <p className="text-[10px] text-forest/40 font-sans uppercase tracking-widest mt-1">Last Updated: June 18, 2026</p>
                </div>

                <p>At Origin Hills, customer satisfaction is important to us.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Return Eligibility</h3>
                <p>Products may be returned within 7–15 days from the date of delivery if:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Product remains unopened</li>
                  <li>Packaging is intact</li>
                  <li>Product is unused</li>
                  <li>Proof of purchase is provided</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Non-Returnable Items</h3>
                <p>For safety and hygiene reasons, we cannot accept returns for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Opened tea packages</li>
                  <li>Consumed products</li>
                  <li>Customized orders</li>
                  <li>Gift cards</li>
                </ul>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Damaged or Incorrect Orders</h3>
                <p>If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photographs of the item and packaging.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Refunds</h3>
                <p>Approved refunds will be processed within 5–10 business days after inspection of returned goods. Refunds will be issued through the original payment method.</p>

                <h3 className="font-serif text-xs text-forest uppercase tracking-wider font-semibold mt-4">Return Contact</h3>
                <p>Email: <span className="font-bold text-forest">assam@originhills.com</span></p>
              </div>
            )}

            {/* 6. Contact Us Tab */}
            {activeTab === "contact" && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <Badge variant="gold">Concierge desk</Badge>
                  <h2 className="text-xl font-serif text-forest tracking-wide uppercase mt-2">
                    Contact Us
                  </h2>
                </div>
                
                <div className="bg-ivory-light border border-gold/15 p-5 space-y-4 text-xs font-sans text-forest/75 leading-relaxed font-light">
                  <p className="font-serif font-bold text-forest text-sm uppercase">Origin Hills Sourcing HQ</p>
                  <p>Premium Single Estate Loose Leaf Tea & Artisan Tea Blends</p>
                  
                  <div className="space-y-2 border-t border-gold/10 pt-3">
                    <p><strong>Customer Support:</strong></p>
                    <p className="pl-3">Monday – Saturday<br />9:00 AM – 6:00 PM (IST)</p>
                  </div>
                  
                  <div className="space-y-1 border-t border-gold/10 pt-3">
                    <p>For order inquiries, wholesale opportunities, collaborations, and customer support, please contact us at:</p>
                    <p className="text-gold font-bold text-sm select-all mt-1">assam@originhills.com</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal bottom actions */}
          <div className="mt-8 pt-4 border-t border-gold/15 flex items-center justify-between">
            <span className="text-[8px] font-sans text-forest/40 uppercase tracking-[0.2em]">
              Origin Hills Registry ✦ Authenticated
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 border border-forest text-forest hover:bg-forest hover:text-ivory text-[9px] font-sans font-semibold uppercase tracking-wider transition-all cursor-pointer min-h-[34px]"
            >
              Close Dossier
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
