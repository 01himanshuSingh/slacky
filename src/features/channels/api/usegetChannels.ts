import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

    interface usegetChannelProps{
        workspaceId:Id<'workspaces'>;

    }
    export const usegetChannels=({workspaceId}:usegetChannelProps)=>{
        // channel nikal workspce se jo connect hai 
        const data = useQuery(api.channels.get,{workspaceId})
        const isLoading = data === undefined;
    return  {data, isLoading};
    }