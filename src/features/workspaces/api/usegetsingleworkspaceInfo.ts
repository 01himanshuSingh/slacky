import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


interface useGetWorkspaceInfoProps{
    id:Id<'workspaces'>
}
    
export const usesingleGetWorkspaceInfo = ({id}:useGetWorkspaceInfoProps)=>{

    const data = useQuery(api.workspaces.getInfoId,{id});
    const isLoading = data === undefined;
    return {data, isLoading}
}