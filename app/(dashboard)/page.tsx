import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, UsersRound, TrendingUp } from 'lucide-react'
import { RecentContributions } from "@/components/dashboard/recent-contributions"
import { ContributionsChart } from "@/components/dashboard/contributions-chart"

async function getAnalytics() {
  const supabase = await getSupabaseServerClient()

  // Get total users
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  // Get total groups
  const { count: totalGroups } = await supabase.from("savings_groups").select("*", { count: "exact", head: true })

  // Get total contributions
  const { data: contributions } = await supabase.from("contributions").select("amount, status")

  const totalContributions = contributions?.length || 0
  const totalAmount =
    contributions?.filter((c) => c.status === "verified").reduce((sum, c) => sum + c.amount, 0) || 0

  return {
    totalUsers: totalUsers || 0,
    totalGroups: totalGroups || 0,
    totalContributions,
    totalAmount,
  }
}

export default async function DashboardPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your savings platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalGroups.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Savings groups created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContributions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {analytics.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Verified contributions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Contributions Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ContributionsChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentContributions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
