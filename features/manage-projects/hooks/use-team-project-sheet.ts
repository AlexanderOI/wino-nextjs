import { USERS_URL } from "@/constants/routes"

import { useToast } from "@/components/ui/use-toast"
import { PROJECTS_URL } from "@/constants/routes"
import { useCallback, useEffect } from "react"
import { User } from "@/types/next-auth"
import apiClient from "@/utils/api-client"
import { useState } from "react"
import { Projects } from "@/types/global"

export function useTeamProjectSheet(id?: string) {
  const { toast } = useToast()
  const [usersProjectTeam, setUsersProjectTeam] = useState<string[]>([])
  const [search, setSearch] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await apiClient.get<User[]>(USERS_URL)
      setUsers(response.data)

      if (id) {
        const responseProjectTeam = await apiClient.get<Projects>(`${PROJECTS_URL}/${id}`)
        setUsersProjectTeam(responseProjectTeam.data.usersTeam)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleSelect = (item: string) => {
    setUsersProjectTeam((prevValues) => [...prevValues, item])
  }

  const handleRemove = (value: string) => {
    setUsersProjectTeam((prevValues) => prevValues.filter((item) => item !== value))
  }

  const handleSave = async () => {
    const response = await apiClient.put(`${PROJECTS_URL}/${id}/set-users-team`, {
      users: usersProjectTeam,
    })

    if (response.status === 200) {
      toast({
        title: "Users added to the team",
        description: "Users have been added to the team successfully",
        duration: 1000,
      })
    } else {
      toast({
        title: "Error adding users to the team",
        description: "Error adding users to the team",
        duration: 1000,
        variant: "destructive",
      })
    }
  }

  return {
    users,
    search,
    usersProjectTeam,
    handleSelect,
    handleRemove,
    handleSave,
    setSearch,
    fetchInitialData,
  }
}
