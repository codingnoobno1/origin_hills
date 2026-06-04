import React from "react";
import { X, Trash2, ShieldCheck, ShoppingBag } from "lucide-react";
import { TeaProduct } from "./ProductCard";
import { Button } from "./ui-elements";

export interface CartItem {
  product: TeaProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest/80 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-ivory text-forest border-l border-gold/30 shadow-2xl flex flex-col h-full z-10 animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-gold/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h3 className="text-base font-serif tracking-wide uppercase font-medium">
              Collector Cellar Reserve
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-forest/40 hover:text-forest transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center bg-forest/5 mb-4">
                <span className="text-gold">✦</span>
              </div>
              <h4 className="text-sm font-serif text-forest tracking-wide">Reserve is Empty</h4>
              <p className="text-[11px] text-forest/50 font-sans leading-relaxed max-w-[200px] mt-2">
                Begin selecting our certified single-estate micro-crops to secure your allocated share.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 pb-6 border-b border-gold/10 last:border-0 last:pb-0 animate-fade-in"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 bg-forest/10 border border-gold/10 overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-serif font-bold text-forest leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-forest/30 hover:text-red-500/80 transition-colors cursor-pointer"
                        title="Remove selection"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                    </div>
                    <span className="text-[9px] font-sans text-gold-dark font-bold uppercase tracking-widest block mt-0.5">
                      {item.product.category} ✦ {item.product.origin}
                    </span>
                  </div>

                  {/* Quantity and sub-price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-forest/10 bg-ivory-light">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center text-sm text-forest/60 hover:text-forest cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-[10px] font-sans font-bold text-forest">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.min(3, item.quantity + 1))}
                        className="w-9 h-9 flex items-center justify-center text-sm text-forest/60 hover:text-forest cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-sans font-bold text-forest tracking-wider">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gold/15 bg-ivory-light flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs font-sans tracking-wide">
              <span className="text-forest/60">Estimated Allocation Subtotal</span>
              <span className="font-bold text-forest text-sm tracking-widest">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-start gap-2.5 p-3 bg-forest/5 border border-gold/10 text-[10px] font-sans leading-relaxed text-forest/70">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>
                <strong>Certified allocation guarantee.</strong> Your selected vintage leaves are protected under priority reservation and will be vacuum-packaged fresh upon approval.
              </span>
            </div>

            <Button
              onClick={onCheckout}
              variant="secondary"
              className="w-full font-bold uppercase py-4 tracking-[0.15em]"
            >
              Submit Allocation Request
            </Button>

            <button
              onClick={onClose}
              className="text-[10px] font-sans font-semibold uppercase tracking-wider text-forest/50 hover:text-forest text-center transition-colors cursor-pointer"
            >
              Continue Cellar Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
