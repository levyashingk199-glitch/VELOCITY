import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, BadgePercent } from "lucide-react";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Newsletter from "../components/Newsletter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { productService } from "../services/productService";

const CATEGORIES = [
  { title: "Lifestyle Sneakers", subtitle: "Everyday Icons", to: "/shop?category=Lifestyle", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop" },
  { title: "Running Shoes", subtitle: "Built For Miles", to: "/shop?category=Running", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop" },
  { title: "Football Boots", subtitle: "Own The Pitch", to: "/shop?category=Football Boots", image: "https://images.pexels.com/photos/40369206/pexels-photo-40369206.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { title: "Basketball Shoes", subtitle: "Court Legends", to: "/shop?category=Basketball", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" },
  { title: "Training Shoes", subtitle: "Gym Ready", to: "/shop?category=Training", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop" },
];

const BRANDS = ["Nike", "Adidas", "Puma", "New Balance", "Asics", "Reebok", "Mizuno", "Under Armour"];

function SectionHead({ icon: Icon, title, sub, to, linkLabel }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400"><Icon size={13} /> {sub}</p>
        <h2 className="font-display mt-1 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {to && <Link to={to} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-bold hover:border-black hover:bg-black hover:text-white">{linkLabel} <ArrowRight size={15} /></Link>}
    </div>
  );
}

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [all, news] = await Promise.all([
        productService.getProducts({ sort: "popularity" }),
        productService.getNewArrivals(8),
      ]);
      setTrending(all.products.slice(0, 8));
      setNewArrivals(news);
    } catch (e) {
      setError(e.message || "Failed to load products.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <Hero />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHead icon={Flame} title="Shop by Category" sub="Find your fit" to="/shop" linkLabel="View all" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
          {CATEGORIES.map((c) => <CategoryCard key={c.title} {...c} />)}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-[#f6f6f4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHead icon={Flame} title="Trending Now" sub="Most wanted" to="/shop?sort=popularity" linkLabel="Shop trending" />
          {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={load} /> : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-black text-white">
          <img src="https://images.pexels.com/photos/40509526/pexels-photo-40509526.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Football boots promo" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="relative flex flex-col gap-5 px-6 py-14 sm:px-10 lg:max-w-2xl lg:px-14 lg:py-20">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e8ff47] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-black"><BadgePercent size={13} /> Up to 40% off</span>
            <h2 className="font-display text-4xl font-black italic leading-[0.95] sm:text-6xl">FOOTBALL BOOTS<br />SALE IS LIVE</h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">Elite FG, AG and turf boots from Nike, Adidas, Puma and Mizuno. Limited sizes — when they're gone, they're gone.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/sale" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-black hover:bg-[#e8ff47]">SHOP THE SALE <ArrowRight size={15} /></Link>
              <Link to="/shop?category=Football Boots" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-extrabold hover:bg-white hover:text-black">ALL FOOTBALL BOOTS</Link>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <SectionHead icon={Sparkles} title="New Arrivals" sub="Just dropped" to="/new-arrivals" linkLabel="View new" />
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {newArrivals.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Brands */}
      <section className="border-y border-neutral-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">Official retailer of</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BRANDS.map((b) => (
              <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`} className="font-display flex items-center justify-center rounded-2xl border border-neutral-100 px-4 py-6 text-center text-base font-extrabold tracking-wide text-neutral-700 transition hover:border-black hover:bg-black hover:text-[#e8ff47] sm:text-lg">
                {b.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
