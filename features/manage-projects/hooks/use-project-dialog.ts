import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/utils/api-client"
import { PROJECTS_URL, USERS_URL } from "@/constants/routes"
import { Project } from "@/features/project/interfaces/project.interface"
import { User } from "@/features/user/interfaces/user.interface"

type ProjectDialog = Omit<Project, "_id" | "membersId" | "company">

const initialProject: ProjectDialog = {
  name: "",
  description: "",
  leaderId: "",
  startDate: new Date(),
  endDate: new Date(),
  client: "",
  status: "",
}

export function useProjectDialog(id?: string) {
  const { toast } = useToast()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDialog>(initialProject)
  const [users, setUsers] = useState<User[]>([])

  const fetchInitialData = useCallback(async () => {
    try {
      const response = await apiClient.get<User[]>(USERS_URL)
      setUsers(response.data)

      if (id) {
        const projectResponse = await apiClient.get<Project>(`${PROJECTS_URL}/${id}`)

        const { name, description, leaderId, startDate, endDate, status, client } =
          projectResponse.data

        setProject({
          name,
          description,
          leaderId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status,
          client,
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectDate = (name: string, date: Date | undefined) => {
    setProject((prev) => ({ ...prev, [name]: date }))
  }

  const handleSelectChange = (value: string, name: string) => {
    setProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault()

    try {
      if (id) {
        await apiClient.patch(`${PROJECTS_URL}/${id}`, project)
      } else {
        await apiClient.post(PROJECTS_URL, project)
      }
      setProject(initialProject)
      onClose()
      router.refresh()
      toast({
        title: "Project saved",
        description: "Project has been saved successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  return {
    project,
    users,
    fetchInitialData,
    handleInputChange,
    handleSelectDate,
    handleSelectChange,
    handleSubmit,
  }
}
