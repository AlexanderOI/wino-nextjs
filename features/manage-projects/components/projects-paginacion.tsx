"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useQueryState } from "nuqs"

interface PaginationProps {
  total: number
  currentPage: number
  totalPages: number
  limit: number
}

export function ProjectPagination({
  total,
  currentPage,
  totalPages,
  limit,
}: PaginationProps) {
  const [, setPage] = useQueryState("page", { defaultValue: "1", shallow: false })

  const goToPrevious = () => {
    if (currentPage > 1) {
      setPage(String(currentPage - 1))
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setPage(String(currentPage + 1))
    }
  }

  const goToPage = (page: number) => {
    setPage(String(page))
  }

  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-400">
        Mostrando {startItem}-{endItem} de {total} proyectos
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
              className={
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              }
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
