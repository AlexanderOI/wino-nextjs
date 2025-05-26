"use client"

import { useRouter } from "next/navigation"

import { use, useMemo, useState } from "react"
import { ListIcon } from "lucide-react"

import { Task } from "@/features/tasks/interfaces/task.interface"

import { toast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { DialogConfirm } from "@/components/common/dialog/dialog-confirm"
import { DataTableSortList } from "@/components/data-table/data-table-sort-list"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTablePerPage } from "@/components/data-table/data-table-per-page"
import { DataTable } from "@/components/data-table/data-table"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTableRowAction, DataTableRowActionMany } from "@/types/data-table"

import { TasksTableActionBar } from "@/features/tasks/components/list/task-action-bar"
import { getTaskTableData } from "@/features/tasks/components/list/task-table-data"
import { TaskDialog } from "@/features/tasks/components/dialog/task-dialog"
import { usePrefetchTask } from "@/features/tasks/hooks/use-prefetch-task"

import {
  ColumnTaskCount,
  getColumnTaskCount,
} from "@/features/tasks/action/column.action"
import {
  deleteTask,
  getProjectFormTask,
  getTaskData,
} from "@/features/tasks/action/task.action"

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
  const router = useRouter()

  const [{ tasks, pageCount }, columnTaskCount, { project, formTask }] = use(promises)
  const [rowAction, setRowAction] = useState<DataTableRowAction<Task> | null>(null)
  const [rowActionMany, setRowActionMany] = useState<DataTableRowActionMany<Task> | null>(
    null
  )

  const { handleMouseEnter } = usePrefetchTask(project._id)

  const columns = useMemo(
    () =>
      getTaskTableData(
        columnTaskCount,
        project,
        formTask,
        setRowAction,
        handleMouseEnter
      ),
    [columnTaskCount, project, formTask]
  )

  const stats = useMemo(() => createStats(columnTaskCount), [columnTaskCount])

  const { table } = useDataTable({
    data: tasks,
    columns,
    pageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
    },
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true,
  })

  const handleDeleteMany = async () => {
    await Promise.all(
      rowActionMany?.rows.map(async (row) => {
        try {
          await deleteTask(row._id)
        } catch (error) {
          toast({
            title: "Error deleting task",
            description: `Error deleting task: ${row.name}`,
            variant: "destructive",
          })
        }
      }) || []
    )

    toast({
      title: "Tasks deleted",
      description: `Tasks deleted: ${rowActionMany?.rows.length}`,
    })

    router.refresh()
  }

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

      <DataTable
        table={table}
        actionBar={
          <TasksTableActionBar table={table} setRowActionMany={setRowActionMany} />
        }
      >
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="end" />
          <DataTablePerPage table={table} />
        </DataTableToolbar>
      </DataTable>

      <DialogData
        content={<TaskDialog id={rowAction?.row._id || ""} />}
        isOpen={rowAction?.variant === "view"}
        onOpenChange={() => {
          setRowAction(null)
          router.refresh()
        }}
      />

      <DialogDelete
        id={rowAction?.row._id || ""}
        url="/tasks"
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        isOpen={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        onAction={() => {
          setRowAction(null)
        }}
      />

      <DialogConfirm
        title="Alert delete tasks"
        description="Are you sure you want to delete these tasks?"
        isOpen={rowActionMany?.variant === "delete-many"}
        onOpenChange={() => setRowActionMany(null)}
        onConfirm={handleDeleteMany}
      />
    </>
  )
}

const createStats = (columnTaskCount: ColumnTaskCount[]) => {
  "use client"
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
