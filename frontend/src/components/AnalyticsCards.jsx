import { FaGasPump, FaRoute, FaTruckFast, FaChartLine, FaClipboardList } from 'react-icons/fa6'

const cards = [
  { title: 'Total Fuel Used', valueKey: 'totalFuelUsed', icon: FaGasPump, suffix: ' L' },
  { title: 'Total Distance Covered', valueKey: 'totalDistance', icon: FaRoute, suffix: ' km' },
  { title: 'Average Mileage', valueKey: 'averageMileage', icon: FaTruckFast, suffix: ' km/L' },
  { title: 'Estimated Fuel Cost', valueKey: 'estimatedFuelCost', icon: FaChartLine, prefix: '₹' },
  { title: 'Trips Completed', valueKey: 'tripCount', icon: FaClipboardList },
]

const formatNumber = (n, decimals = 2) => {
  const num = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(num)) return '0'
  return num.toFixed(decimals)
}

const AnalyticsCards = ({ analytics }) => {
  const safe = analytics || {}

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const raw = safe[c.valueKey]
        const isCount = c.valueKey === 'tripCount'

        const display = isCount
          ? String(raw ?? 0)
          : c.prefix
            ? `${c.prefix}${formatNumber(raw ?? 0)}`
            : `${formatNumber(raw ?? 0)}${c.suffix || ''}`

        const Icon = c.icon

        return (
          <article
            key={c.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{c.title}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {display}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                <Icon />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default AnalyticsCards

