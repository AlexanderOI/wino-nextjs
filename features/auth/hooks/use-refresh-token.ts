"use client"

import { useSession } from "next-auth/react"
import { apiClient } from "@/utils/api-client"

import { Company } from "@/features/company/interfaces/company.interface"
import { USERS_URL } from "@/constants/routes"

import { refreshToken } from "@/features/auth/actions/auth.action"

export const useRefreshToken = () => {
  const { data: session, update } = useSession()

  const refreshUserToken = async (company: Company) => {
    const response = await apiClient.get(
      `${USERS_URL}/change-current-company/${company._id}`
    )

    if (response.status === 200) {
      const newAccessToken = await refreshToken()

      await update({
        user: {
          ...session?.user,
          companyId: company._id,
          companyName: company.name,
          companyAddress: company.address,
        },
        backendTokens: newAccessToken,
      })
    }
  }

  return { refreshUserToken }
}
