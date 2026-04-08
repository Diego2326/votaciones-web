import clsx from 'clsx'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | undefined
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <input id={id} className={clsx('input', error && 'input-error', className)} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}
