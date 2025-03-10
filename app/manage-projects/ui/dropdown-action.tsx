"use client"
import Link from "next/link"

import { useState } from "react"
import { MoreVertical } from "lucide-react"

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"

import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { PermissionClient } from "@/features/permission/permission-client"

export function DropdownAction({ id }: { id: string }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <PermissionClient permissions={[PERMISSIONS.EDIT_PROJECT]}>
            <DropdownMenuItem>
              <Link href={`manage-projects/edit/${id}`}>Edit Project</Link>
            </DropdownMenuItem>
          </PermissionClient>

          <PermissionClient permissions={[PERMISSIONS.DELETE_PROJECT]}>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Project
            </DropdownMenuItem>
          </PermissionClient>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDelete
        id={id}
        url="/projects"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  )
}
