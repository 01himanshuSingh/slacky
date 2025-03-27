'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useCreateChannelModal } from '../store/useCreateChannelModel'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateChannel } from '../api/useCreateChannel';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function CreateChannelModal() {
  const router = useRouter();
  const [open, setopen] = useCreateChannelModal();
  const{mutate, isPending} = useCreateChannel();
  const [name, setname] = useState('');
  const handleClose= ()=>{
    setname('')
    setopen(false)
  }
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const value  = e.target.value.replace(/\s+/g,"-").toLowerCase()
    setname(value);
  }
 const workspaceId = useWorkspaceId()
  // Final submit
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    mutate({
      name,
      workspaceId
    },
  {
    onSuccess:(id)=>{
      handleClose();
      router.push(`/workspace/${workspaceId}/channel/${id}`)
      toast.success('Channel Created Successfully ')
    }
    ,
    onError:()=>{
        toast.error('failed to create a channel')
    }
  })
  }
    return (
        <>
        <Dialog open={open} onOpenChange={handleClose}>
<DialogContent>
  <DialogHeader>
    <DialogTitle> Add a Channel</DialogTitle>
  </DialogHeader>
  <form className='space-y-4' onSubmit={handleSubmit}> 
    <Input
    value={name}
    disabled={isPending}
    onChange={handleChange}
    required
    autoFocus
    minLength={3}
    maxLength={70}
    placeholder='e.g. plan-budget'
    />
    <div className='flex justify-end'>
      <Button disabled={isPending }>Create</Button> </div>
  </form>
</DialogContent>
        </Dialog>
        </>
    )
}
