import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2, ShieldCheck, Truck } from "lucide-react";
import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function CartPage() {
  const { cart, subtotal, clearCart } = useStore();
  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + delivery;
  const progress = Math.min(100, (subtotal / 100) * 100);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState title="Your cart is empty" message="Looks like you haven't added anything yet. Let's fix that." actionLabel="Start shopping" actionTo="/shop" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display flex items-center gap-2.5 text-3xl font-black tracking-tight sm:text-4xl"><ShoppingBag size={28} /> Shopping Cart</h1>
        <button onClick={clearCart} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-400 hover:text-red-600"><Trash2 size={15} /> Clear cart</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {cart.map((item) => <CartItem key={`${item.id}-${item.size}`} item={item} />)}
          <Link to="/shop" className="inline-flex items-center gap-2 pt-2 text-sm font-bold hover:underline"><ArrowRight size={15} className="rotate-180" /> Continue shopping</Link>
        </div>

        <aside className="h-fit rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] lg:sticky lg:top-32">
          <h2 className="font-display text-lg font-extrabold">Order Summary</h2>

          <div className="mt-4">
            <p className="text-xs font-semibold text-neutral-500">
              {delivery === 0 ? "You've unlocked FREE delivery!" : `Add ${formatPrice(100 - subtotal)} more for free delivery`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-5 space-y-2.5 border-t border-dashed border-neutral-200 pt-5 text-sm">
            <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span className="font-semibold text-black">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-neutral-500"><span>Delivery</span><span className="font-semibold text-black">{delivery === 0 ? "FREE" : formatPrice(delivery)}</span></div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-extrabold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          <Link to="/checkout" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800">
            PROCEED TO CHECKOUT <ArrowRight size={16} />
          </Link>

          <div className="mt-5 space-y-2.5 text-xs text-neutral-500">
            <p className="flex items-center gap-2"><Truck size={14} /> Delivery in 2–5 business days</p>
            <p className="flex items-center gap-2"><ShieldCheck size={14} /> Secure checkout · 30-day returns</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
