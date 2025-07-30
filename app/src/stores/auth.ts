import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchOperators, fetchUser, loginUser, logoutUser, registerUser } from '@/api/auth'
import type { ApiUser, Credentials, RegisterData } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessTokenName = 'access_token'
  const accessTokenType = 'Bearer'
  const accessToken = ref<string | null>(localStorage.getItem(accessTokenName) || null)
  const user = ref<ApiUser | null>(null)
  const operators = ref<[] | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const loadUser = async () => {
    // Tiny delay
    await new Promise((resolve) => setTimeout(resolve, 50))
    await getUser()
  }

  loadUser().catch((error) => {
    console.error('Initial user load failed:', error)
  })

  async function login(credentials: Credentials) {
    try {
      isLoading.value = true
      error.value = null
      const { data } = await loginUser(credentials)
      accessToken.value = data.access_token
      await localStorage.setItem(accessTokenName, data.access_token)
      user.value = data.user
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: RegisterData) {
    try {
      isLoading.value = true
      error.value = null
      const { data } = await registerUser(userData)
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    if (!accessToken.value) {
      localStorage.removeItem(accessTokenName)
      // window.location.assign('/')
    }

    try {
      await logoutUser()
      accessToken.value = null
      user.value = null
      localStorage.removeItem(accessTokenName)
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    }
  }

  async function getUser() {
    if (!accessToken.value) return
    // Tiny delay
    await new Promise((resolve) => setTimeout(resolve, 50))
    try {
      isLoading.value = true
      const { data } = await fetchUser()
      user.value = data?.data || data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function checkToken(headers) {
    if (headers?.authorization) {
      const responseToken = headers.authorization
      const cleanToken = responseToken.replace(accessTokenType, '').trim()
      accessToken.value = cleanToken
      await localStorage.setItem(accessTokenName, cleanToken)
    }
    return accessToken.value
  }

  async function loadOperators() {
    try {
      isLoading.value = true
      const { data } = await fetchOperators()
      operators.value = data?.data || data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    accessToken,
    accessTokenName,
    isLoading,
    error,
    isAuthenticated,
    operators,
    login,
    register,
    logout,
    loadUser,
    checkToken,
    loadOperators,
  }
})
