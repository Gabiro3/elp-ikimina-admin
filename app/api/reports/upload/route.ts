import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const groupId = formData.get("groupId") as string
    const periodStart = formData.get("periodStart") as string
    const periodEnd = formData.get("periodEnd") as string
    const file = formData.get("file") as File

    if (!groupId || !periodStart || !periodEnd || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${groupId}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contribution-reports")
      .upload(fileName, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("contribution-reports").getPublicUrl(fileName)

    // Create report record
    const { error: insertError } = await supabase.from("contribution_reports").insert({
      group_id: groupId,
      report_period_start: periodStart,
      report_period_end: periodEnd,
      report_file_url: publicUrl,
      uploaded_by: user.id,
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
