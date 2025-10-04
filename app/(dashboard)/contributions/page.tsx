import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContributionsTable } from "@/components/contributions/contributions-table"
import { PendingApprovals } from "@/components/contributions/pending-approvals"
import { ExportContributionsButton } from "@/components/contributions/export-contributions-button"

async function getContributions() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("contributions")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email
      ),
      savings_groups:group_id (
        name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return data || []
}

async function getPendingContributions() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("contributions")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email,
        phone_number
      ),
      savings_groups:group_id (
        name
      )
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function ContributionsPage() {
  const contributions = await getContributions()
  const pendingContributions = await getPendingContributions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
          <p className="text-muted-foreground">Manage and approve member contributions</p>
        </div>
        <ExportContributionsButton contributions={contributions} />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contributions</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingContributions.length > 0 && (
              <span className="ml-2 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                {pendingContributions.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <ContributionsTable contributions={contributions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <PendingApprovals contributions={pendingContributions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
