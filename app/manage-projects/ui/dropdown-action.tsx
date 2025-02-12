"use client"

import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import Link from "next/link"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { PermissionClient } from "@/features/permission/permission-client"
import { useProjectStore } from "@/features/project/store/project.store"
export function DropdownAction({ id }: { id: string }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const project = useProjectStore((state) => state.project)

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
