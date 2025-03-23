import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function TypographyH1({ children, className, ...props }: TypographyProps) {
  return (
    <h1 className={cn("text-2xl font-bold mb-2", className)} {...props}>
      {children}
    </h1>
  )
}

export function TypographyH2({ children, className, ...props }: TypographyProps) {
  return (
    <h2 className={cn("text-xl font-bold", className)} {...props}>
      {children}
    </h2>
  )
}

export function TypographyH3({ children, className, ...props }: TypographyProps) {
  return (
    <h3 className={cn("text-lg font-bold", className)} {...props}>
      {children}
    </h3>
  )
}

export function TypographyH4({ children, className, ...props }: TypographyProps) {
  return (
    <h4 className={cn("text-base font-bold", className)} {...props}>
      {children}
    </h4>
  )
}

export function TypographyH5({ children, className, ...props }: TypographyProps) {
  return (
    <h5 className={cn("text-sm font-bold", className)} {...props}>
      {children}
    </h5>
  )
}

export function TypographyH6({ children, className, ...props }: TypographyProps) {
  return (
    <h6 className={cn("text-xs font-bold", className)} {...props}>
      {children}
    </h6>
  )
}

export function TypographyP({ children, className, ...props }: TypographyProps) {
  return (
    <p className={cn("text-base", className)} {...props}>
      {children}
    </p>
  )
}
