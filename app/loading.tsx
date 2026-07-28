// Lightweight skeleton shown during route transitions (brief: loading state).
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
      <div className="h-3 w-28 animate-pulse rounded bg-stone-200" />
      <div className="mt-4 h-10 w-2/3 max-w-xl animate-pulse rounded bg-stone-200" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-ink/10">
            <div className="h-44 animate-pulse bg-stone-200" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
