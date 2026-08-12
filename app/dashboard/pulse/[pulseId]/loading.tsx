export default function PulseDetailLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-4 w-32 rounded bg-muted-surface" />
        <div className="mt-3 h-6 w-40 rounded bg-muted-surface" />
        <div className="mt-2 h-4 w-56 rounded bg-muted-surface" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="h-3 w-20 rounded bg-muted-surface" />
            <div className="mt-3 h-7 w-16 rounded bg-muted-surface" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="h-4 w-32 rounded bg-muted-surface" />
        <div className="mt-6 h-64 rounded bg-muted-surface" />
      </div>
    </div>
  );
}
