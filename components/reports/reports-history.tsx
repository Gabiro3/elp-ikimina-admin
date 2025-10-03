import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

type Report = {
  id: string
  report_period_start: string
  report_period_end: string
  report_file_url: string
  created_at: string
  savings_groups: { name: string } | null
  profiles: { full_name: string; email: string } | null
}

export function ReportsHistory({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">No reports uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Group</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.savings_groups?.name || "N/A"}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{new Date(report.report_period_start).toLocaleDateString()}</div>
                  <div className="text-muted-foreground">
                    to {new Date(report.report_period_end).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{report.profiles?.full_name || "Unknown"}</div>
                  <div className="text-muted-foreground">{report.profiles?.email}</div>
                </div>
              </TableCell>
              <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={report.report_file_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={report.report_file_url} download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
