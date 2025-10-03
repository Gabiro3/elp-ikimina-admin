"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface CreateGoalDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        groupId: "",
        targetAmount: "",
        deadline: "",
    })
    const router = useRouter()
    const supabase = getSupabaseBrowserClient()

    useEffect(() => {
        async function fetchGroups() {
            const { data } = await supabase.from("savings_groups").select("id, name").order("name")
            if (data) setGroups(data)
        }
        if (open) fetchGroups()
    }, [open, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data: userData } = await supabase.auth.getUser()

        const { error } = await supabase.from("savings_goals").insert({
            title: formData.title,
            description: formData.description || null,
            group_id: formData.groupId,
            target_amount: Number.parseFloat(formData.targetAmount),
            current_amount: 0,
            deadline: formData.deadline,
            status: "active",
            created_by: userData.user?.id,
        })

        setLoading(false)

        if (!error) {
            onOpenChange(false)
            router.refresh()
            setFormData({
                title: "",
                description: "",
                groupId: "",
                targetAmount: "",
                deadline: "",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Savings Goal</DialogTitle>
                    <DialogDescription>Create a new savings goal for a group</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Goal Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Emergency Fund"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="group">Group</Label>
                            <Select value={formData.groupId} onValueChange={(value) => setFormData({ ...formData, groupId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetAmount">Target Amount (RWF)</Label>
                            <Input
                                id="targetAmount"
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                placeholder="1000000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Goal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
