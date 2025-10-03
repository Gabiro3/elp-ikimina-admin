import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SavingsGoalsTable } from "@/components/savings-goals/savings-goals-table"
import { CreateGoalButton } from "@/components/savings-goals/create-goal-button"

async function getSavingsGoals() {
    const supabase = await getSupabaseServerClient()

    const { data } = await supabase
        .from("savings_goals")
        .select(
            `
      *,
      savings_groups:group_id (
        name
      ),
      profiles:created_by (
        full_name
      )
    `,
        )
        .order("created_at", { ascending: false })

    return data || []
}

export default async function SavingsGoalsPage() {
    const goals = await getSavingsGoals()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
                    <p className="text-muted-foreground">Create and manage savings goals for groups</p>
                </div>
                <CreateGoalButton />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Savings Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <SavingsGoalsTable goals={goals} />
                </CardContent>
            </Card>
        </div>
    )
}
