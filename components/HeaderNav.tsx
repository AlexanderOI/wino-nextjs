"use client"
import { signOut, useSession } from "next-auth/react"
import { Profile } from "./common/Profile"
import { SelectLang } from "./common/SelectLang"
import { useAsideContext } from "@/context/AsideResponsiveProvider"
import { Menu } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function HeaderNav() {
  const { asideResposive, setAsideResposive } = useAsideContext()

  const handleClickAsideResposive = () => {
    setAsideResposive((prev) => ({ temp: !prev.temp, perm: !prev.perm }))
  }

  const { data: session } = useSession()
  if (!session) return null

  return (
    <header className=" h-20 p-4 dark:bg-dark-800">
      <nav className="flex justify-between items-center w-full h-full">
        <div className="flex items-center justify-center h-full gap-5">
          <button
            className="h-8 w-8 rounded-full p-1"
            onClick={handleClickAsideResposive}
          >
            <Menu />
          </button>
          <SelectLang />
        </div>
        <div className="flex items-center pr-2">
          <div className="relative ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-left">
                <div className="flex items-center text-sm cursor-pointer">
                  <img
                    className="h-8 mx-2 w-8 rounded-full"
                    src="/avatar.png"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <span>Su Endren</span>
                    <span>Role</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Your Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
