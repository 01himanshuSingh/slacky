import React, { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import { useGetWorkspaces } from '@/features/workspaces/api/usegetworkspaces';
import { usesingleGetWorkspace } from '@/features/workspaces/api/usegetsingleworkspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/createworkspace';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';


function WorkspaceSwitcher() {
  const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [open, setOpen]= useCreateWorkspaceModal()
    const {data:Workspaces, isLoading:workspacesLoading} = useGetWorkspaces()
    const {data:workspace, isLoading:workspaceLoading} = usesingleGetWorkspace({id:workspaceId})
    const filterWorkspaces = Workspaces?.filter(
      (workspace) => workspace?._id !== workspaceId  
    )
    
   
    return (
    <>
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className='size-9 ml-2 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl'>{workspaceLoading?(
              <Loader className='size-5 animate-spin'/>
            ):(
              workspace?.name.charAt(0).toLocaleUpperCase()
            )}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='w-64'>
            <DropdownMenuItem className='cursor-pointer flex-col justify-start items-start capitiize' onClick={()=>router.push(`/workspace/${workspaceId}`)}>
              {workspace?.name}
              <span className='text-xs text-muted-foreground'> 🟢 Active Workspace</span>
            </DropdownMenuItem>
            {filterWorkspaces?.map((workspace)=>(
              <DropdownMenuItem
              className='cursor-pointer truncate overflow-hidden'
              key={workspace?._id} onClick={()=>router.push(`/workspace/${workspace?._id}`)}>
                   <div className=' truncate size-9 relative overflow-hidden bg-[#616061] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center'>
                    {workspace?.name.charAt(0).toString().toUpperCase()}
                  </div>
                  {workspace?.name}
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem onClick={()=>setOpen(true)}>
            <div className='size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center'><Plus/> </div>
            Create a new workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default WorkspaceSwitcher