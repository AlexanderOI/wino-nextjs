import { create } from "zustand"
import { Company } from "../interfaces/company.inteface"

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
