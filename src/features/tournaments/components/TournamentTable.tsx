import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/Table'
import type { Tournament } from '@/core/types/domain'

export function TournamentTable({
  tournaments,
  emptyMessage,
}: {
  tournaments: Tournament[]
  emptyMessage?: string
}) {
  if (tournaments.length === 0) {
    return <p>{emptyMessage ?? 'No hay torneos para mostrar.'}</p>
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell header>Nombre</TableCell>
          <TableCell header>Descripcion</TableCell>
          <TableCell header>Estado</TableCell>
          <TableCell header>Publicado</TableCell>
          <TableCell header>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tournaments.map((tournament) => (
          <TableRow key={tournament.id}>
            <TableCell>{tournament.name}</TableCell>
            <TableCell>{tournament.description ?? 'Sin descripcion'}</TableCell>
            <TableCell>
              <Badge
                tone={
                  tournament.active
                    ? 'success'
                    : tournament.status === 'CLOSED'
                      ? 'danger'
                      : tournament.published
                        ? 'warning'
                        : 'neutral'
                }
              >
                {tournament.status}
              </Badge>
            </TableCell>
            <TableCell>{tournament.published ? 'Si' : 'No'}</TableCell>
            <TableCell>
              <TableActions>
                <Link to={`/tournaments/${tournament.id}`}>
                  <Button variant="secondary">Ver detalle</Button>
                </Link>
                <Link to={`/tournaments/${tournament.id}/edit`}>
                  <Button variant="ghost">Editar</Button>
                </Link>
              </TableActions>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
