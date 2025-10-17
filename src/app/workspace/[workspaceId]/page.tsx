'use client'

import { usegetChannels } from '@/features/channels/api/usegetChannels';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModel';
import { useCurrentMember } from '@/features/members/api/userCurrentMember';
import { usesingleGetWorkspace } from '@/features/workspaces/api/usegetsingleworkspaces';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { Loader, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

export default function Page() {
    const workspaceId = useWorkspaceId();
    const {data:member, isLoading:memberisLoading} = useCurrentMember({workspaceId})
    const router = useRouter();
    const [open, setOpen]  = useCreateChannelModal(); // Correct destructuring
    
    const { data: workspace, isLoading: workspaceLoading } = usesingleGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelLoading } = usegetChannels({ workspaceId });

    // Ensuring channelId is safely retrieved
    const channelId = useMemo(() => (channels?.length ? channels[0]._id : null), [channels]);
const isAdmin = useMemo(()=>member?.role === 'admin',[member?.role])

    useEffect(() => {
        console.log("Workspace Loading:", workspaceLoading);
        console.log("Channel Loading:", channelLoading);
        console.log("Workspace Data:", workspace);
        console.log("Channels Data:", channels);

        if (workspaceLoading || channelLoading || !workspace || !member ||!workspace) {
            return;
        }

        console.log("Navigating to:", `/workspace/${workspaceId}/channel/${channelId}`);

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);  // Fixed route typo
        } else if (!open && isAdmin) {
            setOpen(true);
        }
        // bar dekho inko kyunki ye update hote rhenge 
    }, [channelId, workspaceLoading, channelLoading, workspace, open, setOpen, router, workspaceId, member, memberisLoading, isAdmin]);

    if (workspaceLoading || channelLoading) {
        return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <Loader className='size-5 animate-spin text-muted-foreground' />
            </div>
        );
    }

    if (!workspace || ! member) {
        return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <TriangleAlert className='size-5 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Workspace not found</span>
            </div>
        );
    }

    return (
        <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
            <TriangleAlert className='size-5 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Workspace not found</span>
        </div>
    );
}
