
import { userCurrentMember } from '@/features/members/api/userCurrentMember';
import { usesingleGetWorkspace } from '@/features/workspaces/api/usegetsingleworkspaces';
import { useGetWorkspaces } from '@/features/workspaces/api/usegetworkspaces';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import React from 'react';
import Workspaceheader from './Workspaceheader';
import SidebarItem from './SidebarItem';
import { usegetChannels } from '@/features/channels/api/usegetChannels';
import WorkspaceSecton from './WorkspaceSecton';
import { userGetMember } from '@/features/members/api/useGetMebers';
import UserItems from './UserItems';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModel';
import { useChannelId } from '@/hook/useChannelId';

function WorkspaceSlider() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [_open , setopen] = useCreateChannelModal();
  const { data: channels, isLoading: channelsLoading } = usegetChannels({ workspaceId });
  const { data: member, isLoading: memberLoading } = userCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = usesingleGetWorkspace({ id: workspaceId });
  const { data: members, isLoading: membersLoading } = userGetMember({ workspaceId });

  // Show loader if data is still loading
  if (memberLoading || workspaceLoading) {
    return (
      <div className='flex flex-col bg-[#5E2c5f] h-full items-center justify-center'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    );
  }

  // Show an alert if no workspace or user is found
  if (!member || !workspace) {
    return (
      <div className='flex flex-col bg-[#5E2c5f] h-full items-center justify-center'>
        <AlertTriangle className="text-white" />
        <p className="text-white">No User and No Workspaces</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col bg-[#5E2c5f] h-full'>
      {/* Workspace Header */}
      <Workspaceheader workspace={workspace} isAdmin={member.role === 'admin'} />
      
      {/* Sidebar Items */}
      <div className='flex flex-col px-2 mt-3'>
        <SidebarItem label='Threads' icon={MessageSquareText} id='threads'  />
        <SidebarItem label='Draft & Send' icon={SendHorizonal} id='draft' />
      </div>

      {/* Channels Section onNew section chelga tabhi hum channel add kr skte hai  */}
      <WorkspaceSecton label='Channels' hint='New Channel' onNew={member.role==='admin'?() => {setopen(true)}:undefined} >
        {channels?.map((item) => (
          <SidebarItem key={item._id} label={item.name} icon={HashIcon} variant={channelId == item._id ?'active':'default'} id={item._id} />
        ))}
      </WorkspaceSecton>

      {/* Members Section */}
      <WorkspaceSecton label='Direct messages ' hint='start new messages ' onNew={() => {}}>
        {members?.map((items) => (
          <UserItems key={items._id} id={items._id} label={items.user.name} image={items.user.image} />
        ))}
      </WorkspaceSecton>
    </div>
  );
}

export default WorkspaceSlider;
