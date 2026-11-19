import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function WishlistItem({ product }) {
  const { toggleWishlist, addToCart } = useStore();
  return (
    <div className="flex gap-4 rounded-3xl border border-neutral-100 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <Link to={`/product/${product.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:h-28 sm:w-28">
        <img src={product.images?.[0]} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">{product.brand}</p>
            <Link to={`/product/${product.id}`} className="font-display line-clamp-1 font-bold text-neutral-900 hover:underline">{product.name}</Link>
            <p className="mt-0.5 text-xs text-neutral-500">{product.category} · {product.gender}</p>
          </div>
          <button onClick={() => toggleWishlist(product)} aria-label="Remove from wishlist" className="rounded-full p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div>
            <p className="font-display text-base font-extrabold text-neutral-900">{formatPrice(product.price)}</p>
            {product.oldPrice && <p className="text-xs text-neutral-400 line-through">{formatPrice(product.oldPrice)}</p>}
          </div>
          <button onClick={() => addToCart(product)} className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800">
            <ShoppingBag size={14} /> MOVE TO CART
          </button>
        </div>
      </div>
    </div>
  );
}
