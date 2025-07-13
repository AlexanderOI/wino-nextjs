"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useQueryState } from "nuqs"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { useState } from "react"

interface Props {
  initialSearch?: string
}

export function SearchProjects({ initialSearch }: Props) {
  const [searchInput, setSearchInput] = useState(initialSearch || "")
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  })
  const [, setPage] = useQueryState("page", { defaultValue: "1", shallow: false })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    debouncedSetSearchParams({ search: value })
  }

  const debouncedSetSearchParams = useDebouncedCallback((params: { search: string }) => {
    setSearch(params.search)
    setPage("1")
  }, 300)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search projects..."
        className="pl-10"
        value={searchInput}
        onChange={handleSearch}
      />
    </div>
  )
}
