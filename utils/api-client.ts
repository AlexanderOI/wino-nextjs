import axios from "axios"
import { getSession } from "next-auth/react"

import { BACKEND_URL } from "@/constants/routes"

const apiClient = axios.create({
  baseURL: BACKEND_URL,
})

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session && session.backendTokens) {
      config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { apiClient }
