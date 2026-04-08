import type { PropsWithChildren } from 'react'

export function FormSection({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <section className="form-section">
      <h3>{title}</h3>
      {children}
    </section>
  )
}
