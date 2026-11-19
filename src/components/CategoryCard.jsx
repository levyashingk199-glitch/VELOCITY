import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryCard({ title, subtitle, image, to, dark = false }) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-3xl bg-neutral-100"
      style={{ aspectRatio: "4 / 5" }}
    >
      <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className={`absolute inset-0 ${dark ? "bg-black/45" : "bg-gradient-to-t from-black/70 via-black/10 to-transparent"}`} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{subtitle}</p>
          <h3 className="font-display mt-1 text-xl font-extrabold leading-tight text-white sm:text-2xl">{title}</h3>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:bg-[#e8ff47]">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}
