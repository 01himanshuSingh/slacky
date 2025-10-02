'use client';

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  const results = useQuery(api.messages.get, {
    channelId,
    conversationId,
    parentMessageId,
  });

  const loading = results === undefined;

  return {
  results: results?.page || [], // If still loading, fallback to []
    loading,
  };
};
