import { PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ title = "No products found", message = "Try adjusting your filters or search.", actionLabel = "Browse all products", actionTo = "/shop" }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-400 shadow-sm"><PackageSearch size={26} /></span>
      <p className="font-display text-lg font-bold text-neutral-900">{title}</p>
      <p className="max-w-sm text-sm text-neutral-500">{message}</p>
      <Link to={actionTo} className="mt-2 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">{actionLabel}</Link>
    </div>
  );
}
