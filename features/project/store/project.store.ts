import { Project } from "@/features/project/interfaces/project.interface"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface ProjectStore {
  project: Project | null
  setProject: (project: Project | null) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      project: null,
      setProject: (project) => {
        set((state) => ({
          project: project,
        }))
      },
    }),
    {
      name: "project",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
