import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


interface useGetWorkspaceProps{
    id:Id<'workspaces'>
}
    
export const usesingleGetWorkspace = ({id}:useGetWorkspaceProps)=>{

    const data = useQuery(api.workspaces.getId,{id});
    const isLoading = data === undefined;
    return {data, isLoading}
}