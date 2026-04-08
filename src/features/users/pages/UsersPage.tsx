import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import {
  Table,
  TableActions,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/Table'
import { PageError } from '@/components/feedback/PageError'
import { toAppError } from '@/core/utils/errors'
import { ROLES } from '@/core/constants/roles'
import {
  useUpdateUserRoles,
  useUpdateUserStatus,
  useUsers,
} from '@/features/users/hooks/useUsers'

export function UsersPage() {
  const usersQuery = useUsers()
  const statusMutation = useUpdateUserStatus()
  const rolesMutation = useUpdateUserRoles()

  if (usersQuery.isLoading) {
    return <Loader label="Cargando usuarios..." />
  }

  if (usersQuery.isError) {
    return <PageError message={toAppError(usersQuery.error).message} />
  }

  return (
    <Card>
      <div className="stack">
        <div>
          <p className="eyebrow">Administracion</p>
          <h1>Usuarios</h1>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Usuario</TableCell>
              <TableCell header>Roles</TableCell>
              <TableCell header>Estado</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(usersQuery.data ?? []).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.username}
                  <div className="label-muted">{user.email}</div>
                </TableCell>
                <TableCell>{user.roles.join(', ')}</TableCell>
                <TableCell>{user.enabled ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>
                  <TableActions>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        statusMutation.mutate({
                          id: user.id,
                          payload: { enabled: !user.enabled },
                        })
                      }
                    >
                      {user.enabled ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button
                      onClick={() =>
                        rolesMutation.mutate({
                          id: user.id,
                          payload: {
                            roles: user.roles.includes(ROLES.ORGANIZER)
                              ? [ROLES.VOTER]
                              : [ROLES.ORGANIZER],
                          },
                        })
                      }
                    >
                      Cambiar rol
                    </Button>
                  </TableActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
