"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { UserAuth } from "@/types/next-auth"
import { apiClient } from "@/utils/api-client"
import { Check, CheckCheck, Pencil, X } from "lucide-react"
import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface props {
  user: UserAuth | undefined
}

export function UserAvatar({ user }: props) {
  const { update, data: session } = useSession()
  const router = useRouter()

  const [avatar, setAvatar] = useState<string>(user?.avatar || "")
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file?.size && file.size > 1024 * 1024 * 5) {
      toast({
        title: "Maximum size is 5mb",
        description: "Please select a smaller file",
      })
      return
    }

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
        setFile(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    setAvatar(user?.avatar || "")
    setFile(null)
  }

  const handleSave = async () => {
    const formData = new FormData()
    formData.append("file", file as Blob)

    const response = await apiClient.post(`users/upload-avatar`, formData)

    if (response.status === 201) {
      setAvatar(response.data.url)
      setFile(null)

      await update({
        user: {
          ...user,
          avatar: response.data.url,
        },
        backendTokens: session?.backendTokens,
      })

      router.refresh()
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        max={1}
        multiple={false}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="relative">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Avatar className="w-20 h-20 cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={avatar} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>Change avatar</TooltipContent>
        </Tooltip>
        {file && (
          <div className="flex flex-col justify-center items-center h-full gap-2 absolute right-[-10px] top-0">
            <Button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 p-1"
              size="icon"
            >
              <X />
            </Button>

            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 rounded-full w-6 h-6 p-1"
              size="icon"
            >
              <Check />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
