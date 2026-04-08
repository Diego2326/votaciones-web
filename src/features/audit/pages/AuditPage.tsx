import { useState } from 'react'

import { PageError } from '@/components/feedback/PageError'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/Table'
import { toAppError } from '@/core/utils/errors'
import { useAudit } from '@/features/audit/hooks/useAudit'

export function AuditPage() {
  const [filter, setFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined)
  const auditQuery = useAudit(activeFilter)

  if (auditQuery.isLoading) {
    return <Loader label="Cargando auditoria..." />
  }

  if (auditQuery.isError) {
    return <PageError message={toAppError(auditQuery.error).message} />
  }

  return (
    <Card>
      <div className="stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Monitoreo</p>
            <h1>Auditoria</h1>
          </div>
        </div>
        <div className="inline-group">
          <Input label="Filtrar por torneo" value={filter} onChange={(event) => setFilter(event.target.value)} />
          <Button onClick={() => setActiveFilter(filter || undefined)}>Aplicar</Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Fecha</TableCell>
              <TableCell header>Accion</TableCell>
              <TableCell header>Entidad</TableCell>
              <TableCell header>Usuario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(auditQuery.data ?? []).map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.createdAt}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  {log.entityType} / {log.entityId}
                </TableCell>
                <TableCell>{log.username ?? log.userId ?? 'Sistema'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
