export function Loader({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="loader">
      <span className="loader-dot" />
      <span>{label}</span>
    </div>
  )
}
