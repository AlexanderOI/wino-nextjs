"use client"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { AxiosError } from "axios"

import { apiClient } from "@/utils/api-client"

import { Role } from "@/features/roles/interfaces/role.interface"
import { User } from "@/features/user/interfaces/user.interface"
import { ROLES_URL } from "@/constants/routes"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RoleCheckbox } from "@/features/user/components/role-check-box"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  children?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogInviteUser({
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const router = useRouter()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const [search, setSearch] = useState("")
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [roleType, setRoleType] = useState<string>("")

  const handleClickSearch = async () => {
    if (search.length < 2) return

    try {
      setLoading(true)
      const response = await apiClient.get<Partial<User>>(`/users/invited-user/${search}`)
      setUser(response.data)
      setError(null)
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      } else {
        setError("An unexpected error occurred")
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await apiClient.get<Role[]>(`${ROLES_URL}`)
      console.log(response.data)
      setRoles(response.data)
    }
    if (isOpen) fetchRoles()
  }, [isOpen])

  const handleCheckboxChange = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles((prev) => prev.filter((id) => id !== roleId))
    } else {
      setSelectedRoles((prev) => [...prev, roleId])
    }
  }

  const handleInvite = async () => {
    try {
      await apiClient.post(`users/invited-user/${user?._id}`, {
        rolesId: selectedRoles,
        roleType: roleType,
      })

      toast({
        title: "User Invited",
        description: "The user has been invited successfully",
        variant: "default",
      })

      setIsOpen(false)
      router.refresh()
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && (
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-full">
                Search user
                <Input
                  type="text"
                  name="name"
                  placeholder="Search user per username"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Label>
              <Button
                className="mt-5"
                variant="purple"
                disabled={loading}
                onClick={handleClickSearch}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>

          {user && (
            <Card className="flex flex-col gap-4 p-4">
              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    variant="purple"
                    disabled={selectedRoles.length === 0}
                    onClick={handleInvite}
                  >
                    Invite
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <Label>
                    Position in the company
                    <Input
                      type="text"
                      name="roleType"
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                    />
                  </Label>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Select roles</p>
                  {roles.map((role) => (
                    <RoleCheckbox
                      key={role._id}
                      role={role}
                      isChecked={selectedRoles.includes(role._id)}
                      onChange={(e) => handleCheckboxChange(e.target.value)}
                      className="flex-row"
                    />
                  ))}
                </div>
              </div>
            </Card>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}
