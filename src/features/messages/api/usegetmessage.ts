import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

    interface usegetMessageProps{
        id:Id<'messages'>;

    }
    export const usegetmessage=({id}:usegetMessageProps)=>{
        // channel nikal workspce se jo connect hai 
        const data = useQuery(api.messages.getById,{id})
        const isLoading = data === undefined;
    return  {data, isLoading};
    }