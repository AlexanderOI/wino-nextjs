import { UserAuth } from "@/types/next-auth"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@/features/user/interfaces/user.interface"
import { CompanyOwner } from "@/features/company/interfaces/company.interface"

interface UserAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  user?: User | UserAuth | CompanyOwner
  classNameFallback?: string
}

export function UserAvatar({
  user,
  className,
  classNameFallback,
  ...props
}: UserAvatarProps) {
  return (
    <Avatar className={cn("w-7 h-7", className)} {...props}>
      <AvatarImage src={user?.avatar || ""} />
      <AvatarFallback
        className={cn("border border-gray-600", classNameFallback)}
        style={{ backgroundColor: user?.avatarColor || "#52555E" }}
      >
        {user?.name.charAt(0) || ""}
      </AvatarFallback>
    </Avatar>
  )
}
