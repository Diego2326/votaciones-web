import './App.css'
import { organizerApi } from './api/auth'
import { joinApi } from './api/join'
import { tournamentsApi } from './api/tournaments'
import { votesApi } from './api/votes'
import {
  API_BASE_URL,
  SESSION_HEADER,
  TOKEN_STORAGE_KEY,
  buildSessionHeaders,
} from './api/http'

const organizerFlow = [
  'Iniciar sesion con JWT y persistir accessToken + refreshToken.',
  'Crear y administrar torneos, rondas, matches y participantes.',
  'Consultar /access para mostrar PIN y renderizar el QR con joinUrl.',
]

const voterFlow = [
  'Resolver torneo por PIN o QR para conocer accessMode.',
  'Crear sessionToken con /join/name, /join/qr o /join/auth.',
  'Usar X-Tournament-Session para lobby, voto, presencia y restauracion.',
]

const realtimeTopics = [
  '/topic/tournament/{tournamentId}',
  '/topic/tournament/{tournamentId}/round/{roundId}',
]

const scaffoldHighlights = [
  'Helpers HTTP separados para JWT y session token.',
  'Tipos base para envelopes, torneos, rondas, matches y sesiones.',
  'Funciones listas para login, join, lectura publica y voto.',
]

function App() {
  const sampleSessionHeaders = buildSessionHeaders('session-token-demo')

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">React + Vite scaffold</p>
          <h1>Frontend base para Votaciones API</h1>
          <p className="lead">
            Esta app ya no es el starter de Vite. Queda alineada con los flujos
            de organizador y votante descritos por el backend en Kotlin +
            Spring Boot.
          </p>
        </div>

        <div className="hero-card">
          <h2>Configuracion central</h2>
          <dl className="meta-grid">
            <div>
              <dt>API</dt>
              <dd>{API_BASE_URL}</dd>
            </div>
            <div>
              <dt>JWT storage</dt>
              <dd>{TOKEN_STORAGE_KEY}</dd>
            </div>
            <div>
              <dt>Session header</dt>
              <dd>{SESSION_HEADER}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <h2>Flujo organizador</h2>
          <ol>
            {organizerFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <div className="code-card">
            <p className="code-title">API lista</p>
            <code>organizerApi.login()</code>
            <code>tournamentsApi.createTournament()</code>
            <code>tournamentsApi.getTournamentAccess()</code>
          </div>
        </article>

        <article className="panel">
          <h2>Flujo votante</h2>
          <ol>
            {voterFlow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <div className="code-card">
            <p className="code-title">API lista</p>
            <code>joinApi.resolveByPin()</code>
            <code>joinApi.joinWithDisplayName()</code>
            <code>votesApi.submitVote()</code>
          </div>
        </article>

        <article className="panel">
          <h2>Tiempo real</h2>
          <p>
            El backend expone SockJS/STOMP en <code>/ws</code>. El scaffold deja
            definida la estructura de datos y los topics a suscribir.
          </p>
          <ul>
            {realtimeTopics.map((topic) => (
              <li key={topic}>
                <code>{topic}</code>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Lo que ya quedo listo</h2>
          <ul>
            {scaffoldHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Punto de partida sugerido: conectar estas funciones con Router,
            estado remoto y pantallas por fase.
          </p>
        </article>
      </section>

      <section className="reference-panel">
        <div className="reference-copy">
          <h2>Ejemplo de header de sesion</h2>
          <pre>{JSON.stringify(sampleSessionHeaders, null, 2)}</pre>
        </div>

        <div className="reference-copy">
          <h2>Rutas candidatas</h2>
          <pre>{`/\n/join/:qrToken\n/tournament/:tournamentId/lobby\n/tournament/:tournamentId/match/:matchId`}</pre>
        </div>
      </section>
    </main>
  )
}

void organizerApi
void joinApi
void tournamentsApi
void votesApi

export default App
