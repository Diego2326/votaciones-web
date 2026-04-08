import clsx from 'clsx'

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  return <span className={clsx('badge', `badge-${tone}`)}>{children}</span>
}
