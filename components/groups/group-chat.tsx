"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  message_text: string
  created_at: string
  sender_id: string
  profiles?: {
    full_name: string
    email: string
  }
}

export function GroupChat({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = getSupabaseBrowserClient()

  // Fetch messages on mount and subscribe to new ones
  useEffect(() => {
    fetchMessages()

    // Subscribe to new messages using Supabase real-time
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_chat_messages",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId])

  // Scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch the messages from the database
  const fetchMessages = async () => {
    const { data } = await supabase
      .from("group_chat_messages")
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (data) {
      setMessages(data)
    }
  }

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  // Handle sending the new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    const response = await fetch("/api/groups/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        message: newMessage,
      }),
    })

    if (response.ok) {
      setNewMessage("")
      fetchMessages()  // Optional: update messages immediately after sending
    }
    setLoading(false)
  }

  return (
    <div className="flex h-[500px] flex-col">
      <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{message.profiles?.full_name?.[0] || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{message.profiles?.full_name || "Admin"}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`text-sm px-4 py-2 rounded-lg inline-block ${message.sender_id === supabase.auth.getUser()?.id
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  {message.message_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
