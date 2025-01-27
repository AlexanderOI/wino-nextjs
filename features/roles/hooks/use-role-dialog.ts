import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { PERMISSIONS_URL, ROLES_URL } from "@/constants/routes"
import { Permissions, Role } from "@/features/roles/interfaces/role.interface"

interface RoleDialog extends Omit<Role, "_id"> {}

const initialRole: RoleDialog = {
  name: "",
  description: "",
  permissions: [],
}

export function useRoleDialog(id?: string) {
  const { toast } = useToast()
  const router = useRouter()
  const [permissions, setPermissions] = useState<Permissions[] | null>(null)
  const [role, setRole] = useState<RoleDialog>(initialRole)

  const fetchInitialData = useCallback(async () => {
    try {
      const permissionResponse = await apiClient.get<Permissions[]>(PERMISSIONS_URL)
      setPermissions(permissionResponse.data)

      if (id) {
        const roleResponse = await apiClient.get<Role>(`${ROLES_URL}/${id}`)
        const { name, description, permissions } = roleResponse.data
        setRole({ name, description, permissions })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRole((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(value)
        ? prev.permissions.filter((p) => p !== value)
        : [...prev.permissions, value],
    }))
  }

  const handleSubmit = async (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault()

    try {
      if (id) {
        await apiClient.patch(`${ROLES_URL}/${id}`, role)
      } else {
        await apiClient.post(ROLES_URL, role)
      }
      setRole(initialRole)
      onClose()
      router.refresh()
      toast({
        title: "Role saved",
        description: "Role has been saved successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Error saving role:", error)
    }
  }

  return {
    permissions,
    role,
    fetchInitialData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  }
}
