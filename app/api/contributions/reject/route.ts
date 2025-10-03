import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { contributionId, notes } = await request.json()
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update contribution status
    const { error: updateError } = await supabase
      .from("contributions")
      .update({ status: "rejected" })
      .eq("id", contributionId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Create verification record
    await supabase.from("contribution_verifications").insert({
      contribution_id: contributionId,
      verified_by: user.id,
      verification_status: "rejected",
      verification_notes: notes,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
