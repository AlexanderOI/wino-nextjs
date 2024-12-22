import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { ROLES_URL, USERS_URL } from "@/constants/routes"
import { Roles } from "@/types/global"

type UserDialog = {
  name: string
  userName: string
  email: string
  roles: string[]
  password: string
  confirmPassword: string
  roleType: string
}

const initialUser: UserDialog = {
  name: "",
  userName: "",
  email: "",
  roles: [],
  password: "",
  confirmPassword: "",
  roleType: "",
}

export function useUserDialog(id?: string) {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<UserDialog>(initialUser)
  const [roles, setRoles] = useState<Roles[]>([])

  const fetchInitialData = useCallback(async () => {
    try {
      const roleResponse = await apiClient.get<Roles[]>(ROLES_URL)
      setRoles(roleResponse.data)
      if (id) {
        const userResponse = await apiClient.get<UserDialog>(`${USERS_URL}/${id}`)
        const { name, roles, userName, email, roleType } = userResponse.data
        setUser((prev) => ({
          ...prev,
          name,
          roles,
          userName,
          email,
          roleType,
        }))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setUser((prev) => ({
      ...prev,
      roles: prev.roles.includes(value)
        ? prev.roles.filter((p) => p !== value)
        : [...prev.roles, value],
    }))
  }

  const handleSubmit = async (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault()

    try {
      if (id) {
        await apiClient.patch(`${USERS_URL}/${id}`, user)
      } else {
        await apiClient.post(USERS_URL, user)
      }
      setUser(initialUser)
      onClose()
      router.refresh()
      toast({
        title: "User saved",
        description: "User has been saved successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  return {
    user,
    roles,
    fetchInitialData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  }
}
