"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { memo } from "react"
import { Role } from "@/features/roles/interfaces/role.interface"
import { cn } from "@/lib/utils"

interface Props {
  role: Role
  className?: string
  isChecked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const RoleCheckbox = memo(({ role, isChecked, onChange, className }: Props) => (
  <Label key={role._id} className={cn("flex items-center gap-2", className)}>
    <Input
      type="checkbox"
      className="w-5 h-5"
      value={role._id}
      checked={isChecked}
      onChange={onChange}
    />
    {role.name}
  </Label>
))
