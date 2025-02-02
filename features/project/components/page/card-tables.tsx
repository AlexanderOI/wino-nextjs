import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { format, isValid } from "date-fns"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { Project } from "@/features/project/interfaces/project.interface"
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/features/user/interfaces/user.interface"
import { TableAction } from "@/components/common/table-action"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { DataTable } from "@/components/ui/datatable/DataTable"
import MembersTable from "./tables/members-table"
import TasksTable from "./tables/taks-table"

interface Props {
  tasks: Task[]
  project: Project
}

export function CardTables({ tasks, project }: Props) {
  return (
    <Card>
      <Tabs defaultValue="team">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Recent Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="p-6 pt-1 mt-0">
          <MembersTable tasks={tasks} members={project?.members || []} />
        </TabsContent>

        <TabsContent value="tasks" className="p-6 pt-1 mt-0">
          <TasksTable tasks={tasks} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
