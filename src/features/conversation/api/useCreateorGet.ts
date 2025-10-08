import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

// Request type (you pass workspaceId + memberId)
type RequestType = { 
  workspaceId: Id<"workspaces">,
  memberId: Id<"members">
};

// Response type (your server mutation returns conversationId)
type ResponseType = Id<"conversations"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const usecreateorgetConversation = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.conversation.createOrGet);

  const mutate = useCallback(
    async (value: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(value); // this returns conversationId

        setData(response);       // ✅ Save in state
        setStatus("success");
        options?.onSuccess?.(response);

        return response;         // ✅ Also return directly
      } catch (err) {
        setStatus("error");
        setError(err as Error);
        options?.onError?.(err as Error);

        if (options?.throwError) throw err;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,       // conversationId will be here
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
