import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Share2,
  Trash2,
  Shield,
  Users,
  FolderGit2,
  Pencil,
  Check,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { PermissionClient } from "@/features/permission/permission-client"
import { Company } from "@/features/company/interfaces/company.interface"
import { Project } from "@/features/project/interfaces/project.interface"
import { ModalAction } from "@/features/company/components/company-data"
import { UserAvatar } from "@/features/user/components/user-avatar"

interface CompanyWithProjects extends Company {
  projects: Project[]
}

interface CompanyCardProps {
  company: CompanyWithProjects
  isWorkFor?: boolean
  handleManageUsers: (company: Company) => void
  handleManageProjects: (company: Company) => void
  setModalAction: (action: ModalAction<Company>) => void
}

export function CompanyCard({
  company,
  isWorkFor = false,
  handleManageUsers,
  handleManageProjects,
  setModalAction,
}: CompanyCardProps) {
  return (
    <Card className="bg-[#1a1d27] border-[#2a2d37] relative">
      {isWorkFor && (
        <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Shield className="w-3 h-3" />
          {company.isInvited ? "Invited" : "Collaborator"}
        </div>
      )}
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex gap-4">
          <UserAvatar user={company.owner} className="h-12 w-12" />
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {company.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{company.usersCompany.length} employees</span>
              {isWorkFor && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full text-white text-xs bg-purple-600">
                  {company.roleType}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1d27] border-[#2a2d37]">
            <PermissionClient permissions={[PERMISSIONS.EDIT_COMPANY]}>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => setModalAction({ type: "edit", data: company })}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Company
              </DropdownMenuItem>
            </PermissionClient>

            <PermissionClient permissions={[PERMISSIONS.VIEW_USER]}>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => handleManageUsers(company)}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </DropdownMenuItem>
            </PermissionClient>

            <PermissionClient permissions={[PERMISSIONS.MANAGE_PROJECT]}>
              <DropdownMenuItem
                className="flex items-center"
                onClick={() => handleManageProjects(company)}
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Projects
              </DropdownMenuItem>
            </PermissionClient>

            {isWorkFor || (!company.isMain && <DropdownMenuSeparator />)}

            {!isWorkFor && !company.isMain && (
              <PermissionClient permissions={[PERMISSIONS.DELETE_COMPANY]}>
                <DropdownMenuItem
                  className="flex items-center text-red-400"
                  onClick={() => setModalAction({ type: "delete", data: company })}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Company
                </DropdownMenuItem>
              </PermissionClient>
            )}

            {isWorkFor && company.isInvited && !company.invitePending && (
              <PermissionClient permissions={[PERMISSIONS.DELETE_COMPANY]}>
                <DropdownMenuItem
                  className="flex items-center text-red-400"
                  onClick={() => setModalAction({ type: "leave-company", data: company })}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Leave Company
                </DropdownMenuItem>
              </PermissionClient>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Owner</p>
            <p className="text-sm font-medium">{company.owner.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Created at</p>
            <p className="text-sm font-medium">
              {format(company.createdAt, "dd/MM/yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {company.projects.length} projects
          </span>
        </div>

        {company.invitePending && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Invite Pending</span>
            <Button
              variant="purple"
              size="icon"
              onClick={() => setModalAction({ type: "accept-invite", data: company })}
            >
              <Check className="w-4 h-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => setModalAction({ type: "reject-invite", data: company })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
