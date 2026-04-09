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
import { useRegister } from '@/features/auth/hooks/useRegister'
import {
  registerSchema,
  type RegisterSchema,
} from '@/features/auth/schemas/auth.schema'

export function RegisterPage() {
  const registerMutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  })

  return (
    <Card className="narrow auth-card">
      <div className="stack auth-form-stack">
        <div>
          <p className="eyebrow">Onboarding</p>
          <h2>Crear cuenta</h2>
          <p>Crea tu acceso para gestionar torneos y coordinar la votacion en vivo.</p>
        </div>
        {registerMutation.isError ? (
          <PageError message={toAppError(registerMutation.error).message} />
        ) : null}
        <form
          className="form-grid columns-2"
          onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
        >
          <Input
            id="firstName"
            label="Nombre"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            id="lastName"
            label="Apellido"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
          <Input
            id="username"
            label="Usuario"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            id="email"
            type="email"
            label="Correo"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="password"
            type="password"
            label="Contrasena"
            error={errors.password?.message}
            {...register('password')}
          />
          <FormActions>
            <Button type="submit" fullWidth disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </FormActions>
        </form>
        <p className="auth-switch-copy">
          ¿Ya tienes cuenta? <Link to={ROUTES.login}>Inicia sesion</Link>
        </p>
      </div>
    </Card>
  )
}
