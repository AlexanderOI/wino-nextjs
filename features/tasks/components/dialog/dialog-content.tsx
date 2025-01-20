"use client"

import { DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogHeader } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleInput } from "@/components/common/form/toggle-input"
import { useTaskStore } from "../../store/task.store"

export default function DialogTaskContent() {
  const task = useTaskStore((state) => state.task)
  const handleInputChange = useTaskStore((state) => state.handleInputChange)

  if (!task) return null
  return (
    <div className="w-8/12 pr-4">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">
          Task: <ToggleInput value={task.name} onChange={handleInputChange} />
        </DialogTitle>
      </DialogHeader>

      <Label>
        Description
        <Textarea value={task.description} onChange={handleInputChange} />
      </Label>

      <DialogFooter className="mt-4">
        <Button type="submit">Save</Button>
      </DialogFooter>
    </div>
  )
}
