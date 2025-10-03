"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

type Group = {
  id: string
  name: string
}

export function ReportUploadForm({ groups }: { groups: Group[] }) {
  const [selectedGroup, setSelectedGroup] = useState("")
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup || !periodStart || !periodEnd || !file) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("groupId", selectedGroup)
    formData.append("periodStart", periodStart)
    formData.append("periodEnd", periodEnd)
    formData.append("file", file)

    const response = await fetch("/api/reports/upload", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      setSelectedGroup("")
      setPeriodStart("")
      setPeriodEnd("")
      setFile(null)
      router.refresh()
    } else {
      const data = await response.json()
      setError(data.error || "Failed to upload report")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="group">Select Group</Label>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger id="group">
            <SelectValue placeholder="Choose a group" />
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
        <Label htmlFor="period-start">Period Start</Label>
        <Input
          id="period-start"
          type="date"
          value={periodStart}
          onChange={(e) => setPeriodStart(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="period-end">Period End</Label>
        <Input id="period-end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Report File</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        <Upload className="mr-2 h-4 w-4" />
        {loading ? "Uploading..." : "Upload Report"}
      </Button>
    </form>
  )
}
