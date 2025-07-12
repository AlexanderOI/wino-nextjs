import { redirect } from "next/navigation"
import { getSession } from "@/utils/get-session"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  AuthLayoutContent,
  AuthLayoutContentFooter,
} from "@/features/auth/components/auth-layout-content"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="flex-1 overflow-x-hidden">
        <main className="flex-1 p-5 pb-0 overflow-x-hidden overflow-y-auto h-screen">
          <div className="flex flex-col justify-center items-center h-screen-40">
            <Card className="w-full max-w-[30rem] p-5">
              <CardHeader className="flex justify-center items-center flex-col gap-y-2">
                <div className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl border-b-2 mb-5 pb-2 w-full">
                  <span className="text-purple-light">{"<"}</span>
                  WINO
                  <span className="text-purple-light">{"/>"}</span>
                </div>

                <AuthLayoutContent />
              </CardHeader>

              <CardContent>{children}</CardContent>

              <CardFooter className="flex justify-center items-center">
                <AuthLayoutContentFooter />
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
