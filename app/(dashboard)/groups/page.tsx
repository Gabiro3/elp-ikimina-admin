import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GroupsGrid } from "@/components/groups/groups-grid"

async function getGroups() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("savings_groups")
    .select(
      `
      *,
      profiles:created_by (
        full_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return data || []
}

export default async function GroupsPage() {
  const groups = await getGroups()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Manage savings groups and communications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Groups ({groups.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search groups..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GroupsGrid groups={groups} />
        </CardContent>
      </Card>
    </div>
  )
}
