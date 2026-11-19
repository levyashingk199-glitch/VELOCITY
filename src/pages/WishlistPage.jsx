import { Heart } from "lucide-react";
import WishlistItem from "../components/WishlistItem";
import EmptyState from "../components/EmptyState";
import { useStore } from "../context/StoreContext";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="font-display flex items-center gap-2.5 text-3xl font-black tracking-tight sm:text-4xl"><Heart size={28} className="fill-black" /> My Wishlist</h1>
      <p className="mt-1.5 text-sm text-neutral-500">{wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}</p>

      <div className="mt-8">
        {wishlist.length === 0 ? (
          <EmptyState title="Your wishlist is empty" message="Tap the heart on any product to save it here for later." actionLabel="Discover products" actionTo="/shop" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {wishlist.map((p) => <WishlistItem key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
