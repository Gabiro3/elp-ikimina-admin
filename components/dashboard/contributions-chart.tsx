"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ChartData {
  date: string
  amount: number
}

export function ContributionsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContributions() {
      const supabase = getSupabaseBrowserClient()

      const { data: contributions } = await supabase
        .from("contributions")
        .select("amount, created_at, status")
        .eq("status", "verified")
        .order("created_at", { ascending: true })

      if (contributions) {
        // Group contributions by date
        const groupedData = contributions.reduce((acc: Record<string, number>, contribution: { created_at: string | number | Date; amount: unknown }) => {
          const date = new Date(contribution.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          // Ensure that amount is treated as a number
          const amount = Number(contribution.amount) // Convert to number
          acc[date] = (acc[date] || 0) + amount
          return acc
        }, {})

        // Map groupedData to chartData, ensuring amount is a number
        const chartData = Object.entries(groupedData).map(([date, amount]) => ({
          date,
          amount: Number(amount), // Explicit conversion to number
        }))

        setData(chartData)
      }

      setLoading(false)
    }

    fetchContributions()
  }, [])

  if (loading) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No contribution data available
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        amount: {
          label: "Amount (RWF)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="var(--color-amount)"
            strokeWidth={2}
            dot={{ fill: "var(--color-amount)", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
