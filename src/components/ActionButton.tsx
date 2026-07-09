interface Props {
  label: string
  description: string
  disabled: boolean
  onClick: () => void
}

function ActionButton({ label, description, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-left bg-slate-700/60 hover:bg-slate-700 rounded-lg p-3
                 disabled:opacity-40 disabled:cursor-not-allowed
                 disabled:hover:bg-slate-700/60 transition-colors"
    >
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{description}</div>
    </button>
  )
}

export default ActionButton
