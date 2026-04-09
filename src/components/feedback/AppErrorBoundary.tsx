import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  override state: State = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="centered-state">
          <div className="panel-card narrow">
            <h1>La aplicacion encontro un error</h1>
            <p>Recarga la pagina e intenta de nuevo.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
