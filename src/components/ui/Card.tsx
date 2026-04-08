import clsx from 'clsx'
import type { PropsWithChildren } from 'react'

export function Card({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <section className={clsx('panel-card', className)}>{children}</section>
}
