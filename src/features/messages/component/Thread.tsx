'use client'
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import React from 'react'
import { usegetmessage } from '../api/usegetmessage';

interface ThreadProps {
    messageId: any; // ID of the parent
    onClose: () => void; // Function to close the thread
}

function Thread({messageId, onClose}:ThreadProps) {
   const {data:message , isLoading}=  usegetmessage({id:messageId});
   if(isLoading){
     <div className="h-full items-center justify-center ">

                <Loader className="size-5 animate-spin text-muted-foreground"/>
            </div>}

if(!message){
     return (
    <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center p-4 border-b '>
        <p>Thread</p>
        <Button onClick={onClose}> <XIcon/></Button>    
             </div>
              <div className="h-full items-center gap-y-2 justify-center ">

                <AlertTriangle className="size-5 gap text-muted-foreground"/>
           <p className='text-sm text-muted-foreground '> Message not found</p>
            </div>
        </div>
  )
}

  return (
    <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center p-4 border-b '>
        <p>Thread</p>
        <Button onClick={onClose}> <XIcon/></Button>    
             </div>
             {JSON.stringify(message)}
        </div>
  )
}

export default Thread