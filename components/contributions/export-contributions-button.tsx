"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import * as XLSX from "xlsx"

interface Contribution {
    id: string
    amount: number
    status: string
    created_at: string
    profiles: {
        full_name: string
        email: string
    } | null
    savings_groups: {
        name: string
    } | null
}

interface ExportContributionsButtonProps {
    contributions: Contribution[]
}

export function ExportContributionsButton({ contributions }: ExportContributionsButtonProps) {
    const handleExport = () => {
        // Prepare data for Excel
        const exportData = contributions.map((contribution) => ({
            "Contribution ID": contribution.id,
            "Member Name": contribution.profiles?.full_name || "N/A",
            "Member Email": contribution.profiles?.email || "N/A",
            "Group Name": contribution.savings_groups?.name || "N/A",
            "Amount (RWF)": contribution.amount,
            Status: contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1),
            Date: new Date(contribution.created_at).toLocaleDateString(),
            Time: new Date(contribution.created_at).toLocaleTimeString(),
        }))

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(exportData)

        // Set column widths
        ws["!cols"] = [
            { wch: 30 }, // Contribution ID
            { wch: 20 }, // Member Name
            { wch: 25 }, // Member Email
            { wch: 20 }, // Group Name
            { wch: 15 }, // Amount
            { wch: 12 }, // Status
            { wch: 12 }, // Date
            { wch: 12 }, // Time
        ]

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Contributions")

        // Generate filename with current date
        const filename = `contributions_${new Date().toISOString().split("T")[0]}.xlsx`

        // Save file
        XLSX.writeFile(wb, filename)
    }

    return (
        <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
        </Button>
    )
}
