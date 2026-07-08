const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
          <Icon />
        </div>
      </div>
    </article>
  )
}

export default StatCard