import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PROJECTS_URL } from "@/constants/routes"
import { CardHeaderPage } from "@/components/common/card-header-page"
import DataTableProjects from "@/features/manage-projects/components/data-table-projects"
import apiClientServer from "@/utils/api-client-server"
import { Projects } from "@/types/global"
import { DialogProject } from "@/features/manage-projects/components/dialog-project"

export default async function ManageProjectsPage() {
  const response = await apiClientServer.get<Projects[]>(PROJECTS_URL)
  const projects = response.data

  return (
    <div className="h-full">
      <CardHeaderPage>
        <h2>Manage Projects</h2>

        <DialogProject>
          <Button className="bg-purple-light text-white">Create Project</Button>
        </DialogProject>
      </CardHeaderPage>

      <Card className="dark:bg-dark-800 rounded h-5/6 overflow-y-auto">
        <CardContent className="h-full">
          <DataTableProjects projects={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
