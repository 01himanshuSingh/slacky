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
  import { Button } from '@/components/ui/button'
  
import { useCreateWorkspaceModal } from '../store/createworkspace'
import { Input } from '@/components/ui/input'
import { useCreateWorkpace } from '../api/useCreateworkspaces'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
  
export const CreateWorkspaces=()=> {
  const router = useRouter()
  const [name, setname] = useState('');
    const [open , setopen]= useCreateWorkspaceModal();
    const {mutate, isPending} = useCreateWorkpace()
    const handleClose =()=>{
        setopen(false);
        setname('')
    }

    const handleSubmit =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        mutate({name},{
          onSuccess(id) {
            console.log(id)
            toast.success('workspaces created ');
            router.push(`/workspace/${id}`)
            handleClose()
          },
        })
    }
  return (
    <>
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add a workspaces
                </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4' >
                  <Input 
                    value={name}
                    disabled = {isPending}
                    required
                    onChange={(e)=> setname(e.target.value)}
                    autoFocus
                    minLength={3}
                    placeholder='workspaces name e.g. work, Personal , Home '
                  />
                  <Button className='flex justify-end' disabled={isPending}> Add</Button>
            </form>
        </DialogContent>
    </Dialog>
    </>
  )
}
