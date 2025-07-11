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

export type ModalAction<T> = {
  type:
    | "edit"
    | "delete"
    | "accept-invite"
    | "leave-company"
    | "reject-invite"
    | "manage-users"
    | "manage-projects"
  data: T
}

export function CompanyData({ myCompanies, companiesIWorkFor }: CompanyDataProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { refreshUserToken } = useRefreshToken()
  const [modalAction, setModalAction] = useState<ModalAction<Company> | null>(null)

  const removeCompany = useCompanyStore((state) => state.removeCompany)
  const setCurrentCompany = useCompanyStore((state) => state.setCurrentCompany)

  const onAcceptInvite = async () => {
    await apiClient.post(`users/invited-user/accept/${modalAction?.data?._id}`)
    router.refresh()
    toast({
      title: "Invite accepted",
      description: "You have accepted the invite",
      duration: 2000,
    })
  }

  const onRejectInvite = async () => {
    await apiClient.post(`users/invited-user/reject/${modalAction?.data?._id}`)
    router.refresh()
    toast({
      title: "Invite rejected",
      description: "You have rejected the invite",
      duration: 2000,
    })
  }

  const onLeaveCompany = async () => {
    await apiClient.post(`users/invited-user/leave/${modalAction?.data?._id}`)
    router.refresh()
    toast({
      title: "Company left",
      description: "You have left the company",
      duration: 2000,
    })
  }

  const onDeleteCompany = async () => {
    if (session?.user.companyId === modalAction?.data?._id) {
      setCurrentCompany(myCompanies[0])
      await refreshUserToken(myCompanies[0])
    }
    removeCompany(modalAction?.data?._id ?? "")
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
                handleManageUsers={handleManageUsers}
                handleManageProjects={handleManageProjects}
                setModalAction={setModalAction}
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
                  handleManageUsers={handleManageUsers}
                  handleManageProjects={handleManageProjects}
                  setModalAction={setModalAction}
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
        isOpen={modalAction?.type === "edit"}
        onOpenChange={() => setModalAction(null)}
        content={<DialogCompany id={modalAction?.data?._id || ""} />}
      />

      <DialogDelete
        isOpen={modalAction?.type === "delete"}
        onOpenChange={() => setModalAction(null)}
        id={modalAction?.data?._id || ""}
        url="/company"
        title="Delete Company"
        description="Are you sure you want to delete this company?"
        onAction={onDeleteCompany}
      />

      <DialogConfirm
        isOpen={modalAction?.type === "accept-invite"}
        onOpenChange={() => setModalAction(null)}
        title="Accept Invite"
        description="Are you sure you want to accept this invite?"
        onConfirm={onAcceptInvite}
      />

      <DialogConfirm
        isOpen={modalAction?.type === "leave-company"}
        onOpenChange={() => setModalAction(null)}
        title="Leave Company"
        description="Are you sure you want to leave this company?"
        onConfirm={onLeaveCompany}
      />

      <DialogConfirm
        isOpen={modalAction?.type === "reject-invite"}
        onOpenChange={() => setModalAction(null)}
        title="Reject Invite"
        description="Are you sure you want to reject this invite?"
        onConfirm={onRejectInvite}
      />
    </>
  )
}
