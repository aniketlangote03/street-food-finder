import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

const supabase = createClient()

// Centralized map to store active channels
const activeChannels = new Map<string, RealtimeChannel>()

/**
 * Subscribes to real-time changes on a specific table and schema.
 * @param tableName The name of the table to subscribe to.
 * @param onUpdate Callback function to handle incoming payload.
 * @param schema The database schema (defaults to 'public').
 * @param event The type of event to listen for (defaults to '*').
 * @param filter An optional filter string for row-level filtering.
 * @returns The RealtimeChannel instance.
 */
export function subscribeToTableChanges(
  tableName: string,
  onUpdate: (payload: any) => void,
  schema = "public",
  event: "*" | "INSERT" | "UPDATE" | "DELETE" = "*",
  filter?: string,
): RealtimeChannel {
  const channelName = `table_changes:${schema}:${tableName}:${event}:${filter || "no-filter"}`

  if (activeChannels.has(channelName)) {
    console.warn(`Already subscribed to channel: ${channelName}. Returning existing channel.`)
    return activeChannels.get(channelName)!
  }

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event,
        schema,
        table: tableName,
        filter,
      },
      onUpdate,
    )
    .subscribe()

  activeChannels.set(channelName, channel)

  console.log(`Subscribed to real-time changes on ${tableName} (Channel: ${channelName})`)

  return channel
}

/**
 * Unsubscribes from a specific real-time channel.
 * @param channel The RealtimeChannel instance to unsubscribe.
 */
export async function unsubscribeFromChannel(channel: RealtimeChannel): Promise<void> {
  if (activeChannels.has(channel.topic)) {
    await supabase.removeChannel(channel)
    activeChannels.delete(channel.topic)
    console.log(`Unsubscribed from channel: ${channel.topic}`)
  } else {
    console.warn(`Attempted to unsubscribe from unknown channel: ${channel.topic}`)
  }
}

/**
 * Unsubscribes from all active real-time channels.
 */
export async function unsubscribeAllChannels(): Promise<void> {
  const removePromises: Promise<"ok" | "timed out">[] = []
  activeChannels.forEach((channel) => {
    removePromises.push(supabase.removeChannel(channel))
  })
  await Promise.all(removePromises)
  activeChannels.clear()
  console.log("Unsubscribed from all real-time channels.")
}

// Example usage (can be removed if not directly used in this file)
// const handleStallUpdate = (payload: any) => {
//   console.log("Stall updated:", payload);
// };
// const stallsChannel = subscribeToTableChanges("stalls", handleStallUpdate, "public", "UPDATE", "is_approved=eq.true");
// // To unsubscribe later:
// // unsubscribeFromChannel(stallsChannel);
