import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ban, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RecentActivity } from "@/components/users/recent-activity"
import { BanUserButton } from "@/components/users/ban-user-button"

async function getUser(id: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("profiles").select("*").eq("id", id).single()

  return data
}

async function getUserGroups(userId: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("group_members")
    .select(
      `
      *,
      savings_groups (
        name,
        group_type,
        status
      )
    `,
    )
    .eq("user_id", userId)

  return data || []
}

async function getUserContributions(userId: string) {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("contributions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  return data || []
}

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  const groups = await getUserGroups(params.id)
  const contributions = await getUserContributions(params.id)

  if (!user) {
    return <div>User not found</div>
  }

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>
        <BanUserButton userId={user.id} isBanned={user.is_banned} />
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profile_picture_url || undefined} />
              <AvatarFallback className="text-2xl">{user.full_name?.[0] || user.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{user.full_name || "No name"}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                {user.is_verified && (
                  <Badge variant="default">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {user.is_banned && (
                  <Badge variant="destructive">
                    <Ban className="mr-1 h-3 w-3" />
                    Banned
                  </Badge>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{user.phone_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pf Number</p>
                  <p className="font-medium">{user.pf_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scholar Cohort</p>
                  <p className="font-medium">
                    {user.cohort_number ? "Cohort " + user.cohort_number : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{user.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Groups Joined</span>
              <span className="text-2xl font-bold">{groups.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Contributions</span>
              <span className="text-2xl font-bold">{contributions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold">RWF {totalContributions.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {groups.length > 0 ? (
                groups.map((membership: any) => (
                  <div key={membership.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{membership.savings_groups?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {membership.role} • {membership.savings_groups?.group_type}
                      </p>
                    </div>
                    <Badge variant={membership.savings_groups?.status === "active" ? "default" : "secondary"}>
                      {membership.savings_groups?.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No groups joined</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity contributions={contributions} />
        </CardContent>
      </Card>
    </div>
  )
}
