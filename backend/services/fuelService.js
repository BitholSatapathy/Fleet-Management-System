const DEFAULT_COST_PER_LITER = 100

const safeParseNumber = (value) => {
  if (value === null || value === undefined) return 0
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

const computeFuelUsed = ({ distance, mileage }) => {
  const d = safeParseNumber(distance)
  const m = safeParseNumber(mileage)
  if (m <= 0) return 0
  return d / m
}

const computeEstimatedFuelCost = (fuelUsed, costPerLiter = DEFAULT_COST_PER_LITER) => {
  const f = safeParseNumber(fuelUsed)
  const c = safeParseNumber(costPerLiter)
  return f * c
}

module.exports = {
  DEFAULT_COST_PER_LITER,
  computeFuelUsed,
  computeEstimatedFuelCost,
}

