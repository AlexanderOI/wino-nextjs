import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { COMPANY_URL } from "@/constants/routes"
import { Company, useCompanyStore } from "@/stores/company.store"

export function useCompanyDialog(id?: string) {
  const { toast } = useToast()
  const router = useRouter()
  const setCompanies = useCompanyStore((state) => state.setCompanies)

  const [company, setCompany] = useState({
    name: "",
    address: "",
  })

  const fetchInitialData = useCallback(async () => {
    try {
      if (id) {
        const companyResponse = await apiClient.get<Company>(`${COMPANY_URL}/${id}`)
        const { name, address } = companyResponse.data
        setCompany({ name, address })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompany((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault()

    try {
      let newData
      if (id) {
        newData = await apiClient.patch<Company>(`${COMPANY_URL}/${id}`, company)
        console.log("newData", newData.data)
      } else {
        newData = await apiClient.post<Company>(COMPANY_URL, company)
      }
      setCompanies([newData.data])
      setCompany({ name: "", address: "" })
      onClose()

      router.refresh()

      toast({
        title: "Company saved",
        description: "Company has been saved successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Error saving company:", error)
    }
  }

  return {
    company,
    fetchInitialData,
    handleInputChange,
    handleSubmit,
  }
}
