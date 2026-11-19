import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authService } from "../services/authService";

const StoreContext = createContext(null);

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load("velocity_cart", []));
  const [wishlist, setWishlist] = useState(() => load("velocity_wishlist", []));
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { localStorage.setItem("velocity_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("velocity_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback((product, size, qty = 1) => {
    const chosenSize = size ?? product.sizes?.[Math.floor(product.sizes.length / 2)] ?? 42;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id && i.size === chosenSize);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 10) };
        return next;
      }
      return [...prev, { id: product.id, name: product.name, brand: product.brand, price: product.price, image: product.images?.[0], size: chosenSize, qty }];
    });
    toast(`${product.name} added to cart`);
  }, [toast]);

  const removeFromCart = useCallback((id, size) => setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size))), []);
  const updateQty = useCallback((id, size, qty) => {
    setCart((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) { toast("Removed from wishlist"); return prev.filter((p) => p.id !== product.id); }
      toast("Saved to wishlist");
      return [...prev, product];
    });
  }, [toast]);

  const isInWishlist = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => { authService.logout(); setUser(null); }, []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const value = {
    cart, wishlist, user, cartOpen, setCartOpen, quickView, setQuickView, toasts, toast,
    addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isInWishlist,
    login, register, logout, setUser, cartCount, subtotal,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
};
