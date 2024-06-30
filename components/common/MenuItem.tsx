"use client"
import { useAsideContext } from "@/context/AsideResponsiveProvider"
import Link from "next/link"

interface PropsMenuItem {
  href: string
  Icon: React.ReactNode
  children: React.ReactNode
}

export const MenuItem = ({ href, Icon, children }: PropsMenuItem) => {
  const { asideResposive } = useAsideContext()

  return (
    <div className="py-1">
      {asideResposive.temp ? (
        <Link
          href={href}
          className="hover:text-blue-300 text-sm flex items-center gap-x-3 "
        >
          <div className="icon-small">{Icon}</div>
          {children}
        </Link>
      ) : (
        <div className="text-sky-600 w-full px-2.5 py-1">{Icon}</div>
      )}
    </div>
  )
}
