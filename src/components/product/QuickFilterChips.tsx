"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface QuickFilterChipsProps {
  /** Key in the search params this row toggles (e.g. "color", "fabric") */
  filterKey: "color" | "fabric" | "occasion" | "silkType";
  /** Options to render as chips */
  options: string[];
  /** Optional "All" chip label (clears the filter when clicked) */
  allLabel?: string;
}

export default function QuickFilterChips({
  filterKey,
  options,
  allLabel,
}: QuickFilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(filterKey);

  const apply = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(filterKey) === value) {
      params.delete(filterKey);
    } else {
      params.set(filterKey, value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      {allLabel && (
        <button
          onClick={() => apply(null)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !current
              ? "bg-brand-red text-white border-brand-red"
              : "bg-white text-foreground border-border hover:border-brand-red"
          }`}
        >
          {allLabel}
        </button>
      )}
      {options.map((opt) => {
        const active = current === opt;
        return (
          <button
            key={opt}
            onClick={() => apply(opt)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              active
                ? "bg-brand-red text-white border-brand-red"
                : "bg-white text-foreground border-border hover:border-brand-red"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
