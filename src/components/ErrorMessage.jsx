import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"><AlertCircle size={24} /></span>
      <p className="font-semibold text-neutral-900">Couldn't load products</p>
      <p className="text-sm text-neutral-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-1 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          <RotateCcw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
