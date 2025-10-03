import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Wallet, Calendar } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { GroupChat } from "@/components/groups/group-chat"
import { GroupMembers } from "@/components/groups/group-members"

async function getGroup(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("savings_groups")
    .select(
      `
      *,
      profiles:created_by (
        full_name,
        email
      )
    `,
    )
    .eq("id", id)
    .single()

  return data
}

async function getGroupMembers(groupId: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("group_members")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email,
        avatar_url
      )
    `,
    )
    .eq("group_id", groupId)

  return data || []
}

async function getGroupContributions(groupId: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("contributions").select("amount, status").eq("group_id", groupId)

  const totalContributions = data?.length || 0
  const totalAmount = data?.filter((c) => c.status === "verified").reduce((sum, c) => sum + c.amount, 0) || 0

  return { totalContributions, totalAmount }
}

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = await getGroup(params.id)
  const members = await getGroupMembers(params.id)
  const { totalContributions, totalAmount } = await getGroupContributions(params.id)

  if (!group) {
    return <div>Group not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/groups">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            <Badge variant={group.status === "active" ? "default" : "secondary"}>
              {group.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{group.description || "No description"}</p>
        </div>
      </div>

      {/* Group Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {group.current_members} / {group.max_members}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contribution Amount</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {group.contribution_amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground capitalize">{group.contribution_frequency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContributions}</div>
            <p className="text-xs text-muted-foreground">Target: RWF {totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Start Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(group.start_date).toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground capitalize">{group.group_type} group</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Group Chat */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Group Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupChat groupId={params.id} />
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <GroupMembers members={members} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
