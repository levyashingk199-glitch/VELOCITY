import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useStore();
  return (
    <div className="flex gap-4 rounded-3xl border border-neutral-100 bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
      <Link to={`/product/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:h-28 sm:w-28">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">{item.brand}</p>
            <Link to={`/product/${item.id}`} className="font-display line-clamp-1 font-bold text-neutral-900 hover:underline">{item.name}</Link>
            <p className="mt-0.5 text-xs text-neutral-500">Size EU {item.size}</p>
          </div>
          <button onClick={() => removeFromCart(item.id, item.size)} aria-label="Remove item" className="rounded-full p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-neutral-200">
            <button onClick={() => updateQty(item.id, item.size, item.qty - 1)} className="flex h-9 w-9 items-center justify-center hover:text-black" aria-label="Decrease quantity"><Minus size={14} /></button>
            <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.size, item.qty + 1)} className="flex h-9 w-9 items-center justify-center hover:text-black" aria-label="Increase quantity"><Plus size={14} /></button>
          </div>
          <p className="font-display text-base font-extrabold text-neutral-900">{formatPrice(item.price * item.qty)}</p>
        </div>
      </div>
    </div>
  );
}
