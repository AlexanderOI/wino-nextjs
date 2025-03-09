import { Building2, Users, Plus, FolderGit2, FolderGit } from "lucide-react"

import { getSession } from "@/utils/get-session"
import { apiClientServer } from "@/utils/api-client-server"
import { Company } from "@/features/company/interfaces/company.interface"
import { Project } from "@/features/project/interfaces/project.interface"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CompanyData } from "@/features/company/components/company-data"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { DialogCompany } from "@/features/company/components/dialog-company"

export default async function CompanyPage() {
  const session = await getSession()
  const response = await apiClientServer.get<Company[]>("/company")

  const companies = response.data

  const projects = await Promise.all(
    companies.map((company) =>
      apiClientServer.get<Project[]>(`/projects/company/${company._id}`)
    )
  )

  const companiesWithProjects = companies.map((company, index) => ({
    ...company,
    projects: projects[index].data.filter((project) => project.companyId === company._id),
  }))

  const myCompanies = companiesWithProjects.filter(
    (company) => company.owner._id === session?.user._id
  )

  const companiesIWorkFor = companiesWithProjects.filter(
    (company) => company.owner._id !== session?.user._id
  )

  const stats = [
    {
      title: "Total Companies",
      value: companies.length,
      icon: Building2,
    },
    {
      title: "Total Employees",
      value: myCompanies.reduce((acc, company) => acc + company.usersCompany.length, 0),
      icon: Users,
    },
    {
      title: "Projects in My Companies",
      value: myCompanies.reduce((acc, company) => acc + company.projects.length, 0),
      icon: FolderGit2,
    },
    {
      title: "Projects in Companies I Work For",
      value: companiesIWorkFor.reduce((acc, company) => acc + company.projects.length, 0),
      icon: FolderGit,
    },
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="w-6 h-6 text-purple-400" />
              Company Management
            </h1>
            <p className="text-gray-400 mt-1">Manage your companies and collaborations</p>
          </div>

          <DialogData content={<DialogCompany />}>
            <Button variant="purple">
              <Plus className="w-4 h-4 mr-2" />
              Create Company
            </Button>
          </DialogData>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#1a1d27] border-[#2a2d37]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CompanyData myCompanies={myCompanies} companiesIWorkFor={companiesIWorkFor} />
      </div>
    </div>
  )
}
