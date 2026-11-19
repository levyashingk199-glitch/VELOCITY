import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products, loading, error, onRetry }) {
  if (loading) return <LoadingSpinner label="Loading products..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (!products?.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
