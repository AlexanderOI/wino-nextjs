import { apiClientServer } from "@/utils/api-client-server"
import { FormSchema } from "@/features/form/interfaces/form.interface"

export async function createFormTask(data: FormSchema) {
  const response = await apiClientServer.post<FormSchema>("/forms-task", data)
  return response.data
}

export async function getFormTask(id?: string) {
  if (!id) return null
  const response = await apiClientServer.get<FormSchema>(`/forms-task/${id}`)
  return response.data
}

export async function updateFormTask(id: string, data: FormSchema) {
  const response = await apiClientServer.put<FormSchema>(`/forms-task/${id}`, data)
  return response.data
}

export async function deleteFormTask(id: string) {
  const response = await apiClientServer.delete<FormSchema>(`/forms-task/${id}`)
  return response.data
}

type GetFormsTaskParams = {
  fields?: boolean
}

export async function getFormsTask(params?: GetFormsTaskParams) {
  const response = await apiClientServer.get<FormSchema[]>("/forms-task", {
    params: params,
  })
  return response.data
}

export async function duplicateFormTask(id: string) {
  const response = await apiClientServer.post<FormSchema>(`/forms-task/${id}/duplicate`)
  return response.data
}
