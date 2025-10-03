import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

async function getRecentContributions() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("contributions")
    .select(
      `
      id,
      amount,
      created_at,
      status,
      profiles:user_id (
        full_name,
        email
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

export async function RecentContributions() {
  const contributions = await getRecentContributions()

  return (
    <div className="space-y-4">
      {contributions.map((contribution: any) => (
        <div key={contribution.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{contribution.profiles?.full_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{contribution.profiles?.full_name || "Unknown User"}</p>
            <p className="text-sm text-muted-foreground">{contribution.profiles?.email}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">RWF {contribution.amount.toLocaleString()}</div>
            <div
              className={`text-xs ${contribution.status === "verified"
                ? "text-green-600"
                : contribution.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
                }`}
            >
              {contribution.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
