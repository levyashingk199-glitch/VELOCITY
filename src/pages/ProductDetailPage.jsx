import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus, ChevronRight, Check } from "lucide-react";
import ProductGallery from "../components/ProductGallery";
import SizeSelector from "../components/SizeSelector";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { productService } from "../services/productService";
import { useStore } from "../context/StoreContext";
import { formatPrice } from "../data/mockProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const p = await productService.getProductById(id);
      setProduct(p);
      setSize(p.sizes?.[Math.floor(p.sizes.length / 2)] ?? null);
      setQty(1);
      const sim = await productService.getSimilar(p, 4);
      setSimilar(sim);
    } catch (e) {
      setError(e.message || "Product not found.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); window.scrollTo({ top: 0 }); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16"><LoadingSpinner label="Loading product..." /></div>;
  if (error || !product) return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorMessage message={error || "Product not found."} onRetry={load} /></div>;

  const wished = isInWishlist(product.id);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!size) { setSizeError(true); return; }
    addToCart(product, size, qty);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-medium text-neutral-400">
        <Link to="/" className="hover:text-black">Home</Link><ChevronRight size={12} />
        <Link to="/shop" className="hover:text-black">Shop</Link><ChevronRight size={12} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black">{product.category}</Link><ChevronRight size={12} />
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} discount={product.discount} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#e8ff47]">{product.brand}</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">{product.category}</span>
            {product.isNew && <span className="rounded-full bg-[#e8ff47] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">New</span>}
          </div>

          <h1 className="font-display mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{product.name}</h1>

          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-neutral-500">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <strong className="text-black">{product.rating?.toFixed(1)}</strong> · {product.reviews} reviews
            <span className="mx-1 text-neutral-300">|</span>
            <span className={inStock ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>{inStock ? `In stock (${product.stock} available)` : "Out of stock"}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
                <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">SAVE {product.discount}%</span>
              </>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-neutral-600">{product.description}</p>

          <div className="mt-6">
            <SizeSelector sizes={product.sizes} selected={size} onChange={(s) => { setSize(s); setSizeError(false); }} />
            {sizeError && <p className="mt-2 text-xs font-semibold text-red-600">Please select a size first.</p>}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex items-center rounded-full border border-neutral-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-12 w-11 items-center justify-center" aria-label="Decrease"><Minus size={15} /></button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="flex h-12 w-11 items-center justify-center" aria-label="Increase"><Plus size={15} /></button>
            </div>
            <button onClick={handleAdd} disabled={!inStock} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800 disabled:opacity-40">
              <ShoppingBag size={16} /> ADD TO CART — {formatPrice(product.price * qty)}
            </button>
            <button onClick={() => toggleWishlist(product)} aria-label="Add to wishlist" className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${wished ? "border-black bg-black text-[#e8ff47]" : "border-neutral-200 hover:border-black"}`}>
              <Heart size={19} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-7 grid gap-3 rounded-3xl bg-neutral-50 p-5 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free Delivery", sub: "Orders over $100" },
              { icon: RotateCcw, title: "30-Day Returns", sub: "Free & easy" },
              { icon: ShieldCheck, title: "Authentic", sub: "100% genuine" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-sm"><Icon size={16} /></span>
                <div><p className="text-xs font-bold">{title}</p><p className="text-[11px] text-neutral-500">{sub}</p></div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="mt-7">
            <h3 className="font-display text-base font-extrabold">Specifications</h3>
            <dl className="mt-3 divide-y divide-neutral-100 rounded-2xl border border-neutral-100">
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                  <dt className="font-medium capitalize text-neutral-500">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="font-medium text-neutral-500">Colors</dt>
                <dd className="font-semibold">{product.colors?.join(", ")}</dd>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="font-medium text-neutral-500">Gender</dt>
                <dd className="font-semibold">{product.gender}</dd>
              </div>
            </dl>
          </div>

          {/* Highlights */}
          <ul className="mt-5 space-y-2 text-sm text-neutral-600">
            {["Premium materials & craftsmanship", "Designed for performance and style", "Official brand warranty included"].map((h) => (
              <li key={h} className="flex items-center gap-2"><Check size={15} className="text-emerald-600" /> {h}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl font-black tracking-tight sm:text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
