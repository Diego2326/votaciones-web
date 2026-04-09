import axios from 'axios'

import { env } from '@/core/config/env'
import { AppError } from '@/core/utils/errors'

interface ImgurUploadResponse {
  data: {
    link: string
  }
  success: boolean
  status: number
}

const imgurClient = axios.create({
  baseURL: 'https://api.imgur.com/3',
})

export async function uploadImageToImgur(file: File) {
  if (!env.imgurClientId) {
    throw new AppError('Falta configurar VITE_IMGUR_CLIENT_ID para subir imagenes.')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', 'file')

  const response = await imgurClient.post<ImgurUploadResponse>('/image', formData, {
    headers: {
      Authorization: `Client-ID ${env.imgurClientId}`,
    },
  })

  if (!response.data.success || !response.data.data.link) {
    throw new AppError('Imgur no devolvio una URL valida para la imagen.')
  }

  return response.data.data.link
}
