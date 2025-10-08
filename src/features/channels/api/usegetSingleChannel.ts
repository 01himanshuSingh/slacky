import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSingleChannelProps {
  id?: Id<'channels'> | "draft";
}

export const usegetSingleChannels = ({ id }: UseGetSingleChannelProps) => {
  const enabled = id && id !== "draft";

  const data = useQuery(
    api.channels.getById,
    enabled ? { id: id as Id<'channels'> } : "skip"
  );

  const isLoading = enabled && data === undefined;

  return { data, isLoading };
};
