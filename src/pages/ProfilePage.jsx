import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, ShoppingBag, MapPin, Heart, LogOut, Pencil, Package, Check } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { authService } from "../services/authService";
import { cartService } from "../services/cartService";
import { formatPrice } from "../data/mockProducts";

const TABS = [
  { id: "info", label: "Personal Info", icon: User },
  { id: "orders", label: "Order History", icon: ShoppingBag },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
];

export default function ProfilePage() {
  const { user, setUser, logout, wishlist, toast } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get("tab") || "info");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("velocity_addresses") || "[]"); } catch { return []; }
  });
  const [addrForm, setAddrForm] = useState({ label: "", street: "", city: "", zip: "" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
    cartService.getOrders().then(setOrders).catch(() => setOrders([]));
  }, [user, navigate]);

  useEffect(() => { localStorage.setItem("velocity_addresses", JSON.stringify(addresses)); }, [addresses]);

  if (!user) return null;

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { user: updated } = await authService.updateProfile(form);
      setUser(updated);
      setEditing(false);
      toast("Profile updated");
    } catch { toast("Could not update profile", "error"); }
  };

  const addAddress = (e) => {
    e.preventDefault();
    if (!addrForm.label || !addrForm.street || !addrForm.city) { toast("Fill in label, street and city", "error"); return; }
    setAddresses((a) => [...a, { ...addrForm, id: Date.now() }]);
    setAddrForm({ label: "", street: "", city: "", zip: "" });
    toast("Address saved");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-black p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e8ff47] font-display text-2xl font-black text-black">{user.name?.[0]?.toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display truncate text-2xl font-black sm:text-3xl">{user.name}</h1>
          <p className="truncate text-sm text-white/60">{user.email}</p>
          <p className="mt-1 text-xs text-white/40">Member since {user.joined ? new Date(user.joined).toLocaleDateString() : "—"} · Velocity Club</p>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold hover:bg-white hover:text-black">
          <LogOut size={15} /> LOGOUT
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Tabs */}
        <aside className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${tab === id ? "bg-black text-white" : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"}`}>
              <Icon size={16} /> {label}
              {id === "wishlist" && wishlist.length > 0 && <span className="ml-auto rounded-full bg-[#e8ff47] px-2 py-0.5 text-[10px] font-extrabold text-black">{wishlist.length}</span>}
            </button>
          ))}
        </aside>

        <div className="min-w-0">
          {tab === "info" && (
            <div className="rounded-3xl border border-neutral-100 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold">Personal Information</h2>
                <button onClick={() => setEditing((v) => !v)} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold hover:border-black"><Pencil size={13} /> {editing ? "Cancel" : "Edit profile"}</button>
              </div>
              {editing ? (
                <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-neutral-500">FULL NAME</span>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-black" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-neutral-500">EMAIL</span>
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-black" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-bold text-neutral-500">PHONE</span>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 1234" className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-black" />
                  </label>
                  <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-black text-sm font-extrabold text-white sm:col-span-2"><Check size={16} /> SAVE CHANGES</button>
                </form>
              ) : (
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[["Full name", user.name], ["Email", user.email], ["Phone", user.phone || "Not added"], ["Member tier", "Velocity Club"]].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-neutral-50 px-4 py-3.5">
                      <dt className="text-xs font-bold text-neutral-400">{k}</dt>
                      <dd className="mt-0.5 font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="rounded-3xl border border-neutral-100 bg-white p-6 sm:p-8">
              <h2 className="font-display text-xl font-extrabold">Order History</h2>
              {orders.length === 0 ? (
                <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl bg-neutral-50 py-12 text-center">
                  <Package size={28} className="text-neutral-300" />
                  <p className="font-bold">No orders yet</p>
                  <p className="text-sm text-neutral-500">Your completed orders will appear here.</p>
                  <Link to="/shop" className="mt-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white">Start shopping</Link>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 px-5 py-4">
                      <div>
                        <p className="font-bold">Order {o.id}</p>
                        <p className="text-xs text-neutral-500">{new Date(o.date).toLocaleDateString()} · {o.items?.length || 0} items</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{o.status}</span>
                      <p className="font-display font-extrabold">{formatPrice(o.total)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="rounded-3xl border border-neutral-100 bg-white p-6 sm:p-8">
              <h2 className="font-display text-xl font-extrabold">Saved Addresses</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <p className="font-bold">{a.label}</p>
                    <p className="mt-1 text-sm text-neutral-500">{a.street}, {a.city} {a.zip}</p>
                    <button onClick={() => setAddresses((arr) => arr.filter((x) => x.id !== a.id))} className="mt-2 text-xs font-bold text-red-600">Remove</button>
                  </div>
                ))}
              </div>
              <form onSubmit={addAddress} className="mt-6 grid gap-3 rounded-2xl border border-dashed border-neutral-200 p-5 sm:grid-cols-2">
                <input value={addrForm.label} onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })} placeholder="Label (Home / Work)" className="h-11 rounded-xl border border-neutral-200 px-3.5 text-sm outline-none focus:border-black" />
                <input value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} placeholder="Street address" className="h-11 rounded-xl border border-neutral-200 px-3.5 text-sm outline-none focus:border-black" />
                <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} placeholder="City" className="h-11 rounded-xl border border-neutral-200 px-3.5 text-sm outline-none focus:border-black" />
                <input value={addrForm.zip} onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })} placeholder="ZIP / Postal code" className="h-11 rounded-xl border border-neutral-200 px-3.5 text-sm outline-none focus:border-black" />
                <button className="h-11 rounded-full bg-black text-sm font-extrabold text-white sm:col-span-2">ADD ADDRESS</button>
              </form>
            </div>
          )}

          {tab === "wishlist" && (
            <div className="rounded-3xl border border-neutral-100 bg-white p-6 sm:p-8">
              <h2 className="font-display text-xl font-extrabold">Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="mt-4 text-sm text-neutral-500">Nothing saved yet. <Link to="/shop" className="font-bold text-black underline">Browse products</Link></p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {wishlist.map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3 hover:border-black">
                      <img src={p.images?.[0]} alt={p.name} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs text-neutral-500">{formatPrice(p.price)}</p></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
