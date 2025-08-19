import api from './httpClient'
import type { AxiosResponse } from 'axios'
import type { AuthResponse, RegisterData, Credentials, ApiUser } from '@/types/auth'

export const loginUser = async (credentials: Credentials): Promise<AxiosResponse<AuthResponse>> => {
  return api.post('/auth/login', credentials)
}

export const registerUser = async (
  userData: RegisterData,
): Promise<AxiosResponse<AuthResponse>> => {
  return api.post('/auth/register', userData)
}

export const logoutUser = async (): Promise<AxiosResponse<void>> => {
  return api.post('/auth/logout')
}

export const fetchUser = async (): Promise<AxiosResponse<ApiUser>> => {
  return api.get('/auth/user')
}

export const forgotPassword = async (data: any): Promise<void> => {
  await api.post('/auth/forgot-password', data)
}

export const resetPassword = async (data: any): Promise<void> => {
  await api.post('/auth/reset-password', data)
}

export const verifyEmailCode = async (data: { code: string }): Promise<AxiosResponse> => {
  return api.post('/email/verify/code', data)
}

export const verifyEmail = (data: {
  id: string
  hash: string
  signature: string
  expires: string
}) => {
  return api.get(`/email/verify/${data.id}/${data.hash}`, {
    params: {
      signature: data.signature,
      expires: data.expires,
    },
  })
}

export const resendVerificationEmail = (data: { email: string }) => {
  return api.post('/email/resend', data)
}

export const fetchOperators = async (): Promise<AxiosResponse> => {
  return api.get('/operators')
}
