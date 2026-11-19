import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function RegisterPage() {
  const { register, toast } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Full name is required.");
    if (!form.email.includes("@")) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast("Account created — welcome to Velocity!");
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally { setLoading(false); }
  };

  const inputCls = "h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:bg-white";

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-neutral-100 bg-white p-7 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black font-display text-xl font-black italic text-[#e8ff47]">V</span>
        <h1 className="font-display mt-4 text-center text-2xl font-black tracking-tight">Create account</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">Join Velocity Club and get 10% off</p>

        <button onClick={() => toast("Google sign-in coming soon")} className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-neutral-200 text-sm font-bold hover:border-black">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5l-3.9 3C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-3.9-3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3c.9-2.8 3.6-4.9 6.8-4.9z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs font-semibold text-neutral-400"><span className="h-px flex-1 bg-neutral-200" /> OR <span className="h-px flex-1 bg-neutral-200" /></div>

        <form onSubmit={submit} className="space-y-3.5">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={form.name} onChange={set("name")} placeholder="Full name" className={inputCls} />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={inputCls} />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Password (min 6 chars)" className={`${inputCls} pr-12`} />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black" aria-label="Toggle password visibility">
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type={show ? "text" : "password"} value={form.confirm} onChange={set("confirm")} placeholder="Confirm password" className={inputCls} />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">{error}</p>}

          <label className="flex cursor-pointer items-start gap-2 text-xs text-neutral-500">
            <input type="checkbox" required className="checkbox checkbox-xs mt-0.5 border-neutral-300 [--chkbg:#0a0a0a] [--chkfg:#e8ff47]" />
            I agree to the Terms of Service and Privacy Policy.
          </label>

          <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800 disabled:opacity-60">
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><UserPlus size={16} /> CREATE ACCOUNT</>}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-neutral-500">Already have an account? <Link to="/login" className="font-bold text-black underline underline-offset-2">Sign in</Link></p>
      </div>
    </div>
  );
}
