import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickView } = useStore();
  const wished = isInWishlist(product.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#e8ff47]">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold tracking-wide text-black shadow-sm">NEW</span>
          )}
          {product.stock === 0 && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">SOLD OUT</span>
          )}
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${wished ? "bg-black text-[#e8ff47]" : "bg-white text-neutral-700 hover:bg-black hover:text-white"}`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => setQuickView(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-14 items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-xs font-bold tracking-wide text-black opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
        >
          <Eye size={15} /> QUICK VIEW
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">{product.brand}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {product.rating?.toFixed(1)}
          </span>
        </div>
        <Link to={`/product/${product.id}`} className="font-display text-[15px] font-bold leading-snug text-neutral-900 hover:underline">
          {product.name}
        </Link>
        <p className="text-xs text-neutral-500">{product.category} · {product.gender}</p>

        <div className="mt-1 flex flex-wrap gap-1">
          {product.sizes?.slice(0, 5).map((s) => (
            <span key={s} className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">{s}</span>
          ))}
          {product.sizes?.length > 5 && <span className="px-1 py-0.5 text-[10px] font-semibold text-neutral-400">+{product.sizes.length - 5}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="font-display text-lg font-extrabold leading-none text-neutral-900">{formatPrice(product.price)}</p>
            {product.oldPrice && <p className="mt-1 text-xs font-medium text-neutral-400 line-through">{formatPrice(product.oldPrice)}</p>}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={14} /> ADD
          </button>
        </div>
      </div>
    </article>
  );
}
