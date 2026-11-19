export default function SizeSelector({ sizes, selected, onChange, label = "Select size (EU)" }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <button type="button" className="text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-black">Size guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes?.map((s) => {
          const active = selected === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`h-11 min-w-12 rounded-xl border px-3 text-sm font-bold transition ${active ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-black"}`}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
