import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <img
        src="https://images.pexels.com/photos/28645957/pexels-photo-28645957.jpeg?auto=compress&cs=tinysrgb&w=1800"
        alt="Premium sports footwear campaign"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:min-h-[560px] lg:px-8 lg:py-28">
        <div className="animate-fade-up max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8ff47] backdrop-blur">
            <Star size={12} className="fill-[#e8ff47]" /> New Season Drop — SS26
          </span>
          <h1 className="font-display mt-5 text-5xl font-black italic leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            STEP INTO<br />YOUR GAME
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Discover premium sneakers and football boots. 500+ styles from Nike, Adidas, Puma and more — delivered to your door.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop?category=Lifestyle" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8ff47] px-8 py-4 text-sm font-extrabold tracking-wide text-black transition hover:bg-white">
              SHOP SNEAKERS <ArrowRight size={16} />
            </Link>
            <Link to="/shop?category=Football Boots" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-extrabold tracking-wide text-white backdrop-blur transition hover:bg-white hover:text-black">
              EXPLORE FOOTBALL BOOTS
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2"><Truck size={16} className="text-[#e8ff47]" /> Free delivery $100+</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-[#e8ff47]" /> Authentic products only</span>
            <span className="inline-flex items-center gap-1"><Star size={15} className="fill-amber-400 text-amber-400" /> <strong className="text-white">4.9/5</strong> from 12k reviews</span>
          </div>
        </div>
      </div>

      {/* Brand marquee */}
      <div className="relative border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="flex overflow-hidden py-3.5">
          <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex items-center gap-10">
                {["NIKE", "ADIDAS", "PUMA", "NEW BALANCE", "ASICS", "REEBOK", "MIZUNO", "UNDER ARMOUR"].map((b) => (
                  <span key={b} className="font-display whitespace-nowrap text-sm font-extrabold tracking-[0.25em] text-white/50">{b}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
