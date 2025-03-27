'use client'
import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { CopyIcon, Ghost, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useWorkspaceId } from '@/hook/useWorkspaceid'
import { useUpdateInviteCode } from '@/features/workspaces/api/useUpdateInvteCode'

  interface InviteModalProps{
    open:boolean,
    setOpen :(open:boolean)=>void
    name:string,
    joinCode:string
  }
 
export default function InviteModal({open,setOpen, name,joinCode}:InviteModalProps) {
  const workspaceId = useWorkspaceId();
  const {mutate, isPending} = useUpdateInviteCode()

  const handleNewCode = ()=>{
    mutate({workspaceId},{
      onSuccess() {
        toast.success('New code Generated ')
      },
    })
  }
  const copylink = ()=>{
    const inviteLink = `${window.location.origin}/join/${workspaceId}`   // tumhare webpage ka base url dega 
    navigator.clipboard.writeText(inviteLink).then(()=>toast.success('Invite Linked copy successfully'))
  }
 
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Invite members to {name}</DialogTitle>
                <DialogDescription>
                    Use the code below to invite people to your workspace 
                </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
              <p className='text-4xl font-bold tracking-widest uppercase'>
                {joinCode}
              </p>
             <Button variant='outline'
             size='sm' onClick={copylink}>
              Copy Link
             <CopyIcon className='size-4 ml-2' />
             </Button>

            </div>
            <div className='flex items-center justify-between w-full'>
              <Button onClick={handleNewCode}  disabled={isPending}>
               Generate New Code 
               <RefreshCcw className='size-4 ml-2'/>
              </Button>
              <DialogClose asChild>
                <Button>
                  Close
                </Button>
              </DialogClose>
            </div>
        </DialogContent>
    </Dialog>

  )
}
