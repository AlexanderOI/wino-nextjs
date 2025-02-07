import axios from "axios"
import { getSession } from "@/utils/get-session"

import { BACKEND_URL } from "@/constants/routes"

const apiClientServer = axios.create({
  baseURL: BACKEND_URL,
})

apiClientServer.interceptors.request.use(
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

export { apiClientServer }
