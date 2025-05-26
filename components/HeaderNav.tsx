"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { apiClient } from "@/utils/api-client"
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
import { USERS_URL } from "@/constants/routes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationHeader } from "@/features/notifications/notification-header"

interface Props {
  companiesData: Company[]
  session: Session | null
}

export function HeaderNav({ companiesData, session }: Props) {
  const { update } = useSession()
  const router = useRouter()

  const companies = useCompanyStore((state) => state.companies)
  const setCompanies = useCompanyStore((state) => state.setCompanies)
  const currentCompany = useCompanyStore((state) => state.currentCompany)
  const setCurrentCompany = useCompanyStore((state) => state.setCurrentCompany)

  useEffect(() => {
    companiesData.forEach((company) => {
      setCompanies(company)

      if (session?.user.companyId === company._id) {
        setCurrentCompany(company)
      }
    })
  }, [companiesData, setCompanies])

  const handleCompanyChange = async (value: string) => {
    const selectedCompany = companies[value]

    const response = await apiClient.get(
      `${USERS_URL}/change-current-company/${selectedCompany._id}`
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
          <Select onValueChange={handleCompanyChange} value={currentCompany?._id}>
            <SelectTrigger className="bg-purple-deep border-none">
              <SelectValue placeholder="Select Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Companies</SelectLabel>
                {Object.values(companies)
                  .filter((comp) => comp.isActive)
                  .map((comp) => (
                    <SelectItem key={comp._id} value={comp._id}>
                      {comp.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center pr-2">
          <NotificationHeader />
          <div className="relative ml-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-left outline-none">
                <div className="flex items-center gap-2 text-sm cursor-pointer hover:bg-purple-deep rounded-md py-1 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session?.user.avatar} />
                    <AvatarFallback>{session?.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span>{session?.user.name}</span>
                    <span>{session?.user.roleType}</span>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link className="w-full h-full hover:bg-purple-deep" href={"/profile"}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
