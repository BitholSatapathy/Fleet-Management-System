const recentTrips = [
  { vehicle: 'Truck 01', driver: 'Aarav Singh', destination: 'Mumbai', status: 'In Transit' },
  { vehicle: 'Van 12', driver: 'Priya Mehta', destination: 'Pune', status: 'Delivered' },
  { vehicle: 'Truck 07', driver: 'Rahul Das', destination: 'Nagpur', status: 'Delayed' },
  { vehicle: 'Car 04', driver: 'Neha Roy', destination: 'Bhopal', status: 'In Transit' },
  { vehicle: 'Trailer 19', driver: 'Imran Khan', destination: 'Surat', status: 'Scheduled' },
]

const statusStyles = {
  'In Transit': 'bg-blue-50 text-blue-700 ring-blue-100',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Delayed: 'bg-amber-50 text-amber-700 ring-amber-100',
  Scheduled: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const RecentTrips = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Operations
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent Trips</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {recentTrips.map((trip) => (
              <tr key={`${trip.vehicle}-${trip.driver}`} className="hover:bg-slate-50/70">
                <td className="px-4 py-4 font-medium text-slate-900">{trip.vehicle}</td>
                <td className="px-4 py-4">{trip.driver}</td>
                <td className="px-4 py-4">{trip.destination}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[trip.status]}`}
                  >
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RecentTrips