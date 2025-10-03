"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Check, X } from "lucide-react"
import { PDFViewer } from "./pdf-viewer"

type Contribution = {
  id: string
  amount: number
  contribution_date: string
  payment_method: string
  transaction_reference: string | null
  statement_file_url: string | null
  notes: string | null
  profiles: { full_name: string; email: string; phone_number: string | null } | null
  savings_groups: { name: string } | null
}

export function ContributionApprovalPanel({ contribution }: { contribution: Contribution }) {
  const [loading, setLoading] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false) // state to control the dialog visibility
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    const response = await fetch("/api/contributions/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributionId: contribution.id,
        notes: verificationNotes,
      }),
    })

    if (response.ok) {
      router.refresh()
    }
    setLoading(false)
  }

  const handleReject = async () => {
    setLoading(true)
    const response = await fetch("/api/contributions/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contributionId: contribution.id,
        notes: verificationNotes,
      }),
    })

    if (response.ok) {
      router.refresh()
    }
    setLoading(false)
  }

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Contribution Details */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contribution Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Member</Label>
            <p className="font-medium">{contribution.profiles?.full_name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{contribution.profiles?.email}</p>
            {contribution.profiles?.phone_number && (
              <p className="text-sm text-muted-foreground">{contribution.profiles.phone_number}</p>
            )}
          </div>

          <div>
            <Label className="text-muted-foreground">Group</Label>
            <p className="font-medium">{contribution.savings_groups?.name || "N/A"}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Amount</Label>
            <p className="text-2xl font-bold">RWF {contribution.amount.toLocaleString()}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Date</Label>
            <p className="font-medium">{new Date(contribution.contribution_date).toLocaleDateString()}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Payment Method</Label>
            <p className="font-medium capitalize">{contribution.payment_method.replace("_", " ")}</p>
          </div>

          {contribution.transaction_reference && (
            <div>
              <Label className="text-muted-foreground">Transaction Reference</Label>
              <p className="font-mono text-sm">{contribution.transaction_reference}</p>
            </div>
          )}

          {contribution.notes && (
            <div>
              <Label className="text-muted-foreground">Member Notes</Label>
              <p className="text-sm">{contribution.notes}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification-notes">Verification Notes</Label>
            <Textarea
              id="verification-notes"
              placeholder="Add notes about this verification..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApprove} disabled={loading} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button onClick={handleReject} disabled={loading} variant="destructive" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Statement Button */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Proof Document</CardTitle>
        </CardHeader>
        <CardContent>
          {contribution.statement_file_url ? (
            <Button onClick={toggleDialog} className="w-full">
              View Statement
            </Button>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">No document uploaded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for full-screen PDF viewer */}
      {isDialogOpen && contribution.statement_file_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl">

            {/* PDF Viewer */}
            <div className="h-[80vh] overflow-auto">
              <PDFViewer url={contribution.statement_file_url} />
            </div>

            {/* Close dialog button at the bottom */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary">
              <Button onClick={toggleDialog} variant="outline" className="w-full max-w-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
