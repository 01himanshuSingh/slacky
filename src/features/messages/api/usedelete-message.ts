import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
    id:Id<"messages">
};
type ResonseType = Id<"messages">| null;
type Options={
    onSuccess?: (data:ResonseType)=>void;
    onError?: (error: Error)=> void;
    onSettled?: ()=>void
    throwError?: boolean;
}
export const usedeleteMessages = ()=>{
    const [data, setdata] = useState<ResonseType>(null)
    const [error, seterror]  = useState<Error | null>(null);
   // const [isPending , setIsPending] = useState(false);
    //const [isSuccess, setSuccess] = useState(false)
    //const [isError, setIsError] = useState(false)
    //const [issettled, setIssettled] = useState(false)
    const [status, setStatus] = useState<"success"|"error"| "settled"| "pending"|null>(null)
    const isPending= useMemo(()=>status === 'pending',[status]);
    const isSuccess = useMemo(()=> status === 'success', [status])
    const isError = useMemo(()=>status ==='error',[status])
    const issettled = useMemo(()=>status === 'settled',[status])

    const mutation = useMutation(api.messages.remove)
        const mutate = useCallback(async(value:RequestType, options?:Options)=>{
            try {
                setdata(null)
                seterror(null)
                setStatus('pending')
                const response = await mutation(value);
                    options?.onSuccess?.(response)
                    return response
            } catch (error) {
                setStatus('error')
                    options?.onError?.(error as Error)
                    if(options?.throwError){
                    throw error
                }
            }finally{
             setStatus('settled')
                    options?.onSettled?.()
            }
        },[mutation])
            return {mutate,
                data, error, 
                isPending, isSuccess, isError, issettled
            };    
    }