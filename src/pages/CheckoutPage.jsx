import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Truck, CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { cartService } from "../services/cartService";
import { formatPrice } from "../data/mockProducts";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart, user, toast } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", address: "", city: "", zip: "", card: "", expiry: "", cvc: "" });
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + delivery;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (order) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={40} /></span>
        <h1 className="font-display mt-5 text-3xl font-black tracking-tight sm:text-4xl">Order confirmed!</h1>
        <p className="mt-2 max-w-md text-sm text-neutral-500">Thank you, {form.name || "athlete"}. Your order <strong className="text-black">{order.id}</strong> is being prepared. A confirmation email was sent to {form.email}.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/profile?tab=orders" className="rounded-full bg-black px-7 py-3.5 text-sm font-extrabold text-white">VIEW MY ORDERS</Link>
          <Link to="/shop" className="rounded-full border border-neutral-200 px-7 py-3.5 text-sm font-extrabold hover:border-black">CONTINUE SHOPPING</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-display text-2xl font-black">Your cart is empty</p>
        <p className="mt-2 text-sm text-neutral-500">Add some products before checking out.</p>
        <Link to="/shop" className="mt-5 rounded-full bg-black px-7 py-3.5 text-sm font-extrabold text-white">GO TO SHOP</Link>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.address.trim() || !form.city.trim()) { toast("Please complete delivery details", "error"); return; }
    if (form.card.replace(/\s/g, "").length < 12) { toast("Enter a valid card number", "error"); return; }
    setPlacing(true);
    try {
      const created = await cartService.createOrder({ items: cart, total, customer: { name: form.name, email: form.email } });
      const orders = JSON.parse(localStorage.getItem("velocity_orders") || "[]");
      orders.unshift(created);
      localStorage.setItem("velocity_orders", JSON.stringify(orders));
      setOrder(created);
      clearCart();
    } catch {
      toast("Checkout failed. Try again.", "error");
    } finally { setPlacing(false); }
  };

  const inputCls = "h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none transition focus:border-black focus:bg-white";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-500 hover:text-black"><ArrowLeft size={15} /> Back to cart</Link>
      <h1 className="font-display mt-3 flex items-center gap-2.5 text-3xl font-black tracking-tight sm:text-4xl"><Lock size={26} /> Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-neutral-100 bg-white p-6">
            <h2 className="font-display flex items-center gap-2 text-lg font-extrabold"><Truck size={18} /> Delivery Details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={form.name} onChange={set("name")} placeholder="Full name" className={inputCls} />
              <input type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={inputCls} />
              <input value={form.address} onChange={set("address")} placeholder="Street address" className={`${inputCls} sm:col-span-2`} />
              <input value={form.city} onChange={set("city")} placeholder="City" className={inputCls} />
              <input value={form.zip} onChange={set("zip")} placeholder="ZIP / Postal code" className={inputCls} />
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-100 bg-white p-6">
            <h2 className="font-display flex items-center gap-2 text-lg font-extrabold"><CreditCard size={18} /> Payment <span className="ml-auto rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold text-neutral-500">DEMO — NO REAL CHARGE</span></h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={form.card} onChange={set("card")} placeholder="Card number 4242 4242 4242 4242" inputMode="numeric" className={`${inputCls} sm:col-span-2`} />
              <input value={form.expiry} onChange={set("expiry")} placeholder="MM / YY" className={inputCls} />
              <input value={form.cvc} onChange={set("cvc")} placeholder="CVC" inputMode="numeric" className={inputCls} />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-neutral-100 bg-white p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-lg font-extrabold">Summary</h2>
          <div className="mt-4 space-y-3">
            {cart.map((i) => (
              <div key={`${i.id}-${i.size}`} className="flex items-center gap-3">
                <img src={i.image} alt={i.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{i.name}</p>
                  <p className="text-[11px] text-neutral-500">EU {i.size} · Qty {i.qty}</p>
                </div>
                <p className="text-sm font-bold">{formatPrice(i.price * i.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-dashed border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between text-neutral-500"><span>Subtotal</span><span className="font-semibold text-black">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-neutral-500"><span>Delivery</span><span className="font-semibold text-black">{delivery === 0 ? "FREE" : formatPrice(delivery)}</span></div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-extrabold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button disabled={placing} className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800 disabled:opacity-60">
            {placing ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : `PAY ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-[11px] text-neutral-400">Demo checkout — no real payment is processed.</p>
        </aside>
      </form>
    </div>
  );
}
