import { Link } from "react-router-dom";
import { Camera, Video, AtSign, Play, CreditCard, Truck, RotateCcw, ShieldCheck } from "lucide-react";

const COLS = [
  { title: "Shop", links: [["Sneakers", "/shop?category=Lifestyle"], ["Running", "/shop?category=Running"], ["Football Boots", "/shop?category=Football Boots"], ["Basketball", "/shop?category=Basketball"], ["Sale", "/sale"]] },
  { title: "Help", links: [["Delivery Info", "/profile"], ["Returns & Exchanges", "/profile"], ["Size Guide", "/shop"], ["Track Order", "/profile?tab=orders"], ["Contact Us", "/profile"]] },
  { title: "Company", links: [["About Velocity", "/"], ["New Arrivals", "/new-arrivals"], ["Wishlist", "/wishlist"], ["My Account", "/profile"], ["Login", "/login"]] },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      {/* Perks */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { icon: Truck, title: "Free Delivery", sub: "On all orders over $100" },
            { icon: RotateCcw, title: "30-Day Returns", sub: "No questions asked" },
            { icon: ShieldCheck, title: "Secure Payment", sub: "100% protected checkout" },
            { icon: CreditCard, title: "Flexible Payment", sub: "Cards, PayPal & Klarna" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#e8ff47]"><Icon size={19} /></span>
              <div><p className="text-sm font-bold">{title}</p><p className="text-xs text-white/50">{sub}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8ff47] font-display text-lg font-black italic text-black">V</span>
            <span className="font-display text-xl font-black italic tracking-tight">VELOCITY<span className="text-white/40">.</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Premium sneakers, running shoes and football boots from the world's best brands. Step into your game — every day.
          </p>
          <div className="mt-5 flex gap-2">
            {[AtSign, Camera, Play, Video].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#e8ff47] hover:text-black"><Icon size={17} /></a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-[0.16em]">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-white/50 transition hover:text-[#e8ff47]">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} VELOCITY. All rights reserved. Frontend demo — backend coming soon.</p>
          <div className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><a href="#" className="hover:text-white">Cookies</a></div>
        </div>
      </div>
    </footer>
  );
}
