import { ButtonDelete } from "@/components/common/button/ButtonDelete"
import { ButtonEdit } from "@/components/common/button/ButtonEdit"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Company } from "@/features/company/interfaces/company.interface"
import { DialogCompany } from "./dialog-company"
import { getSession } from "@/utils/get-session"

interface Props {
  companies: Company[]
  title: string
  isOwner?: boolean
}

export async function CardCompany({ companies, title, isOwner }: Props) {
  const session = await getSession()

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex justify-between">
          <h2>{title}</h2>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {companies.map((company) => (
          <Card
            key={company._id}
            className={`${
              company._id == session?.user.companyId ? "dark:bg-purple-deep" : ""
            }`}
          >
            <CardContent className="flex justify-between">
              <div className="flex flex-col text-sm w-10/12">
                <p className="font-bold mb-2">{company?.name}</p>
                <p>Owner: {company?.owner?.name}</p>
              </div>

              {isOwner && (
                <div className="flex gap-2 flex-col">
                  <DialogCompany id={company._id}>
                    <ButtonEdit />
                  </DialogCompany>

                  {!company.isMain && (
                    <DialogDelete id={company._id} url={`/company`}>
                      <ButtonDelete />
                    </DialogDelete>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
