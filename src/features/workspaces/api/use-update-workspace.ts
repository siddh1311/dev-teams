import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { id: Id<"workspaces">; name: string };
type ResponseType = Id<"workspaces"> | null;

type Optons = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

/**
 * A hook to update a workspace.
 *
 * @returns
 * - `mutate`: The mutation function to update the workspace.
 * - `data`: The response from the mutation.
 * - `error`: An error if the mutation fails.
 * - `isPending`, `isSuccess`, `isError`, `isSettled`: States of the mutation.
 */
export const useUpdateWorkspace = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "settled" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Optons) => {
      try {
        // Resetting all the states
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);

        if (options?.throwError) throw error;
      } finally {
        setStatus("settled");
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
