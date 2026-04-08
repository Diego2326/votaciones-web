import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Ingresa un correo valido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  username: z.string().min(3, 'Ingresa un nombre de usuario valido'),
  firstName: z.string().min(2, 'Ingresa el nombre'),
  lastName: z.string().min(2, 'Ingresa el apellido'),
  email: z.email('Ingresa un correo valido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
