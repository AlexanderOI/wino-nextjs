"use client"
import { AsideContextProps } from "@/context/AsideResponsiveProvider"
import { useSession } from "next-auth/react"
import { ReactNode } from "react"

interface AsideProps extends AsideContextProps {
  children: ReactNode
}

export function Aside({
  children,
  asideResposive,
  setAsideResposive,
}: AsideProps) {
  const { data: session } = useSession()
  if (!session) return null

  const handleMouseEnter = () => {
    if (asideResposive.perm) return
    setAsideResposive((prev) => ({ ...prev, temp: !prev.temp }))
  }

  const handleMouseLeave = () => {
    if (asideResposive.perm) return
    setAsideResposive((prev) => ({ ...prev, temp: !prev.temp }))
  }

  return (
    <aside
      id="aside-resposive"
      className={`${
        asideResposive.temp ? "w-72" : "w-[74px]"
      } dark:bg-dark-800 border-r sticky h-full p-3 shadow-lg overflow-hidden transition-[width] duration-500 ease-in-out hover:w-72`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </aside>
  )
}
