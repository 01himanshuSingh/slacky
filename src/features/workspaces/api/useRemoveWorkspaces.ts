import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

// Type Definitions
type RequestType = { id: Id<"workspaces"> };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: Id<"workspaces">) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useRemoveWorkspace = () => {
  // State for mutation
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null);

  // Memoized derived states
  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  // Convex mutation for workspace deletion
  const mutation = useMutation(api.workspaces.remove);

  // Callback function to trigger workspace deletion
  const mutate = useCallback(
    async (value: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        // Execute the mutation
        const response = await mutation(value);

        // Update state on success
        setData(response);
        setStatus("success");

        // Invoke success callback
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setError(error as Error);
        setStatus("error");

        // Invoke error callback
        options?.onError?.(error as Error);

        // Re-throw error if `throwError` is true
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");

        // Invoke the settled callback
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
