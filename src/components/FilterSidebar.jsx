import { X, RotateCcw } from "lucide-react";
import { BRANDS, CATEGORIES, GENDERS, COLORS, ALL_SIZES } from "../data/mockProducts";

function Group({ title, children }) {
  return (
    <div className="border-b border-neutral-100 py-5 last:border-0">
      <h4 className="font-display mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-neutral-900">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-600 hover:text-black">
      <input type="checkbox" checked={checked} onChange={onChange} className="checkbox checkbox-sm border-neutral-300 [--chkbg:#0a0a0a] [--chkfg:#e8ff47]" />
      {label}
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, onClear, onClose }) {
  const toggle = (key, val) => {
    const arr = filters[key] || [];
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <h3 className="font-display text-lg font-extrabold">Filters</h3>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-neutral-500 hover:bg-neutral-100 hover:text-black">
            <RotateCcw size={13} /> RESET
          </button>
          {onClose && <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100 lg:hidden" aria-label="Close filters"><X size={18} /></button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <Group title="Brand">
          {BRANDS.map((b) => <Check key={b} label={b} checked={filters.brand?.includes(b)} onChange={() => toggle("brand", b)} />)}
        </Group>

        <Group title="Category">
          {CATEGORIES.map((c) => <Check key={c} label={c} checked={filters.category?.includes(c)} onChange={() => toggle("category", c)} />)}
        </Group>

        <Group title="Gender">
          {GENDERS.map((g) => <Check key={g} label={g} checked={filters.gender?.includes(g)} onChange={() => toggle("gender", g)} />)}
        </Group>

        <Group title="Shoe Size (EU)">
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => {
              const active = filters.sizes?.includes(s);
              return (
                <button key={s} onClick={() => toggle("sizes", s)} className={`h-9 min-w-11 rounded-lg border px-2 text-xs font-bold transition ${active ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"}`}>{s}</button>
              );
            })}
          </div>
        </Group>

        <Group title="Color">
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => {
              const active = filters.colors?.includes(c);
              return (
                <button key={c} onClick={() => toggle("colors", c)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black"}`}>{c}</button>
              );
            })}
          </div>
        </Group>

        <Group title="Price Range">
          <input
            type="range" min={50} max={300} step={10}
            value={filters.maxPrice ?? 300}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="range range-sm w-full"
          />
          <div className="mt-1 flex justify-between text-xs font-semibold text-neutral-500">
            <span>$50</span><span className="text-black">Up to ${filters.maxPrice ?? 300}</span><span>$300</span>
          </div>
        </Group>

        <Group title="Availability">
          <Check label="On sale only" checked={!!filters.onSaleOnly} onChange={() => onChange({ ...filters, onSaleOnly: !filters.onSaleOnly })} />
          <Check label="In stock only" checked={!!filters.inStockOnly} onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })} />
        </Group>
      </div>
    </div>
  );
}
