"use client"
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
} from "react"

export interface asideResposiveType {
  perm: boolean
  temp: boolean
}

export interface AsideContextProps {
  asideResposive: asideResposiveType
  setAsideResposive: React.Dispatch<SetStateAction<asideResposiveType>>
}

interface ProviderProps {
  children: ReactNode
}

const AsideContext = createContext<AsideContextProps | undefined>(undefined)

export const AsideProvider = ({ children }: ProviderProps) => {
  const [asideResposive, setAsideResposive] = useState({
    perm: true,
    temp: true,
  })

  return (
    <AsideContext.Provider value={{ asideResposive, setAsideResposive }}>
      {children}
    </AsideContext.Provider>
  )
}

export const useAsideContext = (): AsideContextProps => {
  const context = useContext(AsideContext)
  if (!context) {
    throw new Error("useAsideContext must be used within a AsideProvider")
  }
  return context
}
