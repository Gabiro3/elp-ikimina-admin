import { Badge } from "@/components/ui/badge"

type Contribution = {
  id: string
  amount: number
  contribution_date: string
  status: string
  payment_method: string
}

export function RecentActivity({ contributions }: { contributions: Contribution[] }) {
  if (contributions.length === 0) {
    return <p className="text-center text-muted-foreground">No recent activity</p>
  }

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <div key={contribution.id} className="flex items-center justify-between border-b pb-4 last:border-0">
          <div>
            <p className="font-medium">Contribution</p>
            <p className="text-sm text-muted-foreground">
              {new Date(contribution.contribution_date).toLocaleDateString()} •{" "}
              {contribution.payment_method.replace("_", " ")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">RWF {contribution.amount.toLocaleString()}</p>
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
        </div>
      ))}
    </div>
  )
}
