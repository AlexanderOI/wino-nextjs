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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Company } from "@/features/company/interfaces/company.interface"
import { format } from "date-fns"
import { Project } from "@/features/project/interfaces/project.interface"

interface CompanyWithProjects extends Company {
  projects: Project[]
}

interface CompanyCardProps {
  company: CompanyWithProjects
  isWorkFor?: boolean
  handleOpenCompanyDialog: (id: string) => void
  handleDelete: (id: string) => void
  handleManageUsers: (company: Company) => Promise<void>
  handleManageProjects: (company: Company) => Promise<void>
  handleAcceptInvite: (id: string) => void
  handleLeaveCompany: (id: string) => void
  handleRejectInvite: (id: string) => void
}

export function CompanyCard({
  company,
  isWorkFor = false,
  handleOpenCompanyDialog,
  handleDelete,
  handleManageUsers,
  handleManageProjects,
  handleAcceptInvite,
  handleLeaveCompany,
  handleRejectInvite,
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
          <Avatar className="h-12 w-12">
            {/* <AvatarImage src={""} /> */}
            <AvatarFallback>{company.name[0]}</AvatarFallback>
          </Avatar>
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
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => handleOpenCompanyDialog(company._id)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Company
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => handleManageUsers(company)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center"
              onClick={() => handleManageProjects(company)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Projects
            </DropdownMenuItem>
            {isWorkFor || (!company.isMain && <DropdownMenuSeparator />)}

            {!isWorkFor && !company.isMain && (
              <DropdownMenuItem
                className="flex items-center text-red-400"
                onClick={() => handleDelete(company._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Company
              </DropdownMenuItem>
            )}

            {isWorkFor && company.isInvited && !company.invitePending && (
              <DropdownMenuItem
                className="flex items-center text-red-400"
                onClick={() => handleLeaveCompany(company._id)}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Leave Company
              </DropdownMenuItem>
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
              onClick={() => handleAcceptInvite(company._id)}
            >
              <Check className="w-4 h-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRejectInvite(company._id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
