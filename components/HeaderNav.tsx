"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import apiClient from "@/utils/api-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { SidebarTrigger } from "./ui/sidebar"
import { useCompanyStore } from "@/features/company/stores/company.store"
import { refreshToken } from "@/features/auth/actions/auth-actions"
import { Company } from "@/features/company/interfaces/company.interface"
import { Session } from "next-auth"

interface Props {
  companiesData: Company[]
  session: Session | null
}

export function HeaderNav({ companiesData, session }: Props) {
  const { update } = useSession()
  const router = useRouter()

  const companies = useCompanyStore((state) => state.companies)
  const setCompanies = useCompanyStore((state) => state.setCompanies)

  useEffect(() => {
    companiesData.forEach((company) => {
      setCompanies(company)
    })
  }, [companiesData, setCompanies])

  const handleCompanyChange = async (value: string) => {
    const selectedCompany = companies[value]

    const response = await apiClient.get(
      `user/change-current-company/${selectedCompany._id}`
    )

    if (response.status === 200) {
      const newAccessToken = await refreshToken()

      await update({
        user: {
          ...session?.user,
          companyId: selectedCompany._id,
          companyName: selectedCompany.name,
          companyAddress: selectedCompany.address,
        },
        backendTokens: newAccessToken,
      })

      router.refresh()
    }
  }

  return (
    <header className="h-16 p-4 dark:bg-dark-800">
      <nav className="flex justify-between items-center w-full h-full">
        <div className="flex items-center justify-center h-full gap-5">
          <SidebarTrigger />
          <Select onValueChange={handleCompanyChange} value={session?.user.companyId}>
            <SelectTrigger className="bg-purple-deep border-none">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Companies</SelectLabel>
                {Object.values(companies).map((comp) => (
                  <SelectItem key={comp._id} value={comp._id}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center pr-2">
          <div className="relative ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-left">
                <div className="flex items-center text-sm cursor-pointer">
                  <img className="h-8 mx-2 w-8 rounded-full" src="/avatar.png" alt="" />
                  <div className="flex flex-col">
                    <span>{session?.user.name}</span>
                    <span>{session?.user.userName}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/profile"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
