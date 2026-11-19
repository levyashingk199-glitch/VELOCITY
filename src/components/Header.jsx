import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X, Zap, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useStore } from "../context/StoreContext";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Sneakers", to: "/shop?category=Lifestyle" },
  { label: "Running", to: "/shop?category=Running" },
  { label: "Football Boots", to: "/shop?category=Football Boots" },
  { label: "Sportswear", to: "/shop?category=Training" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Sale", to: "/sale" },
];

export default function Header() {
  const { cartCount, wishlist, user, setCartOpen, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    setIsInstalled(window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === "accepted") setInstallPrompt(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  const linkCls = ({ isActive }) =>
    `relative px-1 py-2 text-[13px] font-semibold tracking-wide transition ${isActive ? "text-black" : "text-neutral-500 hover:text-black"} after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-black after:transition-transform ${isActive ? "after:scale-x-100" : "hover:after:scale-x-100"}`;

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-semibold tracking-wide sm:text-xs">
          <Zap size={13} className="shrink-0 text-[#e8ff47]" />
          <span className="truncate">FREE DELIVERY OVER $100 · 30-DAY RETURNS · EXTRA 10% OFF WITH CODE <span className="font-mono font-bold text-[#e8ff47]">STEP10</span></span>
        </div>
      </div>

      <div className={`border-b bg-white/95 backdrop-blur transition ${scrolled ? "border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : "border-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 lg:px-8">
          {/* Mobile menu btn */}
          <button onClick={() => setMobileOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 lg:hidden" aria-label="Menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-[#e8ff47]"><Zap size={20} strokeWidth={3} /></span>
            <span className="font-display text-xl font-black italic tracking-tight text-black">VELOCITY<span className="text-neutral-400">.</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden items-center gap-5 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.label} to={n.to} className={linkCls}>{n.label}</NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {installPrompt && !isInstalled && (
              <button onClick={installApp} className="hidden h-10 items-center gap-2 rounded-full bg-[#e8ff47] px-4 text-xs font-extrabold text-black transition hover:bg-black hover:text-[#e8ff47] sm:inline-flex" aria-label="Install VELOCITY app">
                <Zap size={15} /> INSTALL APP
              </button>
            )}
            {/* Search */}
            <div className="hidden items-center md:flex">
              <form onSubmit={submitSearch} className="relative">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search shoes..."
                  className="h-10 w-44 rounded-full border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none transition focus:w-56 focus:border-black focus:bg-white xl:w-52"
                />
              </form>
            </div>
            <button onClick={() => setSearchOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 md:hidden" aria-label="Search">
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Wishlist">
              <Heart size={19} />
              {wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">{wishlist.length}</span>}
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Cart">
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e8ff47] px-1 text-[10px] font-extrabold text-black">{cartCount}</span>}
            </button>

            {/* Profile */}
            <div className="relative">
              {user ? (
                <>
                  <button onClick={() => setProfileOpen((v) => !v)} className="flex h-10 items-center gap-1.5 rounded-full px-2 hover:bg-neutral-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-[#e8ff47]">{user.name?.[0]?.toUpperCase()}</span>
                    <ChevronDown size={14} className="hidden text-neutral-500 sm:block" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl border border-neutral-100 bg-white py-2 shadow-xl">
                      <p className="px-4 py-2 text-xs text-neutral-500">Signed in as<br /><span className="text-sm font-bold text-black">{user.name}</span></p>
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"><LayoutDashboard size={15} /> Dashboard</Link>
                      <Link to="/profile?tab=orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-neutral-50"><ShoppingBag size={15} /> My Orders</Link>
                      <button onClick={() => { logout(); setProfileOpen(false); navigate("/"); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"><LogOut size={15} /> Logout</button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="hidden h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-bold text-white hover:bg-neutral-800 sm:inline-flex">
                  <User size={16} /> LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="border-t border-neutral-100 px-4 py-3 md:hidden">
            <form onSubmit={submitSearch} className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shoes, brands..." className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm outline-none focus:border-black" />
            </form>
          </div>
        )}

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-neutral-100 px-4 py-3 lg:hidden">
            <div className="flex flex-col">
              {NAV.map((n) => (
                <NavLink key={n.label} to={n.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-3 text-sm font-semibold ${isActive ? "bg-neutral-100 text-black" : "text-neutral-600 hover:bg-neutral-50"}`}>
                  {n.label}
                </NavLink>
              ))}
              {installPrompt && !isInstalled && <button onClick={installApp} className="mt-2 rounded-full bg-[#e8ff47] px-4 py-3 text-center text-sm font-extrabold text-black">INSTALL VELOCITY APP</button>}
              {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-black px-4 py-3 text-center text-sm font-bold text-white">LOGIN / REGISTER</Link>}
              {user && <Link to="/profile" onClick={() => setMobileOpen(false)} className="mt-2 rounded-full bg-black px-4 py-3 text-center text-sm font-bold text-white">MY PROFILE</Link>}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
