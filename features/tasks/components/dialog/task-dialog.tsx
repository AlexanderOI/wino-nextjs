"use client"

import { useEffect, useState } from "react"

import { canPermission } from "@/features/permission/utils/can-permission"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

import { DialogContent } from "@/components/ui/dialog"

import { SkeletonTaskDialog } from "@/features/tasks/components/skeleton/skeleton-task-dialog"
import { DialogTaskContent } from "@/features/tasks/components/dialog/dialog-content"
import { DialogTaskDetails } from "@/features/tasks/components/dialog/dialog-details"

import { useTaskDialog } from "@/features/tasks/hooks/use-task-dialog"

interface Props {
  children?: React.ReactNode
  id: string
}

export function TaskDialog({ id }: Props) {
  const { taskQuery, columnsQuery, sendChanges } = useTaskDialog(id)

  const [canEditTask, setCanEditTask] = useState(false)

  useEffect(() => {
    canPermission([PERMISSIONS.EDIT_TASK]).then(setCanEditTask)
  }, [])

  return (
    <DialogContent
      className="max-w-[1400px] min-h-[400px] max-h-[90%] flex overflow-y-hidden"
      aria-describedby={undefined}
    >
      {taskQuery.isLoading || columnsQuery.isLoading ? (
        <SkeletonTaskDialog />
      ) : (
        <>
          <DialogTaskContent
            sendChanges={sendChanges}
            hasPermissionEdit={canEditTask}
            users={taskQuery.data?.project?.members ?? []}
          />
          <DialogTaskDetails
            sendChanges={sendChanges}
            users={taskQuery.data?.project?.members ?? []}
            columns={columnsQuery.data ?? []}
            hasPermissionEdit={canEditTask}
          />
        </>
      )}
    </DialogContent>
  )
}
