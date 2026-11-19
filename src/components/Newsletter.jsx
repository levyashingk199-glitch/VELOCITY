import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Newsletter() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast("Enter a valid email address", "error"); return; }
    setDone(true);
    toast("Welcome to the club — check your inbox for 10% off");
    setEmail("");
  };

  return (
    <section className="bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <span className="rounded-full border border-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#e8ff47]">Velocity Club</span>
        <h2 className="font-display max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
          GET 10% OFF YOUR FIRST ORDER
        </h2>
        <p className="max-w-xl text-sm text-white/60 sm:text-base">
          Join 50,000+ athletes and sneakerheads. Early access to drops, members-only prices and zero spam.
        </p>
        {done ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-[#e8ff47]">
            <CheckCircle2 size={18} /> You're in! Welcome code: <span className="font-mono font-bold">STEP10</span>
          </p>
        ) : (
          <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="h-13 flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#e8ff47]"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e8ff47] px-7 py-3.5 text-sm font-extrabold text-black transition hover:bg-white">
              <Send size={15} /> SUBSCRIBE
            </button>
          </form>
        )}
        <p className="text-xs text-white/40">By subscribing you agree to our Privacy Policy. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
