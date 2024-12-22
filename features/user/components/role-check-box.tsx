"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Roles } from "@/types/global"
import { memo } from "react"

interface Props {
  role: Roles
  isChecked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const RoleCheckbox = memo(({ role, isChecked, onChange }: Props) => (
  <Label key={role._id} className="flex items-center gap-2">
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
