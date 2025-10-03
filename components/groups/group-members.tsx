import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type Member = {
  id: string
  role: string
  joined_at: string
  is_active: boolean
  profiles: {
    full_name: string
    email: string
    profile_picture_url: string | null
  } | null
}

export function GroupMembers({ members }: { members: Member[] }) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 rounded-lg border p-3">
            <Avatar>
              <AvatarImage src={member.profiles?.profile_picture_url || undefined} />
              <AvatarFallback>{member.profiles?.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{member.profiles?.full_name || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">{member.profiles?.email}</p>
            </div>
            <Badge variant={member.role === "admin" ? "default" : "secondary"} className="capitalize">
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
