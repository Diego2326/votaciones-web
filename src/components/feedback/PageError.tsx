interface PageErrorProps {
  title?: string
  message: string
}

export function PageError({
  title = 'No se pudo cargar la informacion',
  message,
}: PageErrorProps) {
  return (
    <div className="empty-state error-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
