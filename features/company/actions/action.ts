"use server"

import { apiClientServer } from "@/utils/api-client-server"

import { Company } from "@/features/company/interfaces/company.interface"

export async function getCompanyById(id?: string) {
  if (!id) return null

  const response = await apiClientServer.get<Company>(`/company/${id}`)
  return response.data
}
