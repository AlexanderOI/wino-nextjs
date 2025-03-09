"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Building2, Briefcase } from "lucide-react"

import { apiClient } from "@/utils/api-client"
import { Company } from "@/features/company/interfaces/company.interface"
import { Project } from "@/features/project/interfaces/project.interface"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCompanyStore } from "../stores/company.store"

import { CompanyCard } from "@/features/company/components/company-card"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"

import { useRefreshToken } from "@/features/auth/hooks/use-refresh-token"
import { DialogCompany } from "@/features/company/components/dialog-company"
import { DialogConfirm } from "@/components/common/dialog/dialog-confirm"
import { toast } from "@/components/ui/use-toast"

interface CompanyWithProjects extends Company {
  projects: Project[]
}

interface CompanyDataProps {
  myCompanies: CompanyWithProjects[]
  companiesIWorkFor: CompanyWithProjects[]
}

export function CompanyData({ myCompanies, companiesIWorkFor }: CompanyDataProps) {
  const router = useRouter()

  const { data: session } = useSession()
  const { refreshUserToken } = useRefreshToken()

  const removeCompany = useCompanyStore((state) => state.removeCompany)
  const setCurrentCompany = useCompanyStore((state) => state.setCurrentCompany)

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>()
  const [editCompanyDialog, setEditCompanyDialog] = useState(false)
  const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false)
  const [acceptInviteDialog, setAcceptInviteDialog] = useState(false)
  const [leaveCompanyDialog, setLeaveCompanyDialog] = useState(false)
  const [rejectInviteDialog, setRejectInviteDialog] = useState(false)

  const handleOpenCompanyDialog = (id: string) => {
    setSelectedCompanyId(id)
    setEditCompanyDialog(true)
  }

  const handleDelete = (id: string) => {
    setSelectedCompanyId(id)
    setDeleteCompanyDialog(true)
  }

  const handleAcceptInvite = (id: string) => {
    setSelectedCompanyId(id)
    setAcceptInviteDialog(true)
  }

  const handleLeaveCompany = (id: string) => {
    setSelectedCompanyId(id)
    setLeaveCompanyDialog(true)
  }

  const handleRejectInvite = (id: string) => {
    setSelectedCompanyId(id)
    setRejectInviteDialog(true)
  }

  const onAcceptInvite = async () => {
    await apiClient.post(`users/invited-user/accept/${selectedCompanyId}`)
    router.refresh()
    toast({
      title: "Invite accepted",
      description: "You have accepted the invite",
      duration: 2000,
    })
  }

  const onRejectInvite = async () => {
    await apiClient.post(`users/invited-user/reject/${selectedCompanyId}`)
    router.refresh()
    toast({
      title: "Invite rejected",
      description: "You have rejected the invite",
      duration: 2000,
    })
  }

  const onLeaveCompany = async () => {
    await apiClient.post(`users/invited-user/leave/${selectedCompanyId}`)
    router.refresh()
    toast({
      title: "Company left",
      description: "You have left the company",
      duration: 2000,
    })
  }

  const onDeleteCompany = async () => {
    if (session?.user.companyId === selectedCompanyId) {
      setCurrentCompany(myCompanies[0])
      await refreshUserToken(myCompanies[0])
    }
    removeCompany(selectedCompanyId ?? "")
  }

  const handleManageUsers = async (company: Company) => {
    if (session?.user.companyId !== company._id) {
      setCurrentCompany(company)
      await refreshUserToken(company)
    }
    router.push(`/users`)
  }

  const handleManageProjects = async (company: Company) => {
    if (session?.user.companyId !== company._id) {
      setCurrentCompany(company)
      await refreshUserToken(company)
    }
    router.push(`/manage-projects`)
  }

  return (
    <>
      <Tabs defaultValue="my-companies" className="w-full">
        <TabsList className="flex justify-between gap-4 w-full bg-transparent p-0">
          <TabsTrigger
            value="my-companies"
            className="data-[state=active]:bg-purple-light hover:bg-purple-light rounded-sm w-1/2 border"
          >
            <Building2 className="w-4 h-4 mr-2" />
            My Companies
          </TabsTrigger>

          <TabsTrigger
            value="working-for"
            className="data-[state=active]:bg-purple-light hover:bg-purple-light rounded-sm w-1/2 border"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Companies I Work For
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-companies" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {myCompanies.map((company, index) => (
              <CompanyCard
                key={index}
                company={company}
                handleOpenCompanyDialog={handleOpenCompanyDialog}
                handleDelete={handleDelete}
                handleManageUsers={handleManageUsers}
                handleManageProjects={handleManageProjects}
                handleAcceptInvite={handleAcceptInvite}
                handleLeaveCompany={handleLeaveCompany}
                handleRejectInvite={handleRejectInvite}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="working-for" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {companiesIWorkFor.length > 0 ? (
              companiesIWorkFor.map((company, index) => (
                <CompanyCard
                  key={index}
                  company={company}
                  isWorkFor={true}
                  handleOpenCompanyDialog={handleOpenCompanyDialog}
                  handleDelete={handleDelete}
                  handleManageUsers={handleManageUsers}
                  handleManageProjects={handleManageProjects}
                  handleAcceptInvite={handleAcceptInvite}
                  handleLeaveCompany={handleLeaveCompany}
                  handleRejectInvite={handleRejectInvite}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 col-span-2">
                Companies I work for not found
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DialogData
        isOpen={editCompanyDialog}
        onOpenChange={setEditCompanyDialog}
        content={<DialogCompany id={selectedCompanyId} />}
      />

      <DialogDelete
        isOpen={deleteCompanyDialog}
        onOpenChange={setDeleteCompanyDialog}
        id={selectedCompanyId ?? ""}
        url="/company"
        title="Delete Company"
        description="Are you sure you want to delete this company?"
        onAction={onDeleteCompany}
      />

      <DialogConfirm
        isOpen={acceptInviteDialog}
        onOpenChange={setAcceptInviteDialog}
        title="Accept Invite"
        description="Are you sure you want to accept this invite?"
        onConfirm={onAcceptInvite}
      />

      <DialogConfirm
        isOpen={leaveCompanyDialog}
        onOpenChange={setLeaveCompanyDialog}
        title="Leave Company"
        description="Are you sure you want to leave this company?"
        onConfirm={onLeaveCompany}
      />

      <DialogConfirm
        isOpen={rejectInviteDialog}
        onOpenChange={setRejectInviteDialog}
        title="Reject Invite"
        description="Are you sure you want to reject this invite?"
        onConfirm={onRejectInvite}
      />
    </>
  )
}
