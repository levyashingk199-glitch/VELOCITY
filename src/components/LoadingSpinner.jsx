export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-neutral-200 border-t-black" />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
