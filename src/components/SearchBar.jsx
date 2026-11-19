import { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ value = "", onChange, autoFocus = false, placeholder = "Search shoes, brands..." }) {
  const [local, setLocal] = useState(value);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (onChange) onChange(local);
    else navigate(`/shop?search=${encodeURIComponent(local)}`);
  };

  return (
    <form onSubmit={submit} className="relative w-full">
      <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        value={local}
        autoFocus={autoFocus}
        onChange={(e) => { setLocal(e.target.value); if (onChange) onChange(e.target.value); }}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-11 pr-10 text-sm outline-none transition focus:border-black focus:bg-white"
      />
      {local && (
        <button type="button" onClick={() => { setLocal(""); if (onChange) onChange(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-black">
          <X size={15} />
        </button>
      )}
    </form>
  );
}
