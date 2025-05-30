"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { cn } from "@/lib/utils"

import {
  MentionListProps,
  MentionListRef,
  SuggestionUsers,
} from "@/components/editor/interface/editor.interface"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const items = props.items

  const selectItem = (index: number) => {
    const item = items[index]

    if (item) {
      props.command({ id: item.id, name: item.name })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }

      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }

      if (event.key === "Enter") {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <Card className="z-50 pointer-events-auto">
      <ScrollArea className="flex flex-col gap-2 p-2 h-48 z-50">
        {items.length ? (
          items.map((item: SuggestionUsers, index: number) => (
            <Button
              className={cn(
                "flex justify-start gap-2 p-1 w-full",
                index === selectedIndex && "bg-gray-700 rounded"
              )}
              key={index + item.id}
              onClick={() => {
                selectItem(index)
              }}
              variant="ghost"
              asChild
            >
              <div className="flex items-start gap-2 cursor-pointer">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={item.avatar || ""} />
                  <AvatarFallback>{item.name[0] || "N"}</AvatarFallback>
                </Avatar>
                {item.name}
              </div>
            </Button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </ScrollArea>
    </Card>
  )
})

MentionList.displayName = "MentionList"

export default MentionList
