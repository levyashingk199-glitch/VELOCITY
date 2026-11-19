import { ChevronDown } from "lucide-react";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <label className="relative inline-flex items-center">
      <span className="mr-2 hidden text-sm text-neutral-500 sm:inline">Sort by</span>
      <span className="relative inline-flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 cursor-pointer appearance-none rounded-full border border-neutral-200 bg-white pl-4 pr-10 text-sm font-medium outline-none transition hover:border-neutral-400 focus:border-black"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3.5 text-neutral-500" />
      </span>
    </label>
  );
}
