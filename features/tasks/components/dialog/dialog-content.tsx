"use client"

import { DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogHeader } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleInput } from "@/components/common/form/toggle-input"
import { useTaskStore } from "../../store/task.store"
import apiClient from "@/utils/api-client"
import { useToast } from "@/components/ui/use-toast"

export default function DialogTaskContent() {
  const toast = useToast()
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)

  if (!task) return null

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sendChanges?: boolean
  ) => {
    const { name, value } = event.target
    updateTaskField(name, value)

    if (sendChanges) {
      const response = await apiClient.patch(`/tasks/${task._id}`, {
        [name]: value,
      })

      if (response.status === 200) {
        toast.toast({
          title: "Task updated",
          description: "Task updated successfully",
        })
      } else {
        toast.toast({
          title: "Failed to update task",
          description: "Failed to update task",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="w-7/12 pr-4">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">
          Task:
          <ToggleInput
            name="name"
            value={task.name}
            onChange={handleInputChange}
            onBlur={(event) => handleInputChange(event, true)}
          />
        </DialogTitle>
      </DialogHeader>

      <Label>
        Description
        <Textarea
          name="description"
          value={task.description}
          onChange={handleInputChange}
          onBlur={(event) => handleInputChange(event, true)}
        />
      </Label>
    </div>
  )
}
