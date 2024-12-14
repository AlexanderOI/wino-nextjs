import { CardHeader } from "@/components/ui/card"

interface Props {
  className?: string
  children: React.ReactNode
}

export function CardHeaderPage({ className, children }: Props) {
  return (
    <CardHeader
      className={`justify-between items-center mb-5 bg-transparent border-none ${className}`}
    >
      {children}
    </CardHeader>
  )
}
