"use client"

import { useRouter } from "next/navigation"

import { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { apiClient } from "@/utils/api-client"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

import { RoleCheckbox } from "@/features/user/components/role-check-box"
import { getAllRoles, getPartialUserById } from "@/features/user/actions/action"

export const DialogChangeRole = ({ id }: { id: string }) => {
  const router = useRouter()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [error, setError] = useState<string>("")

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  })
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getPartialUserById(id),
  })

  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.rolesId)
    }
  }, [user])

  const handleChangeRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId))
    } else {
      setSelectedRoles((prev) => [...prev, roleId])
    }
  }

  const handleSubmit = async () => {
    if (selectedRoles.length === 0) {
      setError("Please select at least one role")
      return
    }

    try {
      await apiClient.patch(`/users/${id}`, {
        rolesId: selectedRoles,
      })

      toast({
        title: "Roles changed successfully",
        description: "The role of the user has been changed successfully",
        duration: 1000,
      })

      router.refresh()
      cancelRef.current?.click()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data.message,
          duration: 1000,
        })
      }
    }
  }

  return (
    <DialogContent className="max-w-2xl" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>
          Change Role: {user?.name} - ( {user?.userName} )
        </DialogTitle>
      </DialogHeader>
      <div className="grid sm:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <RoleCheckbox
            key={role._id}
            role={role}
            isChecked={selectedRoles.includes(role._id)}
            onChange={() => handleChangeRole(role._id)}
            className="flex-row"
          />
        ))}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <DialogFooter>
        <DialogClose asChild>
          <Button ref={cancelRef} variant="outline">
            Cancel
          </Button>
        </DialogClose>

        <Button onClick={handleSubmit}>Change Role</Button>
      </DialogFooter>
    </DialogContent>
  )
}
