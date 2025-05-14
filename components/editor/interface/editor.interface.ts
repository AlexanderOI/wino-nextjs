import { Editor } from "@tiptap/react"
import { SuggestionProps as TiptapSuggestionProps } from "@tiptap/suggestion"

export interface SuggestionUsers {
  id: string
  name: string
  email: string
  avatar: string
}

export interface MentionListProps {
  items: SuggestionUsers[]
  command: (props: { id: string; name: string }) => void
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export type SuggestionProps = TiptapSuggestionProps

export interface ReactRendererProps {
  props: SuggestionProps
  editor: Editor
  element?: HTMLElement
  ref?: MentionListRef
  updateProps: (props: SuggestionProps) => void
  destroy: () => void
}
