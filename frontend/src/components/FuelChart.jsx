import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const FuelChart = ({ fuelUsedPerTrip = [] }) => {
  const labels = fuelUsedPerTrip.map((t, idx) => String(t.tripId ?? idx + 1))
  const data = fuelUsedPerTrip.map((t) => Number(t.fuelUsed ?? 0))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Fuel Used (L)',
        data,
        backgroundColor: 'rgba(37, 99, 235, 0.25)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Liters',
        },
      },
    },
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Analytics
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Fuel Used Per Trip</h2>
        </div>
      </div>

      <div className="h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
    </section>
  )
}

export default FuelChart

