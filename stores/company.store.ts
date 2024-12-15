import { create } from "zustand"

export interface UserCompany {
  _id: string
  name: string
}

export interface Company {
  _id: string
  name: string
  address: string
  owner: UserCompany
  users: string[]
  roles: string[]
  isMain: boolean
}

interface CompanyStore {
  companies: { [key: string]: Company }
  currentCompany: Company | null
  setCompanies: (companies: Company) => void
  setCurrentCompany: (company: Company) => void
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  companies: {},
  currentCompany: null,
  setCompanies: (company) => {
    set((state) => ({
      companies: {
        ...state.companies,
        [company._id]: company,
      },
    }))
  },
  setCurrentCompany: (company) => {
    set((state) => ({
      currentCompany: company,
    }))
  },
}))
