import { USERS_URL } from "@/constants/routes"

import { useToast } from "@/components/ui/use-toast"
import { PROJECTS_URL } from "@/constants/routes"
import { useCallback } from "react"
import apiClient from "@/utils/api-client"
import { useState } from "react"

import { Project } from "@/features/project/interfaces/project.interface"
import { User } from "@/features/user/interfaces/user.interface"

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
        const responseProjectTeam = await apiClient.get<Project>(
          `${PROJECTS_URL}/${id}?withUsers=true`
        )
        setUsersProjectTeam(responseProjectTeam.data.membersId)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleSelect = (value: string) => {
    setUsersProjectTeam((prevValues) => [...prevValues, value])
  }

  const handleRemove = (value: string) => {
    setUsersProjectTeam((prevValues) => prevValues.filter((item) => item !== value))
  }

  const handleSave = async () => {
    const response = await apiClient.put(`${PROJECTS_URL}/${id}/set-users-team`, {
      membersId: usersProjectTeam,
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
