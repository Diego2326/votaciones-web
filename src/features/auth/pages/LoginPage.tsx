import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormActions } from '@/components/forms/FormActions'
import { PageError } from '@/components/feedback/PageError'
import { ROUTES } from '@/core/constants/routes'
import { toAppError } from '@/core/utils/errors'
import { useLogin } from '@/features/auth/hooks/useLogin'
import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/auth.schema'

function getLoginErrorMessage(error: unknown) {
  const appError = toAppError(error)
  const normalizedMessage = appError.message.toLowerCase()

  if (
    appError.status === 401 ||
    normalizedMessage.includes('bad credentials') ||
    normalizedMessage.includes('invalid credentials') ||
    normalizedMessage.includes('credenciales invalidas')
  ) {
    return 'Usuario y/o contrasena incorrecta.'
  }

  return appError.message
}

export function LoginPage() {
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  return (
    <Card className="narrow auth-card">
      <div className="stack auth-form-stack">
        <div>
          <p className="eyebrow">Acceso</p>
          <h2>Iniciar sesion</h2>
          <p>Ingresa al panel para controlar torneos, brackets y votos en vivo.</p>
        </div>
        {loginMutation.isError ? (
          <PageError
            title="No se pudo iniciar sesion"
            message={getLoginErrorMessage(loginMutation.error)}
          />
        ) : null}
        <form className="form-grid" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
          <Input
            id="usernameOrEmail"
            type="text"
            label="Usuario o correo"
            error={errors.usernameOrEmail?.message}
            {...register('usernameOrEmail')}
          />
          <Input
            id="password"
            type="password"
            label="Contrasena"
            error={errors.password?.message}
            {...register('password')}
          />
          <FormActions>
            <Button type="submit" fullWidth disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Ingresando...' : 'Entrar'}
            </Button>
          </FormActions>
        </form>
        <p className="auth-switch-copy">
          ¿No tienes cuenta? <Link to={ROUTES.register}>Registrate</Link>
        </p>
      </div>
    </Card>
  )
}
