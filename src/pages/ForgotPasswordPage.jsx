import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { authService } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-neutral-100 bg-white p-7 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:p-9">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#e8ff47]"><KeyRound size={20} /></span>
        <h1 className="font-display mt-4 text-center text-2xl font-black tracking-tight">Reset password</h1>
        <p className="mt-1 text-center text-sm text-neutral-500">Enter your email and we'll send you a reset link.</p>

        {done ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-5 py-6 text-center">
            <CheckCircle2 size={28} className="mx-auto text-emerald-600" />
            <p className="mt-2 text-sm font-bold text-emerald-800">Check your inbox</p>
            <p className="mt-1 text-xs text-emerald-700">A password reset link was sent to <strong>{email}</strong>.</p>
            <Link to="/login" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-black underline underline-offset-2"><ArrowLeft size={13} /> Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3.5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 pl-11 pr-4 text-sm outline-none transition focus:border-black focus:bg-white" />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">{error}</p>}
            <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-extrabold tracking-wide text-white hover:bg-neutral-800 disabled:opacity-60">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : "SEND RESET LINK"}
            </button>
            <p className="text-center text-sm text-neutral-500"><Link to="/login" className="inline-flex items-center gap-1.5 font-bold text-black underline underline-offset-2"><ArrowLeft size={13} /> Back to sign in</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
