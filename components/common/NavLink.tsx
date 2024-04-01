"use client"
import { useAsideContext } from "@/context/AsideResponsiveProvider"
import Link from "next/link"

interface PropsNavLink {
  href: string
  Icon: React.ReactNode
  children: React.ReactNode
}

export const NavLink = ({ href, Icon, children }: PropsNavLink) => {
  const { asideResposive } = useAsideContext()

  return (
    <li className="py-2">
      {asideResposive.temp ? (
        <Link href={href} className="hover:text-blue-600 text-sm flex gap-x-3">
          {Icon}
          {children}
        </Link>
      ) : (
        <div className="text-sky-600 w-full p-2.5">{Icon}</div>
      )}
    </li>
  )
}
