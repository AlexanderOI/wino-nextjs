"use client"

import { use, useMemo } from "react"
import { ListIcon } from "lucide-react"

import { Task } from "@/features/tasks/interfaces/task.interface"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableSortList } from "@/components/data-table/data-table-sort-list"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTablePerPage } from "@/components/data-table/data-table-per-page"

import {
  ColumnTaskCount,
  getColumnTaskCount,
} from "@/features/tasks/action/column.action"
import { getTaskTableData } from "@/features/tasks/components/list/task-table-data"
import { getProjectFormTask, getTaskData } from "@/app/tasks/[projectId]/list/page"

interface Props {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTaskData>>,
      Awaited<ReturnType<typeof getColumnTaskCount>>,
      Awaited<ReturnType<typeof getProjectFormTask>>
    ]
  >
}

export const TaskTable = ({ promises }: Props) => {
  const [{ tasks, pageCount }, columnTaskCount, { project, formTask }] = use(promises)

  const columns = useMemo(
    () => getTaskTableData(columnTaskCount, project, formTask),
    [columnTaskCount, project, formTask]
  )

  const stats = useMemo(() => createStats(columnTaskCount), [columnTaskCount])

  const { table } = useDataTable({
    data: tasks,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.title}
              </CardTitle>
              <ListIcon className="w-4 h-4" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
          <DataTablePerPage table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  )
}

const createStats = (columnTaskCount: ColumnTaskCount[]) => {
  return [
    {
      title: "Total Tasks",
      value: columnTaskCount.reduce((acc, curr) => acc + curr.tasksCount, 0),
      color: "#5B21B6",
    },
    ...columnTaskCount.map((column) => ({
      title: column.name,
      value: column.tasksCount,
      color: column.color,
    })),
  ]
}
