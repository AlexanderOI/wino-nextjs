"use client"

import tippy, { Instance } from "tippy.js"
import { ReactRenderer } from "@tiptap/react"
import { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion"

import type { SuggestionUsers } from "@/components/editor/interface/editor.interface"
import MentionList from "@/components/editor/mentions"

const renderSuggestion = () => {
  let component: any
  let popup: Instance<any>

  return {
    onStart: (props: SuggestionProps) => {
      component = new ReactRenderer(MentionList, {
        props,
        editor: props.editor,
      })

      if (!props.clientRect) return

      popup = tippy(document.body, {
        getReferenceClientRect: () => props.clientRect?.() || new DOMRect(),
        appendTo: () => document.querySelector("[role='dialog']") || document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        onShow(instance) {
          const content = instance.popper.querySelector(".react-renderer")
          if (content) {
            Object.assign((content as HTMLElement).style, {
              maxHeight: "200px",
              overflowY: "auto",
              pointerEvents: "auto",
            })
          }
        },
      })
    },

    onUpdate(props: SuggestionProps) {
      component.updateProps(props)

      if (!props.clientRect) return

      popup.setProps({
        getReferenceClientRect: () => props.clientRect?.() || new DOMRect(),
      })
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      if (props.event.key === "Escape") {
        popup.hide()
        return true
      }

      return component.ref?.onKeyDown(props)
    },

    onExit() {
      popup.destroy()
      component.destroy()
    },
  }
}

export function SuggestionUsers(suggestions: SuggestionUsers[]) {
  const items = async ({ query }: { query: string }) => {
    return suggestions.filter((item) =>
      item.name.toLowerCase().startsWith(query.toLowerCase())
    )
  }

  return {
    items: items,
    render: renderSuggestion,
  }
}
