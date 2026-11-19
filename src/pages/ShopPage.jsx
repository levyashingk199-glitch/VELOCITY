import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";
import { productService } from "../services/productService";

const EMPTY_FILTERS = { brand: [], category: [], gender: [], sizes: [], colors: [], maxPrice: 300, onSaleOnly: false, inStockOnly: false };

export default function ShopPage({ preset = {} }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Sync URL params (category, brand, search, sort) into state on first load / param change
  useEffect(() => {
    const next = { ...EMPTY_FILTERS };
    const cat = searchParams.get("category");
    const brand = searchParams.get("brand");
    const q = searchParams.get("search");
    const s = searchParams.get("sort");
    if (cat) next.category = [cat];
    if (brand) next.brand = [brand];
    if (preset.category) next.category = [preset.category];
    if (preset.onSaleOnly) next.onSaleOnly = true;
    if (preset.onlyNew) next.onlyNew = true;
    setFilters(next);
    if (q) setSearch(q);
    if (s) setSort(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await productService.getProducts({ ...filters, search, sort });
      let list = data.products;
      if (preset.onlyNew) list = list.filter((p) => p.isNew);
      setProducts(list);
    } catch (e) {
      setError(e.message || "Failed to load products.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters, sort, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeCount = useMemo(() => {
    let n = 0;
    ["brand", "category", "gender", "sizes", "colors"].forEach((k) => { n += (filters[k] || []).length; });
    if (filters.maxPrice < 300) n += 1;
    if (filters.onSaleOnly) n += 1;
    if (filters.inStockOnly) n += 1;
    return n;
  }, [filters]);

  const clearAll = () => { setFilters(EMPTY_FILTERS); setSearch(""); setSearchParams({}); };

  const title = preset.title || "Shop All Products";
  const subtitle = preset.subtitle || "Premium sneakers, running shoes & football boots";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Page head */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-400">Velocity Store</p>
        <h1 className="font-display mt-1 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-1.5 text-sm text-neutral-500">{subtitle}</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="max-w-md flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center justify-between gap-3 sm:ml-auto">
          <p className="text-sm text-neutral-500"><strong className="text-black">{products.length}</strong> products</p>
          <button onClick={() => setMobileFilters(true)} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-bold lg:hidden">
            <SlidersHorizontal size={15} /> Filters {activeCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">{activeCount}</span>}
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="sticky top-32 hidden h-fit w-64 shrink-0 rounded-3xl border border-neutral-100 bg-white p-5 lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} onClear={clearAll} />
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {activeCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">{activeCount} filter{activeCount > 1 ? "s" : ""} active</span>
              <button onClick={clearAll} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold hover:bg-black hover:text-white"><X size={12} /> Clear all</button>
            </div>
          )}
          <ProductGrid products={products} loading={loading} error={error} onRetry={load} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="animate-drawer absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-5">
            <FilterSidebar filters={filters} onChange={setFilters} onClear={clearAll} onClose={() => setMobileFilters(false)} />
            <button onClick={() => setMobileFilters(false)} className="mt-4 w-full rounded-full bg-black py-3.5 text-sm font-extrabold text-white">SHOW {products.length} PRODUCTS</button>
          </div>
        </div>
      )}
    </div>
  );
}
