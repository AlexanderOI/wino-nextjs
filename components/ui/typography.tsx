export function TypographyH1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold">{children}</h1>
}

export function TypographyH2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>
}

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>
}

export function TypographyH4({ children }: { children: React.ReactNode }) {
  return <h4 className="text-base font-bold">{children}</h4>
}

export function TypographyH5({ children }: { children: React.ReactNode }) {
  return <h5 className="text-sm font-bold">{children}</h5>
}

export function TypographyH6({ children }: { children: React.ReactNode }) {
  return <h6 className="text-xs font-bold">{children}</h6>
}

export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={`text-base ${className}`}>{children}</p>
}
