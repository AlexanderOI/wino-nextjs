export interface LayoutProp {
  children: React.ReactNode
}

export interface DialogProps {
  children?: React.ReactNode
  content?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}
