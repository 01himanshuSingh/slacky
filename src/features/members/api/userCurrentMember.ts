import { useQuery } from "convex/react"
import { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"

interface currentMemberProps{
    workspaceId:Id<'workspaces'>
}

export const userCurrentMember = ({workspaceId}:currentMemberProps)=>{
        const data = useQuery(api.members.current,{workspaceId})  // api call ki with workspace id dal di or user auth se meri id ko check krega and jo meri id and workspace d match kregi wo dega 
        const isLoading = data === undefined;
        return {data, isLoading};
};