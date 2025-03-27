import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

    interface usegetSingleChannelProps{
        id:Id<'channels'>;

    }
    export const usegetSingleChannels=({id}:usegetSingleChannelProps)=>{
        // channel nikal workspce se jo connect hai 
        const data = useQuery(api.channels.getById,{id})
        const isLoading = data === undefined;
    return  {data, isLoading};
    }