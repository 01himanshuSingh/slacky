'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Doc } from '../../../../convex/_generated/dataModel'
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import Hint from '@/components/Hint'
import Preference from './Preference'
import InviteModal from './InviteModal'


interface workspaceheaderProps {
  workspace:Doc<'workspaces'>    // sara data workspace wala as a props mangaunga workspace slide se 
  isAdmin:boolean    // Admn me check krega 
}

function Workspaceheader({workspace, isAdmin}:workspaceheaderProps) {
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
    <InviteModal 
    open={inviteOpen} setOpen={setInviteOpen} name = {workspace.name} joinCode={workspace.joinCode}/>
    <Preference open={open} setOpen={setOpen} initialValue={workspace.name}/> {/** iska set open true nihe se horakha hai prefrence jha likha hai  */}
    <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button className='font-semibold text-lg w-auto p-1.5 bg-pink-700 overflow-hidden' size='sm'>
      <span className='truncate'>{workspace?.name}</span>
        <ChevronDown className='size-3 ml-4 shrink-0'/>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='w-64'>
          <DropdownMenuItem
          className='cursor-pointer capitalize' 
          >
<div className='size-9 relative overflow-hidden bg-[#616061] text-white font semibold text-xl rounded-md flex items-center justify-center'>{workspace.name.charAt(0).toUpperCase()}</div>
<div className='flex flex-col items-start'>
  <p className='flex-bold'> {workspace.name}</p>
  <p className='text-xs text-muted-foreground'>🟢 Active Workspace</p>
</div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
          <DropdownMenuSeparator/>
          <DropdownMenuItem
          className='cursor-pointer py-2'
          onClick={()=>{setInviteOpen(true)}}
          >
            Invite People to {workspace.name}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator/>
          <DropdownMenuItem
          className='cursor-pointer py-2'
          onClick={()=>{setOpen(true)}}
          >
            Perefrences
          </DropdownMenuItem>
            </>
          )}
          </DropdownMenuContent>
      </DropdownMenu>
      <div className='flex items-center gap-0.5'>
  <Hint label='Filter message' side='bottom'>
    <Button size='iconsm' className='bg-transparent'>
      <ListFilter className='size-3' />
    </Button>
  </Hint>
</div>

<div className='flex items-center gap-0.5'>
  <Hint label='New Message' side='bottom'>
    <Button size='iconsm' className=' bg-transparent'>
      <SquarePen className='size-3' />
    </Button>
  </Hint>
</div>


    </div>

    </>
  )
}

export default Workspaceheader