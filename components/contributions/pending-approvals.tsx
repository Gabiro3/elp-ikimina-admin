"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ContributionApprovalPanel } from "./contribution-approval-panel"

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

export function PendingApprovals({ contributions }: { contributions: Contribution[] }) {
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(
    contributions.length > 0 ? contributions[0] : null,
  )

  if (contributions.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">No pending contributions to approve</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* List of pending contributions */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="space-y-2">
            {contributions.map((contribution) => (
              <button
                key={contribution.id}
                onClick={() => setSelectedContribution(contribution)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedContribution?.id === contribution.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
                  }`}
              >
                <div className="font-medium">{contribution.profiles?.full_name || "Unknown"}</div>
                <div className="text-sm text-muted-foreground">{contribution.savings_groups?.name}</div>
                <div className="mt-1 text-sm font-medium">RWF {contribution.amount.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval panel */}
      <div className="lg:col-span-2">
        {selectedContribution && <ContributionApprovalPanel contribution={selectedContribution} />}
      </div>
    </div>
  )
}
