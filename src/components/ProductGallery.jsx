import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name, discount }) {
  const [idx, setIdx] = useState(0);
  const list = images?.length ? images : [];

  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const next = () => setIdx((i) => (i + 1) % list.length);

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-neutral-100">
        <img src={list[idx]} alt={name} className="aspect-[4/3] w-full object-cover" />
        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-[#e8ff47]">-{discount}% OFF</span>
        )}
        {list.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white"><ChevronLeft size={18} /></button>
            <button onClick={next} aria-label="Next image" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white"><ChevronRight size={18} /></button>
          </>
        )}
        <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{idx + 1} / {list.length}</span>
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`overflow-hidden rounded-2xl border-2 transition ${i === idx ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <img src={src} alt={`${name} view ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
