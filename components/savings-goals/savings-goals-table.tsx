"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditGoalDialog } from "./edit-goal-dialog"
import { DeleteGoalDialog } from "./delete-goal-dialog"

interface SavingsGoal {
    id: string
    title: string
    description: string | null
    target_amount: number
    current_amount: number
    deadline: string
    status: string
    savings_groups: {
        name: string
    } | null
    profiles: {
        full_name: string
    } | null
    created_at: string
}

interface SavingsGoalsTableProps {
    goals: SavingsGoal[]
}

export function SavingsGoalsTable({ goals }: SavingsGoalsTableProps) {
    const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
    const [deletingGoal, setDeletingGoal] = useState<SavingsGoal | null>(null)

    if (goals.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No savings goals found. Create your first goal to get started.
            </div>
        )
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Target Amount</TableHead>
                            <TableHead>Current Amount</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goals.map((goal) => {
                            const progress = (goal.current_amount / goal.target_amount) * 100
                            return (
                                <TableRow key={goal.id}>
                                    <TableCell className="font-medium">{goal.title}</TableCell>
                                    <TableCell>{goal.savings_groups?.name || "N/A"}</TableCell>
                                    <TableCell>RWF {goal.target_amount.toLocaleString()}</TableCell>
                                    <TableCell>RWF {goal.current_amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(goal.deadline).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                goal.status === "active" ? "default" : goal.status === "completed" ? "secondary" : "outline"
                                            }
                                        >
                                            {goal.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingGoal(goal)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeletingGoal(goal)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {editingGoal && (
                <EditGoalDialog
                    goal={editingGoal}
                    open={!!editingGoal}
                    onOpenChange={(open) => !open && setEditingGoal(null)}
                />
            )}

            {deletingGoal && (
                <DeleteGoalDialog
                    goal={deletingGoal}
                    open={!!deletingGoal}
                    onOpenChange={(open) => !open && setDeletingGoal(null)}
                />
            )}
        </>
    )
}
