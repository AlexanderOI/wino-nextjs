import { ErrorMessage } from "@hookform/error-message"
import { useForm } from "react-hook-form"

interface FormInputs {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormFieldProps {
  label: string
  errorMessage: string
  name: keyof FormInputs
  type: string
}

export function FormField({ label, errorMessage, name, type }: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useForm()
  return (
    <div>
      <label className="block text-sm font-medium leading-6 ">
        {label}
        <input
          className="block w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type={type}
          {...register(name, {
            required: {
              value: true,
              message: `${errorMessage}`,
            },
          })}
        />
      </label>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <span className="text-red-500">{message}</span>
        )}
      />
    </div>
  )
}
