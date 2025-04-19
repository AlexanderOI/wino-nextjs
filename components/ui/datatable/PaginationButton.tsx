"use client"

import { Table } from "@tanstack/react-table"

import {
  Pagination,
  PaginationButtonNext,
  PaginationButtonPrevious,
  PaginationContent,
  PaginationItem,
  PaginationButton,
} from "@/components/ui/pagination"

export function PaginationTableButton<T>({ table }: { table: Table<T> }) {
  let currentPage = table.getState().pagination.pageIndex + 1
  let totalPages = table.getPageCount()
  let totalRows = table.getFilteredRowModel().rows.length
  let rowsSelected = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="flex items-center justify-end space-x-2 py-4 px-5">
      <div className="flex-1 text-sm text-muted-foreground">
        {rowsSelected} of {totalRows} row(s) selected.
      </div>
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationButtonPrevious
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </PaginationButtonPrevious>
          </PaginationItem>
          {Array.from({ length: totalPages > 3 ? 3 : totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationButton
                isActive={currentPage === index + 1}
                onClick={() => table.setPageIndex(index)}
              >
                {index + 1}
              </PaginationButton>
            </PaginationItem>
          ))}
          {totalPages > 3 && (
            <>
              <PaginationItem>
                <PaginationButton>...</PaginationButton>
              </PaginationItem>
              <PaginationItem>
                <PaginationButton onClick={() => table.setPageIndex(totalPages - 1)}>
                  {totalPages}
                </PaginationButton>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationButtonNext
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </PaginationButtonNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
