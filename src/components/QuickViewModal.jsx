import { useState } from "react";
import { X, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";
import SizeSelector from "./SizeSelector";

export default function QuickViewModal() {
  const { quickView, setQuickView, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [size, setSize] = useState(null);

  if (!quickView) return null;
  const p = quickView;
  const wished = isInWishlist(p.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => { setQuickView(null); setSize(null); }} />
      <div className="animate-modal relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <button onClick={() => { setQuickView(null); setSize(null); }} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white" aria-label="Close"><X size={17} /></button>
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-neutral-100">
            <img src={p.images?.[0]} alt={p.name} className="h-64 w-full object-cover sm:h-full sm:min-h-[420px]" />
            {p.discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-bold text-[#e8ff47]">-{p.discount}%</span>}
          </div>
          <div className="flex flex-col p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">{p.brand} · {p.category}</p>
            <h3 className="font-display mt-1 text-2xl font-extrabold leading-tight">{p.name}</h3>
            <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-neutral-500"><Star size={14} className="fill-amber-400 text-amber-400" /> {p.rating?.toFixed(1)} · {p.reviews} reviews</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold">{formatPrice(p.price)}</span>
              {p.oldPrice && <span className="text-sm text-neutral-400 line-through">{formatPrice(p.oldPrice)}</span>}
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-500">{p.description}</p>

            <div className="mt-5">
              <SizeSelector sizes={p.sizes} selected={size} onChange={setSize} />
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => { addToCart(p, size); setQuickView(null); setSize(null); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-extrabold text-white hover:bg-neutral-800"
              >
                <ShoppingBag size={16} /> ADD TO CART
              </button>
              <button onClick={() => toggleWishlist(p)} aria-label="Wishlist" className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${wished ? "border-black bg-black text-[#e8ff47]" : "border-neutral-200 hover:border-black"}`}>
                <Heart size={18} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>
            <Link to={`/product/${p.id}`} onClick={() => setQuickView(null)} className="mt-3 text-center text-xs font-bold text-neutral-500 underline underline-offset-2 hover:text-black">View full details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
