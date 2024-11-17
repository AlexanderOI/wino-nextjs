"use client"
import { signOut, useSession } from "next-auth/react"
import { SelectLang } from "./common/SelectLang"
import { useAsideContext } from "@/context/AsideResponsiveProvider"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Link from "next/link"
import { SidebarTrigger } from "./ui/sidebar"

export function HeaderNav() {
  const handleClickAsideResposive = () => {
    console.log("hola")
  }

  const { data: session } = useSession()
  if (!session) return null

  return (
    <header className="h-16 p-4 dark:bg-dark-800">
      <nav className="flex justify-between items-center w-full h-full">
        <div className="flex items-center justify-center h-full gap-5">
          <SidebarTrigger />
          {/* <SelectLang /> */}
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
                    <span>{session.user.name}</span>
                    <span>{session.user.userName}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/profile"}>Profile</Link>
                </DropdownMenuItem>
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
