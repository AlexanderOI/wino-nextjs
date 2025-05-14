"use client"
import Mention from "@tiptap/extension-mention"

import { cn } from "@/lib/utils"

import { SuggestionUsers } from "@/components/editor/suggestion"
import type { SuggestionUsers as SuggestionUsersType } from "@/components/editor/interface/editor.interface"
import { User } from "@/features/user/interfaces/user.interface"

export const CustomMention = (users: User[]) => {
  return Mention.configure({
    HTMLAttributes: {
      class: cn("bg-gray-800/90 rounded shadow text-sm p-[0.2rem] px-[0.3rem]"),
    },
    renderLabel({ options, node }) {
      return `@${node.attrs.label || node.attrs.id}`
    },
    suggestion: {
      ...SuggestionUsers(
        users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }))
      ),
      command: ({ editor, range, props }) => {
        const userProps = props as unknown as SuggestionUsersType

        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent([
            {
              type: "mention",
              attrs: {
                id: userProps.id,
                label: userProps.name,
              },
            },
            {
              type: "text",
              text: " ",
            },
          ])
          .run()
      },
    },
  })
}
