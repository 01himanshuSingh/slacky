import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessagesProps {
  channelId?: Id<"channels"> | string;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  // ✅ Only send valid Convex IDs
  const safeChannelId =
    typeof channelId === "string" && channelId.startsWith("draft")
      ? undefined
      : (channelId as Id<"channels"> | undefined);

  const results = useQuery(api.messages.get, {
    channelId: safeChannelId,
    conversationId,
    parentMessageId,
  });

  const loading = results === undefined;

  return {
    results: results?.page || [],
    loading,
  };
};
