import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { FormActions } from '@/components/forms/FormActions'
import {
  participantSchema,
  type ParticipantSchema,
} from '@/features/participants/schemas/participant.schema'
import type { ParticipantPayload } from '@/features/participants/types/participant.types'

export function ParticipantForm({
  initialValues,
  onSubmit,
  submitLabel = 'Guardar participante',
  onCancel,
  isSubmitting = false,
}: {
  initialValues?: ParticipantPayload | undefined
  onSubmit: (values: ParticipantPayload, imageFile: File | null) => Promise<void> | void
  submitLabel?: string
  onCancel?: (() => void) | undefined
  isSubmitting?: boolean
}) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantSchema>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      active: initialValues?.active === false ? 'false' : 'true',
    },
  })

  const previewUrl = useMemo(() => {
    if (selectedImageFile) {
      return URL.createObjectURL(selectedImageFile)
    }

    return initialValues?.imageUrl ?? null
  }, [initialValues?.imageUrl, selectedImageFile])

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null

    if (!nextFile) {
      setSelectedImageFile(null)
      setImageError(null)
      return
    }

    if (!nextFile.type.startsWith('image/')) {
      setSelectedImageFile(null)
      setImageError('Selecciona un archivo de imagen valido.')
      return
    }

    if (nextFile.size > 10 * 1024 * 1024) {
      setSelectedImageFile(null)
      setImageError('La imagen no puede superar 10 MB.')
      return
    }

    setSelectedImageFile(nextFile)
    setImageError(null)
  }

  return (
    <form
      className="form-grid columns-2"
      onSubmit={handleSubmit(async (values) => {
        if (imageError) {
          return
        }

        const payload: ParticipantPayload = {
          name: values.name,
          description: values.description?.trim() ? values.description : null,
          imageUrl: initialValues?.imageUrl ?? null,
          active: values.active === 'true',
        }

        await onSubmit(payload, selectedImageFile)
      })}
    >
      <Input id="participant-name" label="Nombre" error={errors.name?.message} {...register('name')} />
      <Input
        id="participant-description"
        label="Descripcion"
        error={errors.description?.message}
        {...register('description')}
      />
      <label className="field" htmlFor="participant-image-file">
        <span className="field-label">Foto</span>
        <input
          id="participant-image-file"
          className="input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {selectedImageFile ? (
          <span className="label-muted">Archivo seleccionado: {selectedImageFile.name}</span>
        ) : null}
        {imageError ? <span className="field-error">{imageError}</span> : null}
      </label>
      <Select
        id="participant-active"
        label="Estado"
        error={errors.active?.message}
        {...register('active')}
      >
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </Select>
      {previewUrl ? (
        <div className="field">
          <span className="field-label">Vista previa</span>
          <img
            src={previewUrl}
            alt={`Vista previa de ${initialValues?.name ?? 'participante'}`}
            style={{
              width: '96px',
              height: '96px',
              objectFit: 'cover',
              borderRadius: '1rem',
              border: '1px solid rgba(31, 41, 51, 0.12)',
            }}
          />
        </div>
      ) : null}
      <FormActions>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </FormActions>
    </form>
  )
}
