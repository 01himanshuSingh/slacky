'use client'
import { usegetSingleChannels } from '@/features/channels/api/usegetSingleChannel'
import { useChannelId } from '@/hook/useChannelId'
import { Loader, Triangle, TriangleAlert } from 'lucide-react'
import React from 'react'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Header from './Header'
import ChatInput from './ChatInput'


export default function page() {
  const channelId = useChannelId()
  const {data:channel, isLoading:channelisLoading} = usegetSingleChannels({id:channelId})
  if (channelisLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2 p-4">
        {/* Single skeleton for title */}
        <Skeleton width={200} height={30} />

        {/* Multiple skeletons for channel list */}
        <div className="w-full max-w-md">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={20} className="my-2" />
          ))}
        </div>
      </div>
    );
  }

 if(!channel){
 return (
            <div className='h-full flex-1 flex items-center justify-center flex-col gap-2'>
                <TriangleAlert className='size-5 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>Workspace not found</span>
            </div>
        );  
}
  return (
    <>
    <div className='flex flex-col h-full'>

    <Header name={channel.name}/>
    <div className='flex-1 '/>
      <ChatInput placeholder=' write there.. '/>
    </div>
    
    </>
  )
}
