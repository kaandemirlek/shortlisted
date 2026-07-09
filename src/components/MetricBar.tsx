interface Props {
  label: string
  value: number // 0-100
}

function MetricBar({ label, value }: Props) {
  const color =
    value >= 60 ? 'bg-emerald-500' : value >= 30 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="w-36">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  )
}

export default MetricBar
