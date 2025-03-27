'use client'
import { Button } from '@/components/ui/button';
import { usesingleGetWorkspaceInfo } from '@/features/workspaces/api/usegetsingleworkspaceInfo';
import { useJoin } from '@/features/workspaces/api/useJoin';
import { useWorkspaceId } from '@/hook/useWorkspaceid';
import { HashIcon, Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react'
import VerificationInput from "react-verification-input";
import { toast } from 'sonner';

// interface joinProps{
// params:{
//     workspaceId:string
// }

// }

export default function page() {
    const router = useRouter();
  const workspaceId = useWorkspaceId();
  const {data, isLoading} = usesingleGetWorkspaceInfo({id:workspaceId})
    const {mutate, isPending} =useJoin()
    const isMember = useMemo(()=>data?.isMember,[data?.isMember])

        useEffect(()=>{
            if(isMember){
                //agar me phele se member hunga to page home page me redirect krega 
                router.push(`/workspace/${workspaceId}`)
            }
        },[isMember, router, workspaceId])

    const handleComplete = (value:string)=>{
        mutate({workspaceId,joinCode:value},{
            onSuccess:(id)=>{
                router.replace(`/workspace/${id}`);
                toast.success('Workspace Joined 😊')
            },
            onError:()=>{
                toast.error('Failed to joined workspace 😊')
            }
        })
    }
  if(isLoading){
    return(
        <div className='h-full flex items-center justify-center'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>
    )
  }
  return (
    <div
    className='h-full  flex flex-col gap-y-8 items-center justify-center bg-white p-8 '    
    >
        <HashIcon/>
    <div className='felx flex-col gap-y-4 items-center justify-center max-w-md'>
        <div className='flex flex-col gap-y-2 items-center justify-center'>
            <h1 className='text-2xl font-bold'>
                Join {data?.name}
            </h1>
            <p className='text-md text-muted-foreground'>
                Enter the workpsace code to join
            </p>
        </div>
        <VerificationInput
        onComplete={handleComplete}
        length={6} 
        classNames={{
            container:'flex gap-x-2'
            , character:'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500 '
            , characterInactive:'bg-muted',
            characterSelected:'bg-white text-black',
            characterFilled:'bg-white text-black'
        }} 
        autoFocus
        />
    </div>
    <div className='flex gap-x-2'>
        <Button size='lg' variant='outline' asChild><Link href='/'>Back to home</Link></Button>
    </div>
    </div>
  )
}
