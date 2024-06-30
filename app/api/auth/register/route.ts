import { NextRequest, NextResponse } from "next/server"

interface FormInputs {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export async function POST(request: NextRequest) {
  const data: FormInputs = await request.json()
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify({
          name: data.userName,
          userName: data.userName,
          email: data.email,
          password: data.password,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
    if (res.ok) return NextResponse.json(true)

    const datas = await res.json()

    const parsedErrors = parseValidationErrors(datas.message)
    return NextResponse.json(parsedErrors, { status: 400 })
  } catch (error) {
    return NextResponse.json(false, { status: 400 })
  }
}

function parseValidationErrors(errors: string[]): Record<string, string[]> {
  const parsedErrors: Record<string, string[]> = {}

  errors.forEach((error) => {
    const [field, message] = error.split(":")
    const trimmedField = field.trim()
    const trimmedMessage = message.trim()

    if (!parsedErrors[trimmedField]) {
      parsedErrors[trimmedField] = [trimmedMessage]
    } else if (!parsedErrors[trimmedField].includes(trimmedMessage)) {
      parsedErrors[trimmedField].push(trimmedMessage)
    }
  })

  return parsedErrors
}
