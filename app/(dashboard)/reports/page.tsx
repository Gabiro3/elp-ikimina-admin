import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportUploadForm } from "@/components/reports/report-upload-form"
import { ReportsHistory } from "@/components/reports/reports-history"

async function getGroups() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase.from("savings_groups").select("id, name, status")

  return data || []
}

async function getReports() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("contribution_reports")
    .select(
      `
      *,
      savings_groups (
        name
      ),
      profiles:uploaded_by (
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })

  return data || []
}

export default async function ReportsPage() {
  const groups = await getGroups()
  const reports = await getReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Upload and manage contribution reports for groups</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportUploadForm groups={groups} />
          </CardContent>
        </Card>

        {/* Reports History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reports History</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportsHistory reports={reports} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
