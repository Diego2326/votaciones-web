import clsx from 'clsx'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string | undefined
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <textarea id={id} className={clsx('input', error && 'input-error', className)} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}
