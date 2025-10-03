"use client"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

type Contribution = {
  id: string
  amount: number
  contribution_date: string
  payment_method: string
  status: string
  profiles: { full_name: string; email: string } | null
  savings_groups: { name: string } | null
}

export function ContributionsTable({ contributions }: { contributions: Contribution[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((contribution) => (
            <TableRow key={contribution.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{contribution.profiles?.full_name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{contribution.profiles?.email}</div>
                </div>
              </TableCell>
              <TableCell>{contribution.savings_groups?.name || "N/A"}</TableCell>
              <TableCell className="font-medium">RWF {contribution.amount.toLocaleString()}</TableCell>
              <TableCell>{new Date(contribution.contribution_date).toLocaleDateString()}</TableCell>
              <TableCell className="capitalize">{contribution.payment_method.replace("_", " ")}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    contribution.status === "verified"
                      ? "success"
                      : contribution.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {contribution.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/contributions/${contribution.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
