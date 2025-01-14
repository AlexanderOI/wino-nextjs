"use client"

import * as React from "react"
import { ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OptionProps {
  children: React.ReactNode
  value: string
}

export function Option({ children, value }: OptionProps) {
  return null
}

export interface MultiSelectProps {
  children: React.ReactNode
  values: string[]
  showValues?: boolean
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  name: string
  onSelect: (value: string, name: string) => void
  onRemove: (value: string) => void
}

export function MultiSelect({
  children,
  values,
  showValues = true,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  name,
  onSelect,
  onRemove,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState(0)

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  const options = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<OptionProps> =>
        React.isValidElement(child) && child.type === Option
    )
    .map((child) => ({
      value: child.props.value,
      label: child.props.children?.toString(),
    }))

  const filteredItems = options.filter(
    (item) =>
      item.label?.toLowerCase().includes(search.toLowerCase()) &&
      !values.includes(item.value)
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-10 h-auto hover:bg-transparent hover:opacity-80 hover:border-zinc-200"
        >
          <div className="flex flex-wrap gap-1 items-center overflow-hidden">
            {showValues && values.length > 0 ? (
              values.map((value) => {
                const option = options.find((opt) => opt.value === value)
                return option ? (
                  <div
                    key={value}
                    className="flex items-center bg-purple-deep text-secondary-foreground rounded-sm px-2 py-1 text-xs"
                  >
                    {option.label}
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove(value)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : null
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-dark-800"
        style={{ width: `${triggerWidth}px` }}
        align="start"
      >
        <div className="p-2">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 bg-transparent"
          />
          <ScrollArea className="h-[200px]">
            {filteredItems.length === 0 ? (
              <div className="py-2 px-4 text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  onClick={() => {
                    onSelect(item.value, item.label ?? "")
                    setSearch("")
                  }}
                  className="w-full justify-start hover:bg-purple-deep"
                >
                  {item.label}
                </Button>
              ))
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
