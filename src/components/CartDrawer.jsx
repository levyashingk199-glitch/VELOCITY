import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, subtotal, clearCart } = useStore();
  if (!cartOpen) return null;

  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 9.99;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} />
      <aside className="animate-drawer absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h3 className="font-display flex items-center gap-2 text-lg font-extrabold"><ShoppingBag size={19} /> Your Cart ({cart.length})</h3>
          <button onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Close cart"><X size={19} /></button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400"><ShoppingBag size={26} /></span>
            <p className="font-display text-lg font-bold">Your cart is empty</p>
            <p className="text-sm text-neutral-500">Add some heat to your rotation.</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="mt-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white">START SHOPPING</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 rounded-2xl border border-neutral-100 p-3">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-neutral-500">{item.brand} · EU {item.size}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-neutral-200">
                        <button onClick={() => updateQty(item.id, item.size, item.qty - 1)} className="h-8 w-8 text-sm font-bold">−</button>
                        <span className="w-7 text-center text-sm font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.size, item.qty + 1)} className="h-8 w-8 text-sm font-bold">+</button>
                      </div>
                      <p className="text-sm font-extrabold">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.size)} className="self-start rounded-full p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><Trash2 size={15} /></button>
                </div>
              ))}
              <button onClick={clearCart} className="w-full py-2 text-xs font-semibold text-neutral-400 hover:text-red-600">Clear cart</button>
            </div>

            <div className="border-t border-neutral-100 px-5 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span className="font-semibold text-black">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-neutral-500"><span>Delivery</span><span className="font-semibold text-black">{delivery === 0 ? "FREE" : formatPrice(delivery)}</span></div>
                <div className="flex justify-between border-t border-dashed border-neutral-200 pt-2.5 text-base font-extrabold"><span>Total</span><span>{formatPrice(subtotal + delivery)}</span></div>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="mt-4 flex items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800">
                CHECKOUT <ArrowRight size={16} />
              </Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="mt-2 block text-center text-xs font-semibold text-neutral-500 underline underline-offset-2 hover:text-black">View full cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
