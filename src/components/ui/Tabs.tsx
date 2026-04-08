import clsx from 'clsx'

export interface TabOption {
  value: string
  label: string
}

interface TabsProps {
  options: TabOption[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ options, value, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx('tab', option.value === value && 'tab-active')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
