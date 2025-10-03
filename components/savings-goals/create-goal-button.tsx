"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateGoalDialog } from "./create-goal-dialog"

export function CreateGoalButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
            </Button>
            <CreateGoalDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
