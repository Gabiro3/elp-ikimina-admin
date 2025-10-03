import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PDFViewer } from "@/components/contributions/pdf-viewer"

async function getContribution(id: string) {
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
    .eq("id", id)
    .single()

  return data
}

export default async function ContributionDetailPage({ params }: { params: { id: string } }) {
  const contribution = await getContribution(params.id)

  if (!contribution) {
    return <div>Contribution not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/contributions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contribution Details</h1>
          <p className="text-muted-foreground">View contribution information</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={
                  contribution.status === "verified"
                    ? "default"
                    : contribution.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {contribution.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Member</p>
              <p className="font-medium">{contribution.profiles?.full_name || "Unknown"}</p>
              <p className="text-sm text-muted-foreground">{contribution.profiles?.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Group</p>
              <p className="font-medium">{contribution.savings_groups?.name || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">RWF {contribution.amount.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(contribution.contribution_date).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium capitalize">{contribution.payment_method.replace("_", " ")}</p>
            </div>

            {contribution.transaction_reference && (
              <div>
                <p className="text-sm text-muted-foreground">Transaction Reference</p>
                <p className="font-mono text-sm">{contribution.transaction_reference}</p>
              </div>
            )}

            {contribution.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{contribution.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proof Document</CardTitle>
          </CardHeader>
          <CardContent>
            {contribution.statement_file_url ? (
              <PDFViewer url={contribution.statement_file_url} />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">No document uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
