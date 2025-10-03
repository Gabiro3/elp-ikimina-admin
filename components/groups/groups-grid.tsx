import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Wallet, Lock, Globe } from "lucide-react"

type Group = {
  id: string
  name: string
  description: string | null
  group_type: string
  target_amount: number
  contribution_frequency: string
  max_members: number
  current_members: number
  is_active: boolean
  status: string
  start_date: string
  profiles: { full_name: string } | null
}

export function GroupsGrid({ groups }: { groups: Group[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Link key={group.id} href={`/groups/${group.id}`}>
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge variant={group.status === "active" ? "success" : "secondary"}>
                  {group.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{group.description || "No description"}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {group.current_members} / {group.max_members} members
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>
                  RWF {group.target_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Started {new Date(group.start_date).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="capitalize flex items-center">
                {group.group_type === "private" ? (
                  <Lock className="mr-1" /> // Lock icon for private group
                ) : (
                  <Globe className="mr-1" /> // Global icon for public group
                )}
                {group.group_type}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
