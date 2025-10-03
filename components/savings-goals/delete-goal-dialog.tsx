"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface SavingsGoal {
    id: string
    title: string
}

interface DeleteGoalDialogProps {
    goal: SavingsGoal
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteGoalDialog({ goal, open, onOpenChange }: DeleteGoalDialogProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = getSupabaseBrowserClient()

    const handleDelete = async () => {
        setLoading(true)

        const { error } = await supabase.from("savings_goals").delete().eq("id", goal.id)

        setLoading(false)

        if (!error) {
            onOpenChange(false)
            router.refresh()
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the savings goal "{goal.title}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
