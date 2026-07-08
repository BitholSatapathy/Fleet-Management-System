const MapPlaceholder = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
          Live Fleet Tracking
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Live Fleet Map</h2>
      </div>

      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-sky-50 text-center">
        <p className="max-w-xs text-lg font-medium text-slate-500">Map will be displayed here</p>
      </div>
    </section>
  )
}

export default MapPlaceholder