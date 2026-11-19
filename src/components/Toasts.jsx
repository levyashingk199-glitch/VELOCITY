import { CheckCircle2, XCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="animate-toast pointer-events-auto flex w-full items-center gap-2.5 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          {t.type === "error" ? <XCircle size={17} className="shrink-0 text-red-400" /> : <CheckCircle2 size={17} className="shrink-0 text-[#e8ff47]" />}
          <span className="line-clamp-2">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
