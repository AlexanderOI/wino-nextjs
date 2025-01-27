"use client"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MultiSelect, Option } from "@/components/ui/multi-select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet"
import { X } from "lucide-react"
import { useTeamProjectSheet } from "../hooks/use-team-project-sheet"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SheetTeamProject({
  id,
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const {
    users,
    search,
    usersProjectTeam,
    handleSelect,
    handleRemove,
    handleSave,
    setSearch,
    fetchInitialData,
  } = useTeamProjectSheet(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}

      {isOpen && (
        <SheetContent aria-describedby={undefined} className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Edit team</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-4 flex-1">
            <div className="space-y-2">
              <Label>Users</Label>
              <MultiSelect
                values={usersProjectTeam}
                name="usersProjectTeam"
                showValues={false}
                onSelect={handleSelect}
                onRemove={handleRemove}
                placeholder="Select users"
                searchPlaceholder="Search users"
                emptyMessage="No users available"
              >
                {users.map((user) => (
                  <Option key={user._id} value={user._id}>
                    {user.name}
                  </Option>
                ))}
              </MultiSelect>
            </div>

            <div className="space-y-2">
              <Separator className="mb-5" />
              <Label className="text-lg font-bold">Users selected</Label>

              <Input
                placeholder="Search user"
                className="mb-2"
                onChange={(e) => setSearch(e.target.value)}
              />

              <ScrollArea className="border rounded-md p-2 h-[420px]">
                {users
                  .filter(
                    (user) =>
                      user.name?.toLowerCase().includes(search.toLowerCase()) &&
                      usersProjectTeam?.includes(user._id)
                  )
                  .map((user) => (
                    <div
                      className="flex items-center justify-between gap-2 mb-2"
                      key={user._id}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user.avatar || ""} />
                          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p>{user.name}</p>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemove(user._id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </ScrollArea>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleSave}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      )}
    </Sheet>
  )
}
