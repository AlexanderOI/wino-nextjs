"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Permissions } from "@/features/roles/interfaces/role.interface"
import { memo } from "react"

interface Props {
  perm: Permissions
  isChecked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PermissionCheckbox = memo(({ perm, isChecked, onChange }: Props) => (
  <Label key={perm._id} className="flex items-center gap-2">
    <Input
      type="checkbox"
      className="w-5 h-5"
      value={perm._id}
      checked={isChecked}
      onChange={onChange}
    />
    {perm.name}
  </Label>
))
