"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Ban, CheckCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function BanUserButton({ userId, isBanned }: { userId: string; isBanned: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggleBan = async () => {
    setLoading(true)
    const response = await fetch("/api/users/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ban: !isBanned }),
    })

    if (response.ok) {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={isBanned ? "default" : "destructive"}>
          {isBanned ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Unban User
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isBanned ? "Unban User" : "Ban User"}</AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? "This will restore the user's access to the platform. They will be able to log in and participate in groups again."
              : "This will prevent the user from accessing the platform. They will not be able to log in or participate in any groups."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggleBan} disabled={loading}>
            {loading ? "Processing..." : isBanned ? "Unban" : "Ban"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
