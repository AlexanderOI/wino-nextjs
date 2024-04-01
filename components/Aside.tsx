"use client"
import { useAsideContext } from "@/context/AsideResponsiveProvider"
import { Aside } from "./common/Aside"
import { MenuSection } from "./common/MenuSection"
import { NavLink } from "./common/NavLink"
import { Badge } from "lucide-react"

export function AsideResposive() {
  const { asideResposive, setAsideResposive } = useAsideContext()

  return (
    <Aside
      asideResposive={asideResposive}
      setAsideResposive={setAsideResposive}
    >
      {/* <img src="/logo.png" alt="Logo" className="flex w-full max-w-56 mb-3" /> */}
      <div
        className={`flex justify-center items-center border-b-2 mb-5 p-2
        ${asideResposive.temp ? "text-5xl" : " text-sm"}`}
      >
        <span className=" text-sky-700">{"<"}</span>
        WINO
        <span className=" text-sky-700">{"/>"}</span>
      </div>
      <div
        className={`${
          asideResposive.temp ? "overflow-y-auto" : "overflow-hidden"
        } max-h-[calc(100vh-106px)] pr-3`}
      >
        <MenuSection title="Personal">
          <NavLink href="/" Icon={<Badge />}>
            Proyects
          </NavLink>
          <NavLink href="/" Icon={<Badge />}>
            Tasks
          </NavLink>
        </MenuSection>

        <MenuSection title="Team">
          <NavLink href="/" Icon={<Badge />}>
            Proyects
          </NavLink>
          <NavLink href="/" Icon={<Badge />}>
            Tasks
          </NavLink>
        </MenuSection>

        <MenuSection title="Company">
          <NavLink href="/" Icon={<Badge />}>
            Proyects
          </NavLink>
          <NavLink href="/" Icon={<Badge />}>
            Tasks
          </NavLink>
        </MenuSection>
      </div>
    </Aside>
  )
}
