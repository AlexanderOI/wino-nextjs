import { create } from "zustand"
import { Role } from "@/types/global"

interface RoleStore {
  name: string
  description: string
  permissions: number[]
  setRoleProperti: (name: string, value: string) => void
  setRole: (role: Role) => void
  setPermissions: (permissions: number[]) => void
}

export const useRoleStore = create<RoleStore>((set) => ({
  name: "",
  description: "",
  permissions: [],
  setRoleProperti: (name, value) => set({ [name]: value }),
  setRole: (role) => set(role),
  setPermissions: (permissions) => set({ permissions }),
}))
