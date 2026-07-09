interface Props {
  label: string
  delta: number
}

function MetricDelta({ label, delta }: Props) {
  const color =
    delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-red-400' : 'text-slate-500'
  const sign = delta > 0 ? '+' : ''

  return (
    <div className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`font-bold ${color}`}>
        {sign}
        {delta}
      </span>
    </div>
  )
}

export default MetricDelta
